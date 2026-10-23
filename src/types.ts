export type SafetyStatusType = 'safe' | 'monitoring' | 'sos_active' | 'sharing_location';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyPin: string; // Default '1234'
  bloodGroup?: string;
  allergies?: string;
  medicalNotes?: string;
  address?: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  notifySms: boolean;
  notifyCall: boolean;
  notifyEmail: boolean;
  notifyApp: boolean;
  lastPingStatus?: 'delivered' | 'pending' | 'failed';
  avatar?: string;
}

export interface EmergencyEvent {
  id: string;
  userId: string;
  eventType: 'SOS Button Triggered' | 'Check-in Timeout' | 'Geofence Exit' | 'Manual Alert' | 'Test Ping';
  status: 'active' | 'resolved' | 'cancelled' | 'false_alarm';
  triggeredAt: string; // ISO string
  resolvedAt?: string; // ISO string
  location: {
    lat: number;
    lng: number;
    address: string;
    accuracyMeters: number;
  };
  audioRecordingUrl?: string;
  notifiedContactsCount: number;
  cancellationReason?: string;
}

export interface LocationTelemetry {
  lat: number;
  lng: number;
  address: string;
  accuracyMeters: number;
  speedKmh: number;
  batteryLevel: number;
  isSharingActive: boolean;
  lastUpdated: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  alertOnExit: boolean;
  category: 'home' | 'work' | 'college' | 'other';
}

export interface CheckInTimer {
  id: string;
  destinationName: string;
  durationMinutes: number;
  remainingSeconds: number;
  startedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface EmergencyResource {
  id: string;
  category: 'police' | 'helpline' | 'ambulance' | 'cyber' | 'domestic';
  title: string;
  subtitle: string;
  phone: string;
  description: string;
  isVerified: boolean;
  isNational: boolean;
  operatingHours: string;
}

export interface SafetyTip {
  id: string;
  category: 'travel' | 'surroundings' | 'digital' | 'self_defense' | 'cab_safety';
  title: string;
  summary: string;
  details: string[];
  iconName: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
}
