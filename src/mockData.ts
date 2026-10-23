import { UserProfile, TrustedContact, EmergencyEvent, EmergencyResource, SafetyTip, GeofenceZone } from './types';

export const initialUserProfile: UserProfile = {
  id: 'usr-101',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  phone: '+91 98765 43210',
  emergencyPin: '1234',
  bloodGroup: 'O+',
  allergies: 'Penicillin',
  medicalNotes: 'Asthma inhaler in handbag',
  address: 'Connaught Place, New Delhi, India',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  isLoggedIn: true,
};

export const initialTrustedContacts: TrustedContact[] = [
  {
    id: 'cnt-1',
    name: 'Sunita Sharma (Mother)',
    phone: '+91 98111 22334',
    email: 'sunita.sharma@gmail.com',
    relationship: 'Mother',
    isPrimary: true,
    notifySms: true,
    notifyCall: true,
    notifyEmail: true,
    notifyApp: true,
    lastPingStatus: 'delivered',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'cnt-2',
    name: 'Rakesh Sharma (Father)',
    phone: '+91 98111 55667',
    email: 'rakesh.sharma@gmail.com',
    relationship: 'Father',
    isPrimary: false,
    notifySms: true,
    notifyCall: true,
    notifyEmail: true,
    notifyApp: true,
    lastPingStatus: 'delivered',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'cnt-3',
    name: 'Priya Verma',
    phone: '+91 99887 66554',
    email: 'priya.verma@example.com',
    relationship: 'Best Friend / Flatmate',
    isPrimary: false,
    notifySms: true,
    notifyCall: false,
    notifyEmail: true,
    notifyApp: true,
    lastPingStatus: 'delivered',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'cnt-4',
    name: 'Rohan Sharma',
    phone: '+91 97654 32109',
    email: 'rohan.sharma@example.com',
    relationship: 'Brother',
    isPrimary: false,
    notifySms: true,
    notifyCall: false,
    notifyEmail: true,
    notifyApp: true,
    lastPingStatus: 'delivered',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  }
];

export const initialEmergencyEvents: EmergencyEvent[] = [
  {
    id: 'evt-2026-003',
    userId: 'usr-101',
    eventType: 'SOS Button Triggered',
    status: 'resolved',
    triggeredAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    resolvedAt: new Date(Date.now() - 3600000 * 24 * 2 + 600000).toISOString(),
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Rajiv Chowk Metro Gate 3, Connaught Place, New Delhi',
      accuracyMeters: 8,
    },
    notifiedContactsCount: 4,
    cancellationReason: 'False alarm - accidentally tapped while phone was in pocket. Confirmed safe.',
  },
  {
    id: 'evt-2026-002',
    userId: 'usr-101',
    eventType: 'Check-in Timeout',
    status: 'resolved',
    triggeredAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), // 7 days ago
    resolvedAt: new Date(Date.now() - 3600000 * 24 * 7 + 300000).toISOString(),
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 62 Metro Station, Noida, UP',
      accuracyMeters: 12,
    },
    notifiedContactsCount: 2,
    cancellationReason: 'Checked in safely via PIN after cab arrived at destination.',
  },
  {
    id: 'evt-2026-001',
    userId: 'usr-101',
    eventType: 'Test Ping',
    status: 'resolved',
    triggeredAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 24 * 14 + 120000).toISOString(),
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Home - Block C, Vasant Kunj, New Delhi',
      accuracyMeters: 5,
    },
    notifiedContactsCount: 4,
    cancellationReason: 'System configuration test.',
  }
];

