import type { NetworkPattern, Device } from '../types';

export function analyzeTrafficPatterns(patterns: NetworkPattern[]): number {
  // AI-based analysis of network patterns
  let anomalyScore = 0;
  
  patterns.forEach(pattern => {
    // Check for VPN/TOR signatures
    if (pattern.latency > 200) anomalyScore += 0.2;
    if (pattern.packetSize > 1500) anomalyScore += 0.3;
    
    // Analyze encryption patterns
    if (pattern.encryptionType.includes('custom')) anomalyScore += 0.4;
    
    // Consider existing anomaly scores
    anomalyScore += pattern.anomalyScore * 0.5;
  });

  return Math.min(anomalyScore, 1);
}

export function calculateBehavioralScore(device: Device): number {
  let score = 100;
  
  // Analyze connection patterns
  const suspiciousConnections = device.connectionHistory.filter(conn => 
    conn.protocol === 'unknown' || conn.duration < 10
  ).length;
  
  score -= suspiciousConnections * 5;
  
  // Check location changes
  const locationChanges = device.lastKnownLocations.length;
  if (locationChanges > 5) score -= 10;
  
  // VPN/TOR penalties
  if (device.vpnDetected) score -= 20;
  if (device.torDetected) score -= 30;
  
  return Math.max(0, Math.min(score, 100));
}

export function detectAnomalies(device: Device): string[] {
  const flags: string[] = [];
  
  // Check for rapid location changes
  if (device.lastKnownLocations.length > 3) {
    flags.push('Suspicious location changes detected');
  }
  
  // Analyze network patterns
  const recentPatterns = device.networkPatterns.slice(-5);
  const avgAnomaly = recentPatterns.reduce((sum, p) => sum + p.anomalyScore, 0) / recentPatterns.length;
  
  if (avgAnomaly > 0.7) {
    flags.push('High anomaly score in recent traffic');
  }
  
  // Check behavioral patterns
  if (device.behavioralScore < 50) {
    flags.push('Suspicious behavioral patterns');
  }
  
  return flags;
}