import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Shield, AlertTriangle, Activity, Users, Globe, Lock, Zap } from 'lucide-react';
import { Map } from './components/Map';
import { DeviceList } from './components/DeviceList';
import { analyzeTrafficPatterns, calculateBehavioralScore } from './utils/anomalyDetection';
import { createBlockchainRecord } from './utils/blockchainLogger';
import type { Device, Activity as ActivityType, ThreatData, NetworkPattern, ConnectionRecord } from './types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Enhanced device data generation
function generateDevices(): Device[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `dev_${i}`,
    macAddress: `00:1B:44:11:3A:${i}`,
    ipAddress: `192.168.1.${100 + i}`,
    lastSeen: new Date(),
    location: [
      Math.random() * 180 - 90,
      Math.random() * 360 - 180,
    ],
    trustScore: Math.floor(Math.random() * 100),
    vpnDetected: Math.random() > 0.7,
    torDetected: Math.random() > 0.8,
    signalStrength: Math.floor(Math.random() * -100),
    type: Math.random() > 0.7 ? 'malicious' : 
          Math.random() > 0.5 ? 'suspicious' : 'normal',
    deviceFingerprint: `fp_${Math.random().toString(36).substr(2, 9)}`,
    behavioralScore: Math.floor(Math.random() * 100),
    networkPatterns: Array.from({ length: 10 }, () => ({
      timestamp: new Date(),
      packetSize: Math.random() * 2000,
      latency: Math.random() * 500,
      encryptionType: Math.random() > 0.8 ? 'custom' : 'standard',
      anomalyScore: Math.random()
    })),
    encryptedTrafficScore: Math.random(),
    lastKnownLocations: Array.from({ length: 3 }, () => [
      Math.random() * 180 - 90,
      Math.random() * 360 - 180,
    ]),
    deviceType: ['mobile', 'desktop', 'iot', 'unknown'][Math.floor(Math.random() * 4)] as Device['deviceType'],
    connectionHistory: Array.from({ length: 5 }, () => ({
      timestamp: new Date(),
      serverLocation: [
        Math.random() * 180 - 90,
        Math.random() * 360 - 180,
      ],
      protocol: Math.random() > 0.8 ? 'unknown' : 'standard',
      duration: Math.random() * 3600,
      dataVolume: Math.random() * 1000
    }))
  }));
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [threats, setThreats] = useState<ThreatData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDevices = generateDevices();
      
      newDevices.forEach(device => {
        const anomalyScore = analyzeTrafficPatterns(device.networkPatterns);
        
        if (anomalyScore > 0.7) {
          const record = createBlockchainRecord(
            device,
            'anomaly',
            `High anomaly score detected: ${anomalyScore}`
          );
          
          const blockchainActivity: ActivityType = {
            id: Math.random().toString(),
            type: 'blockchain',
            deviceId: device.id,
            message: `Blockchain record created for suspicious activity`,
            time: new Date(),
            severity: 'high',
            details: {
              blockchainHash: record.hash,
              anomalyScore,
              behavioralFlags: [
                'High traffic anomaly',
                'Suspicious encryption patterns'
              ],
              recommendedActions: [
                'Monitor device closely',
                'Review network logs',
                'Consider blocking access'
              ]
            }
          };
          
          setActivities(prev => [blockchainActivity, ...prev].slice(0, 10));
        }
      });
      
      setDevices(newDevices);
      
      const newActivity: ActivityType = {
        id: Math.random().toString(),
        type: Math.random() > 0.5 ? 'alert' : 'user',
        deviceId: `dev_${Math.floor(Math.random() * 5)}`,
        message: Math.random() > 0.5 
          ? 'High-risk VPN activity detected'
          : 'New device fingerprint identified',
        time: new Date(),
        severity: Math.random() > 0.7 ? 'high' : 
                 Math.random() > 0.4 ? 'medium' : 'low',
        details: {
          recommendedActions: [
            'Monitor device activity',
            'Review security logs'
          ]
        }
      };
      
      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    activeThreats: devices.filter(d => d.type === 'malicious').length,
    detectedDevices: devices.length,
    vpnConnections: devices.filter(d => d.vpnDetected).length,
    averageTrustScore: Math.floor(
      devices.reduce((acc, d) => acc + d.trustScore, 0) / devices.length
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-black/40 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    VDS3 Dashboard
                  </h1>
                  <p className="text-sm text-gray-400">by Team Mahakumbh</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">System Active</span>
              </div>
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <span className="text-sm font-medium text-blue-400">Real-Time Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Threats"
            value={stats.activeThreats}
            icon={<AlertTriangle className="h-6 w-6 text-red-400" />}
            color="red"
          />
          <StatCard
            title="Detected Devices"
            value={stats.detectedDevices}
            icon={<Activity className="h-6 w-6 text-blue-400" />}
            color="blue"
          />
          <StatCard
            title="VPN Connections"
            value={stats.vpnConnections}
            icon={<Globe className="h-6 w-6 text-purple-400" />}
            color="purple"
          />
          <StatCard
            title="Avg Trust Score"
            value={stats.averageTrustScore}
            icon={<Lock className="h-6 w-6 text-emerald-400" />}
            color="emerald"
            suffix="%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-400" />
              Device Locations
            </h2>
            <Map devices={devices} />
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              Active Devices
            </h2>
            <DeviceList devices={devices} />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-400" />
            Real-Time Activities
          </h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color, suffix = '' }) {
  const getGradient = () => {
    switch (color) {
      case 'red': return 'from-red-500/10 to-red-900/5';
      case 'blue': return 'from-blue-500/10 to-blue-900/5';
      case 'purple': return 'from-purple-500/10 to-purple-900/5';
      case 'emerald': return 'from-emerald-500/10 to-emerald-900/5';
      default: return 'from-gray-500/10 to-gray-900/5';
    }
  };

  const getBorder = () => {
    switch (color) {
      case 'red': return 'border-red-400/20';
      case 'blue': return 'border-blue-400/20';
      case 'purple': return 'border-purple-400/20';
      case 'emerald': return 'border-emerald-400/20';
      default: return 'border-gray-400/20';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getGradient()} backdrop-blur-sm rounded-xl border ${getBorder()} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1 text-gray-200">
            {value}
            {suffix}
          </p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function ActivityItem({ type, message, time, severity, details }: ActivityType) {
  const getIcon = () => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'user':
        return <Users className="h-5 w-5 text-blue-400" />;
      case 'blockchain':
        return <Lock className="h-5 w-5 text-purple-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-400/20';
      case 'high':
        return 'bg-red-500/5 border-red-400/10';
      case 'medium':
        return 'bg-yellow-500/5 border-yellow-400/10';
      default:
        return 'bg-gray-500/5 border-gray-400/10';
    }
  };

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border backdrop-blur-sm ${getSeverityColor()}`}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm text-gray-200">{message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {time.toLocaleTimeString()}
        </p>
        {details && (
          <div className="mt-2 space-y-1">
            {details.blockchainHash && (
              <p className="text-xs font-mono text-purple-400">
                Hash: {details.blockchainHash}
              </p>
            )}
            {details.anomalyScore && (
              <p className="text-xs text-orange-400">
                Anomaly Score: {Math.round(details.anomalyScore * 100)}%
              </p>
            )}
            {details.behavioralFlags && details.behavioralFlags.length > 0 && (
              <div className="text-xs text-red-400">
                {details.behavioralFlags.map((flag, i) => (
                  <div key={i}>• {flag}</div>
                ))}
              </div>
            )}
            {details.recommendedActions && details.recommendedActions.length > 0 && (
              <div className="text-xs text-blue-400 mt-2">
                <strong>Recommended Actions:</strong>
                {details.recommendedActions.map((action, i) => (
                  <div key={i}>• {action}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;