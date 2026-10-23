// API Client Service for SafeHer Emergency Backend & MSG91 SMS Integration

export interface SosRequestPayload {
  latitude: number;
  longitude: number;
  userName: string;
  userId?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  contacts?: any[];
}

export interface SosResultItem {
  contact: string;
  phone: string;
  email?: string;
  maskedPhone?: string;
  status: 'sent' | 'failed' | 'not_configured';
  emailStatus?: 'sent' | 'failed' | 'not_configured' | 'no_email';
  error?: string;
  sid?: string;
}

export interface SosResponseData {
  success: boolean;
  message: string;
  isMsg91Configured?: boolean;
  isTwilioVoiceConfigured?: boolean;
  isEmailConfigured?: boolean;
  eventId?: string;
  timestamp?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    googleMapsUrl: string;
  } | null;
  sms?: {
    status: 'sent' | 'failed' | 'not_configured';
    provider?: string;
    sentCount?: number;
    totalCount?: number;
    error?: string;
  };
  call?: {
    status: 'initiated' | 'failed' | 'not_configured';
    provider?: string;
    sid?: string;
    error?: string;
    primaryContact?: string;
  };
  email?: {
    status: 'sent' | 'failed' | 'not_configured';
    provider?: string;
    sentCount?: number;
    totalCount?: number;
    error?: string;
  };
  primaryContact?: {
    name: string;
    phone: string;
  };
  results?: SosResultItem[];
  error?: string;
}

// Indian & International Mobile Number Validation
export function validateIndianPhoneNumber(phoneStr: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phoneStr || !phoneStr.trim()) {
    return { isValid: false, normalized: '', error: 'Phone number is required.' };
  }

  const cleaned = phoneStr.replace(/[^\d+]/g, '');

  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: `+91${cleaned}` };
  }

  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: `+91${cleaned.substring(1)}` };
  }

  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: `+${cleaned}` };
  }

  if (/^\+\d{10,15}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  return {
    isValid: false,
    normalized: cleaned,
    error: 'Please enter a valid 10-digit Indian mobile number (+91).',
  };
}

export async function sendBackendSosTrigger(payload: SosRequestPayload): Promise<SosResponseData> {
  try {
    const response = await fetch('/api/emergency/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: payload.latitude,
        longitude: payload.longitude,
        userName: payload.userName,
        userId: payload.userId || 'usr-101',
        location: payload.location || { lat: payload.latitude, lng: payload.longitude },
        contacts: payload.contacts || [],
      }),
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('[FRONTEND API] Backend API Connection Error:', err.message);

    return {
      success: false,
      message: 'SMS could not be sent. Please check your emergency contact and SMS configuration.',
      error: 'Backend API connection error: ' + err.message,
      isMsg91Configured: false,
      isTwilioVoiceConfigured: false,
      sms: {
        status: 'failed',
        provider: 'MSG91',
        error: 'SMS could not be sent. Please check your emergency contact and SMS configuration.',
      },
      call: {
        status: 'failed',
        provider: 'Twilio Voice',
        error: 'Backend connection failed.',
      },
      results: (payload.contacts || []).map((c) => ({
        contact: c.name,
        phone: c.phone,
        status: 'failed',
        error: 'SMS could not be sent. Please check your emergency contact and SMS configuration.',
      })),
    };
  }
}
