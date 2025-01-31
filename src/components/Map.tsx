import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Device } from '../types';

interface MapProps {
  devices: Device[];
}

export function Map({ devices }: MapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-[400px] w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {devices.map((device) => (
        <Circle
          key={device.id}
          center={device.location}
          radius={50000}
          pathOptions={{
            color: device.type === 'malicious' ? 'red' : 
                   device.type === 'suspicious' ? 'orange' : 'green',
            fillColor: device.type === 'malicious' ? 'red' : 
                      device.type === 'suspicious' ? 'orange' : 'green',
            fillOpacity: 0.5,
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">Device {device.id}</h3>
              <p>Trust Score: {device.trustScore}%</p>
              <p>VPN: {device.vpnDetected ? 'Detected' : 'Not Detected'}</p>
              <p>TOR: {device.torDetected ? 'Detected' : 'Not Detected'}</p>
              <p>Signal: {device.signalStrength}dBm</p>
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}