export interface Device {
  id: string;
  macAddress: string;
  ipAddress: string;
  lastSeen: Date;
  location: [number, number];
  trustScore: number;
  vpnDetected: boolean;
  torDetected: boolean;
  signalStrength: number;
  type: 'normal' | 'suspicious' | 'malicious';
  // New fields for enhanced tracking
  deviceFingerprint: string;
  behavioralScore: number;
  networkPatterns: NetworkPattern[];
  encryptedTrafficScore: number;
  lastKnownLocations: [number, number][];
  deviceType: 'mobile' | 'desktop' | 'iot' | 'unknown';
  connectionHistory: ConnectionRecord[];
}

export interface NetworkPattern {
  timestamp: Date;
  packetSize: number;
  latency: number;
  encryptionType: string;
  anomalyScore: number;
}

export interface ConnectionRecord {
  timestamp: Date;
  serverLocation: [number, number];
  protocol: string;
  duration: number;
  dataVolume: number;
}

export interface Activity {
  id: string;
  type: 'alert' | 'user' | 'system' | 'anomaly' | 'blockchain';
  deviceId: string;
  message: string;
  time: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: {
    anomalyScore?: number;
    blockchainHash?: string;
    behavioralFlags?: string[];
    affectedSystems?: string[];
    recommendedActions?: string[];
  };
}

export interface ThreatData {
  timestamp: Date;
  level: number;
  type: string;
  deviceId: string;
  aiConfidence: number;
  blockchainVerified: boolean;
  forensicData: {
    packetSignatures: string[];
    behavioralPatterns: string[];
    geoAnalytics: {
      riskZones: [number, number][];
      movementPatterns: [number, number][];
    };
  };
}

export interface BlockchainRecord {
  hash: string;
  timestamp: Date;
  deviceId: string;
  trustScore: number;
  evidenceType: 'traffic' | 'behavior' | 'location' | 'anomaly';
  data: string;
}