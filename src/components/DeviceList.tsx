import React from 'react';
import { Wifi, Shield, AlertTriangle, Activity, Lock, Globe } from 'lucide-react';
import type { Device } from '../types';
import { detectAnomalies } from '../utils/anomalyDetection';

interface DeviceListProps {
  devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
  return (
    <div className="space-y-4">
      {devices.map((device) => {
        const anomalies = detectAnomalies(device);
        
        return (
          <div
            key={device.id}
            className={`p-4 rounded-lg border ${
              device.type === 'malicious'
                ? 'border-red-200 bg-red-50'
                : device.type === 'suspicious'
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {device.type === 'malicious' ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : device.type === 'suspicious' ? (
                  <Shield className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Wifi className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">Device {device.id}</p>
                  <p className="text-sm text-gray-600">
                    {device.macAddress} • {device.ipAddress}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fingerprint: {device.deviceFingerprint}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold">
                    Trust Score: {device.trustScore}%
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Behavioral Score: {device.behavioralScore}%
                </p>
                <p className="text-sm text-gray-600">
                  Signal: {device.signalStrength}dBm
                </p>
              </div>
            </div>
            
            {/* Network Status */}
            <div className="mt-2 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4 text-gray-400" />
                <span>{device.deviceType}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4 text-gray-400" />
                <span>
                  Traffic Score: {Math.round(device.encryptedTrafficScore * 100)}%
                </span>
              </div>
            </div>

            {/* Anomalies and Detections */}
            {(device.vpnDetected || device.torDetected || anomalies.length > 0) && (
              <div className="mt-2 space-y-1">
                {(device.vpnDetected || device.torDetected) && (
                  <div className="text-sm">
                    <span className="font-medium text-red-600">Detected: </span>
                    {device.vpnDetected && 'VPN '}
                    {device.vpnDetected && device.torDetected && '& '}
                    {device.torDetected && 'TOR'}
                  </div>
                )}
                {anomalies.map((anomaly, index) => (
                  <div key={index} className="text-sm text-orange-600">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {anomaly}
                  </div>
                ))}
              </div>
            )}
            
            {/* Connection History */}
            <div className="mt-2 text-xs text-gray-500">
              Last seen: {device.lastSeen.toLocaleString()}
              <br />
              Recent connections: {device.connectionHistory.length}
            </div>
          </div>
        );
      })}
    </div>
  );
}