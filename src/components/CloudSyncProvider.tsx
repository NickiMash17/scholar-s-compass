import React from 'react';
import { useCloudSync } from '@/hooks/useCloudSync';

export const CloudSyncProvider: React.FC = () => {
  useCloudSync();
  return null;
};
