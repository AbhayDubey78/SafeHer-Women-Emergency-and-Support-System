import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SafetyStatusType, 
  TrustedContact, 
  EmergencyEvent, 
  LocationTelemetry, 
  GeofenceZone, 
  CheckInTimer, 
  AppNotification, 
  UserProfile 
} from '../types';
import { 
  initialUserProfile, 
  initialTrustedContacts, 
  initialEmergencyEvents, 
  initialGeofences 
} from '../mockData';
import { audioService } from '../services/audioService';
import { sendBackendSosTrigger, validateIndianPhoneNumber, SosResponseData } from '../services/apiService';
import { sendClientEmergencyEmail, Web3FormsClientResult } from '../services/web3formsClient';

interface SafetyContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  safetyStatus: SafetyStatusType;
  
  // Emergency SOS Workflow
  isSosCountdownActive: boolean;
  sosCountdownSeconds: number;
  isEmergencyActive: boolean;
  activeEvent: EmergencyEvent | null;
  sosBackendResponse: SosResponseData | null;
  triggerSosCountdown: () => void;
  cancelSosCountdown: () => void;
  confirmSosEmergency: (eventType?: EmergencyEvent['eventType']) => Promise<void>;
  resolveEmergency: (pin: string, reason?: string) => boolean;

  // Location Telemetry & Real Device GPS
  telemetry: LocationTelemetry;
  toggleLocationSharing: () => void;
  isRealGpsActive: boolean;
  toggleRealGps: () => void;
  geofences: GeofenceZone[];
  addGeofence: (zone: Omit<GeofenceZone, 'id'>) => void;
  deleteGeofence: (id: string) => void;

  // Trusted Contacts with +91 validation
  trustedContacts: TrustedContact[];
  addTrustedContact: (contact: Omit<TrustedContact, 'id'>) => { success: boolean; error?: string };
  updateTrustedContact: (id: string, contact: Partial<TrustedContact>) => { success: boolean; error?: string };
  deleteTrustedContact: (id: string) => void;
  setPrimaryContact: (id: string) => void;

  // Check-In Timer
  activeCheckIn: CheckInTimer | null;
  startCheckInTimer: (destination: string, durationMinutes: number) => void;
  cancelCheckInTimer: () => void;

  // Siren & Tools
  isSirenPlaying: boolean;
  toggleSiren: () => void;
  isFakeCallOpen: boolean;
  openFakeCallModal: () => void;
  closeFakeCallModal: () => void;

  // History & Notifications
  emergencyHistory: EmergencyEvent[];
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(initialTrustedContacts);
  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyEvent[]>(initialEmergencyEvents);
  const [geofences, setGeofences] = useState<GeofenceZone[]>(initialGeofences);

  const [safetyStatus, setSafetyStatus] = useState<SafetyStatusType>('safe');
  const [isRealGpsActive, setIsRealGpsActive] = useState<boolean>(true);

  const [telemetry, setTelemetry] = useState<LocationTelemetry>({
    lat: 28.6139,
    lng: 77.2090,
    address: 'Acquiring high-accuracy device GPS...',
    accuracyMeters: 5,
    speedKmh: 0,
    batteryLevel: 92,
    isSharingActive: false,
    lastUpdated: new Date().toISOString(),
  });

  // Real HTML5 Geolocation Listener
  useEffect(() => {
    if (!isRealGpsActive || !('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        const lat = +latitude.toFixed(6);
        const lng = +longitude.toFixed(6);

        setTelemetry((prev) => ({
          ...prev,
          lat,
          lng,
          accuracyMeters: Math.round(accuracy) || 5,
          speedKmh: speed ? Math.round(speed * 3.6) : prev.speedKmh,
          address: `Lat: ${lat}, Lng: ${lng} (Real Device GPS Lock)`,
          lastUpdated: new Date().toISOString(),
        }));

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.display_name) {
              setTelemetry((prev) => ({ ...prev, address: data.display_name }));
            }
          })
          .catch(() => {});
      },
      (err) => {
        console.warn('Geolocation notice:', err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isRealGpsActive]);

  // Battery Level API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setTelemetry((prev) => ({ ...prev, batteryLevel: Math.round(battery.level * 100) }));
        battery.addEventListener('levelchange', () => {
          setTelemetry((prev) => ({ ...prev, batteryLevel: Math.round(battery.level * 100) }));
        });
      }).catch(() => {});
    }
  }, []);

  // SOS States
  const [isSosCountdownActive, setIsSosCountdownActive] = useState<boolean>(false);
  const [sosCountdownSeconds, setSosCountdownSeconds] = useState<number>(5);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [activeEvent, setActiveEvent] = useState<EmergencyEvent | null>(null);
  const [sosBackendResponse, setSosBackendResponse] = useState<SosResponseData | null>(null);
  const [lastSosTriggerTime, setLastSosTriggerTime] = useState<number>(0);

  // Audio Siren & Tools
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState<boolean>(false);

  // Check-In Timer
  const [activeCheckIn, setActiveCheckIn] = useState<CheckInTimer | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Server-Side Twilio Emergency System Active',
      message: 'SOS dispatches automatic SMS and Voice Calls directly from the server API.',
      type: 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }
  ]);

  // Handle SOS Countdown Timer
  useEffect(() => {
    let timer: number;
    if (isSosCountdownActive && sosCountdownSeconds > 0) {
      timer = window.setInterval(() => {
        setSosCountdownSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isSosCountdownActive && sosCountdownSeconds === 0) {
      setIsSosCountdownActive(false);
      confirmSosEmergency('SOS Button Triggered');
    }
    return () => clearInterval(timer);
  }, [isSosCountdownActive, sosCountdownSeconds]);

  const addNotification = (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const triggerSosCountdown = () => {
    const now = Date.now();
    if (now - lastSosTriggerTime < 3000) {
      console.warn('SOS Trigger debounced.');
      return;
    }
    setLastSosTriggerTime(now);

    audioService.playClickSound();
    setSosCountdownSeconds(5);
    setIsSosCountdownActive(true);
  };

  const cancelSosCountdown = () => {
    audioService.playClickSound();
    setIsSosCountdownActive(false);
    setSosCountdownSeconds(5);
    addNotification({
      title: 'SOS Cancelled',
      message: 'Emergency SOS countdown was cancelled.',
      type: 'info',
    });
  };

  const confirmSosEmergency = async (eventType: EmergencyEvent['eventType'] = 'SOS Button Triggered') => {
    audioService.playClickSound();

    // Start Alarm Siren Sound immediately
    audioService.startSiren();
    setIsSirenPlaying(true);

    // 1. Dispatch Server Telephony API POST /api/emergency/sos (MSG91 SMS, Twilio Voice, and Backend Web3Forms)
    const backendRes = await sendBackendSosTrigger({
      latitude: telemetry.lat,
      longitude: telemetry.lng,
      userName: user.name,
      userId: user.id,
      location: {
        lat: telemetry.lat,
        lng: telemetry.lng,
        address: telemetry.address,
      },
      contacts: trustedContacts,
    });

    // 2. If backend email was already sent via Web3Forms, use it;
    // otherwise attempt client-side Web3Forms dispatch as fallback
    let clientEmailRes: Web3FormsClientResult | null = null;
    if (backendRes.email?.status !== 'sent') {
      try {
        clientEmailRes = await sendClientEmergencyEmail({
          userName: user.name,
          latitude: telemetry.lat,
          longitude: telemetry.lng,
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        console.warn('Client-side Web3Forms fallback error:', err);
      }
    }

    const isEmailSent = backendRes.email?.status === 'sent' || clientEmailRes?.success === true;
    const emailError = !isEmailSent
      ? (backendRes.email?.error || clientEmailRes?.error || clientEmailRes?.message)
      : undefined;

    const mergedResponse: SosResponseData = {
      ...backendRes,
      isEmailConfigured: true,
      email: {
        status: isEmailSent ? 'sent' : 'failed',
        provider: 'Web3Forms',
        sentCount: isEmailSent ? 1 : 0,
        totalCount: 1,
        error: emailError,
      },
    };

    setSosBackendResponse(mergedResponse);

    const newEvent: EmergencyEvent = {
      id: backendRes.eventId || `evt-${Date.now()}`,
      userId: user.id,
      eventType: eventType,
      status: 'active',
      triggeredAt: backendRes.timestamp || new Date().toISOString(),
      location: {
        lat: telemetry.lat,
        lng: telemetry.lng,
        address: telemetry.address,
        accuracyMeters: telemetry.accuracyMeters,
      },
      notifiedContactsCount: (backendRes.sms?.sentCount || 0) + (isEmailSent ? 1 : 0),
    };

    setActiveEvent(newEvent);
    setIsEmergencyActive(true);
    setSafetyStatus('sos_active');
    setEmergencyHistory((prev) => [newEvent, ...prev]);
    setTelemetry((prev) => ({ ...prev, isSharingActive: true }));

    // Real Status Notifications
    addNotification({
      title: backendRes.sms?.status === 'sent' ? '✅ Emergency SMS Sent' : '❌ Emergency SMS Failed',
      message: backendRes.sms?.status === 'sent'
        ? `Emergency SMS sent via MSG91 to ${backendRes.sms?.sentCount || 0} contacts.`
        : (backendRes.sms?.error || 'SMS could not be sent. Check emergency contact phone numbers.'),
      type: backendRes.sms?.status === 'sent' ? 'alert' : 'warning',
    });

    if (isEmailSent) {
      addNotification({
        title: '✅ Web3Forms Emergency Email Sent',
        message: 'Emergency alert email was delivered to your configured Web3Forms inbox.',
        type: 'alert',
      });
    } else {
      addNotification({
        title: '⚠️ Email Alert Note',
        message: emailError || 'Web3Forms email could not be sent.',
        type: 'warning',
      });
    }
  };

  const resolveEmergency = (pin: string, reason?: string): boolean => {
    if (pin !== user.emergencyPin) {
      return false; // Invalid PIN
    }

    audioService.stopSiren();
    setIsSirenPlaying(false);

    if (activeEvent) {
      const updatedEvent: EmergencyEvent = {
        ...activeEvent,
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        cancellationReason: reason || 'Resolved safely by user with PIN verification.',
      };

      setEmergencyHistory((prev) =>
        prev.map((e) => (e.id === activeEvent.id ? updatedEvent : e))
      );
    }

    setIsEmergencyActive(false);
    setActiveEvent(null);
    setSosBackendResponse(null);
    setSafetyStatus(telemetry.isSharingActive ? 'sharing_location' : 'safe');

    addNotification({
      title: 'Emergency Resolved',
      message: 'Emergency status deactivated safely via PIN.',
      type: 'success',
    });

    return true;
  };

  // Location Sharing Toggle
  const toggleLocationSharing = () => {
    audioService.playClickSound();
    setTelemetry((prev) => {
      const nextState = !prev.isSharingActive;
      if (isEmergencyActive) return prev;

      setSafetyStatus(nextState ? 'sharing_location' : 'safe');

      addNotification({
        title: nextState ? 'Live Location Sharing On' : 'Location Sharing Off',
        message: nextState
          ? 'Google Maps live coordinates sharing is active.'
          : 'Live location broadcast stopped.',
        type: nextState ? 'info' : 'warning',
      });

      return { ...prev, isSharingActive: nextState };
    });
  };

  const toggleRealGps = () => {
    setIsRealGpsActive((prev) => !prev);
  };

  // Trusted Contacts Management with Indian +91 Validation
  const addTrustedContact = (contact: Omit<TrustedContact, 'id'>) => {
    const val = validateIndianPhoneNumber(contact.phone);
    if (!val.isValid) {
      return { success: false, error: val.error || 'Invalid Indian phone number format.' };
    }

    const newContact: TrustedContact = {
      ...contact,
      phone: val.normalized,
      id: `cnt-${Date.now()}`,
      lastPingStatus: 'delivered',
    };

    setTrustedContacts((prev) => [...prev, newContact]);
    addNotification({
      title: 'Contact Added',
      message: `${contact.name} (${val.normalized}) added to emergency contacts.`,
      type: 'success',
    });

    return { success: true };
  };

  const updateTrustedContact = (id: string, contactData: Partial<TrustedContact>) => {
    if (contactData.phone) {
      const val = validateIndianPhoneNumber(contactData.phone);
      if (!val.isValid) {
        return { success: false, error: val.error || 'Invalid Indian phone number format.' };
      }
      contactData.phone = val.normalized;
    }

    setTrustedContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...contactData } : c))
    );

    return { success: true };
  };

  const deleteTrustedContact = (id: string) => {
    const contact = trustedContacts.find((c) => c.id === id);
    setTrustedContacts((prev) => prev.filter((c) => c.id !== id));
    addNotification({
      title: 'Contact Removed',
      message: `${contact?.name || 'Contact'} removed from trusted list.`,
      type: 'info',
    });
  };

  const setPrimaryContact = (id: string) => {
    setTrustedContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
    const contact = trustedContacts.find((c) => c.id === id);
    addNotification({
      title: 'Primary Contact Updated',
      message: `${contact?.name} designated as primary emergency contact.`,
      type: 'success',
    });
  };

  // Check-In Timer
  const startCheckInTimer = (destination: string, durationMinutes: number) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60000).toISOString();
    const newTimer: CheckInTimer = {
      id: `chk-${Date.now()}`,
      destinationName: destination,
      durationMinutes: durationMinutes,
      remainingSeconds: durationMinutes * 60,
      startedAt: now.toISOString(),
      expiresAt: expiresAt,
      isActive: true,
    };
    setActiveCheckIn(newTimer);
    setSafetyStatus('monitoring');
  };

  const cancelCheckInTimer = () => {
    setActiveCheckIn(null);
    setSafetyStatus(telemetry.isSharingActive ? 'sharing_location' : 'safe');
  };

  // Geofence
  const addGeofence = (zone: Omit<GeofenceZone, 'id'>) => {
    setGeofences((prev) => [...prev, { ...zone, id: `geo-${Date.now()}` }]);
  };

  const deleteGeofence = (id: string) => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
  };

  // Siren & Tools
  const toggleSiren = () => {
    const playing = audioService.toggleSiren();
    setIsSirenPlaying(playing);
  };

  const openFakeCallModal = () => {
    audioService.startRingtone();
    setIsFakeCallOpen(true);
  };

  const closeFakeCallModal = () => {
    audioService.stopRingtone();
    setIsFakeCallOpen(false);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SafetyContext.Provider
      value={{
        user,
        setUser,
        safetyStatus,
        isSosCountdownActive,
        sosCountdownSeconds,
        isEmergencyActive,
        activeEvent,
        sosBackendResponse,
        triggerSosCountdown,
        cancelSosCountdown,
        confirmSosEmergency,
        resolveEmergency,
        telemetry,
        toggleLocationSharing,
        isRealGpsActive,
        toggleRealGps,
        geofences,
        addGeofence,
        deleteGeofence,
        trustedContacts,
        addTrustedContact,
        updateTrustedContact,
        deleteTrustedContact,
        setPrimaryContact,
        activeCheckIn,
        startCheckInTimer,
        cancelCheckInTimer,
        isSirenPlaying,
        toggleSiren,
        isFakeCallOpen,
        openFakeCallModal,
        closeFakeCallModal,
        emergencyHistory,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const ctx = useContext(SafetyContext);
  if (!ctx) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return ctx;
};
