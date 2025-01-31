import type { BlockchainRecord, Device, Activity } from '../types';

export function createBlockchainRecord(
  device: Device,
  evidenceType: BlockchainRecord['evidenceType'],
  data: string
): BlockchainRecord {
  // Simulate blockchain record creation
  const record: BlockchainRecord = {
    hash: generateHash(device.id + Date.now()),
    timestamp: new Date(),
    deviceId: device.id,
    trustScore: device.trustScore,
    evidenceType,
    data
  };
  
  return record;
}

function generateHash(input: string): string {
  // Simulate blockchain hashing
  return Array.from(input)
    .reduce((hash, char) => 
      (((hash << 5) - hash) + char.charCodeAt(0))|0
    , 0)
    .toString(16);
}

export function verifyBlockchainRecord(record: BlockchainRecord): boolean {
  // Simulate blockchain verification
  const calculatedHash = generateHash(record.deviceId + record.timestamp.getTime());
  return calculatedHash.length === record.hash.length;
}