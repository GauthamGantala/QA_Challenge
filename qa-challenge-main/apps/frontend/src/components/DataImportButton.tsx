import React, { useState } from 'react';

import { importData } from '../services/api';
import { useRoomingListStore } from '../store/roomingListStore';
import { Button } from './Button';

export const DataImportButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { fetchRoomingLists } = useRoomingListStore();

  const handleImport = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await importData();
      setMessage(result.message || 'Data imported successfully');
      await fetchRoomingLists();
    } catch (error) {
      setMessage('Failed to import data. Please try again.');
      console.error('Import error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="sm"
      isLoading={isLoading}
      onClick={handleImport}
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      }
    >
      Import Data
    </Button>
  );
}; 