export const emergencyResources: EmergencyResource[] = [
  {
    id: 'res-1',
    category: 'police',
    title: 'National Emergency / Police Direct Dial',
    subtitle: 'Immediate Police Dispatch & Control Room',
    phone: '112',
    description: 'Unified national emergency helpline number in India for Police, Fire, and Ambulance dispatch.',
    isVerified: true,
    isNational: true,
    operatingHours: '24/7 Toll-Free',
  },
  {
    id: 'res-2',
    category: 'helpline',
    title: 'National Women Helpline',
    subtitle: 'Ministry of Women and Child Development',
    phone: '1091',
    description: 'Dedicated 24/7 helpline for women facing harassment, danger, violence, or requiring emergency counseling.',
    isVerified: true,
    isNational: true,
    operatingHours: '24/7 Toll-Free',
  },
  {
    id: 'res-3',
    category: 'helpline',
    title: 'NCW Domestic Violence Helpline',
    subtitle: 'National Commission for Women',
    phone: '7827170170',
    description: 'WhatsApp & Telephonic distress line for women facing domestic abuse or confinement.',
    isVerified: true,
    isNational: true,
    operatingHours: '24/7 Active',
  },
  {
    id: 'res-4',
    category: 'cyber',
    title: 'National Cyber Crime Helpline',
    subtitle: 'Online Harassment & Cyber Stalking',
    phone: '1930',
    description: 'Report online stalking, deepfakes, unauthorized photo leakage, blackmail, or digital financial fraud.',
    isVerified: true,
    isNational: true,
    operatingHours: '24/7 Service',
  },
  {
    id: 'res-5',
    category: 'ambulance',
    title: 'National Medical Ambulance Service',
    subtitle: 'Emergency Medical First Response',
    phone: '102',
    description: 'Free medical transport and emergency trauma assistance dispatch.',
    isVerified: true,
    isNational: true,
    operatingHours: '24/7 Ambulance Care',
  }
];

export const initialGeofences: GeofenceZone[] = [
  {
    id: 'geo-1',
    name: 'Home Zone',
    lat: 28.6139,
    lng: 77.2090,
    radiusMeters: 200,
    alertOnExit: false,
    category: 'home',
  },
  {
    id: 'geo-2',
    name: 'University Campus',
    lat: 28.5450,
    lng: 77.1926,
    radiusMeters: 500,
    alertOnExit: true,
    category: 'college',
  }
];

export const safetyTipsList: SafetyTip[] = [
  {
    id: 'tip-1',
    category: 'cab_safety',
    title: 'Cab & Ride-Share Safety Rules',
    summary: 'Essential steps to take before and during rides in cabs or auto-rickshaws at night.',
    details: [
      'Always match the driver details and car license plate number with the ride app before getting inside.',
      'Enable SafeHer Live Location Sharing before starting your journey.',
      'Sit in the back seat behind the driver to maintain space and easy access to doors.',
      'Check if the child-lock is disabled before closing the car door.',
      'Fake a phone call or use SafeHer Fake Call simulator to inform someone you are being tracked.'
    ],
    iconName: 'Car',
  },
  {
    id: 'tip-2',
    category: 'surroundings',
    title: 'Situational Awareness & Stalking Red Flags',
    summary: 'How to detect if you are being followed and what immediate actions to take.',
    details: [
      'Avoid wearing noise-canceling headphones in dimly lit streets or quiet alleys.',
      'If you suspect someone is following you, change your walk pace or cross the street to test intent.',
      'Head towards a brightly lit shop, fuel station, bank ATM booth, or public cafe immediately.',
      'Keep your phone unlocked with finger ready over the SafeHer SOS button.'
    ],
    iconName: 'Eye',
  },
  {
    id: 'tip-3',
    category: 'digital',
    title: 'Digital Privacy & Phone Safeguards',
    summary: 'Protecting your phone security during high-risk scenarios.',
    details: [
      'Configure SafeHer Lockscreen widget or Quick Emergency PIN.',
      'Keep your phone battery above 30% when traveling after 8 PM.',
      'Enable biometrics and keep emergency contact info accessible from lock screen.'
    ],
    iconName: 'Shield',
  },
  {
    id: 'tip-4',
    category: 'self_defense',
    title: 'Practical Self-Defense Principles',
    summary: 'Vulnerable strike points and physical escape techniques in emergency situations.',
    details: [
      'Target vulnerable points: Eyes, Nose, Throat, Groin, and Shin.',
      'Use heavy objects in your bag (keys, water bottle, metal umbrella) as force multipliers.',
      'Shout "FIRE" or "HELP" loudly using your full diaphragm to attract maximum public attention.',
      'Your goal is NOT to fight long-term; your goal is to stun the attacker and run to safety.'
    ],
    iconName: 'Zap',
  }
];
