// components/EditorHeader.tsx
import React from 'react';
import { SaveStatus } from '../hooks/useAutoSave';

interface EditorHeaderProps {
  status: SaveStatus;
  lastSaved: Date | null;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ status, lastSaved }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <h2 className="font-bold">CertiNova Studio</h2>
      
      <div className="flex items-center space-x-2 text-sm">
        {status === 'pending' && <span className="text-yellow-400">Changes pending...</span>}
        {status === 'saving' && <span className="text-blue-400 animate-pulse">Saving...</span>}
        {status === 'error' && <span className="text-red-500">Auto-save failed</span>}
        {status === 'saved' && (
          <span className="text-green-400">
            ✓ Draft saved {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}
          </span>
        )}
      </div>
    </div>
  );
};
