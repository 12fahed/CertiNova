// hooks/useAutoSave.ts
import { useEffect, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import localforage from 'localforage';

export type SaveStatus = 'saved' | 'saving' | 'pending' | 'error';

interface UseAutoSaveProps {
  templateData: any; // Replace 'any' with your Template/Canvas Interface
  isDirty: boolean;  // Flag to check if there are actual unsaved changes
}

export const useAutoSave = ({ templateData, isDirty }: UseAutoSaveProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounced save function triggers 2 seconds after the user stops making changes
  const saveDraft = useCallback(
    debounce(async (data) => {
      setSaveStatus('saving');
      try {
        // 1. Client-Side Save (High capacity, non-blocking)
        await localforage.setItem('certinova_template_draft', {
          data,
          timestamp: new Date().toISOString(),
        });
        
        // 2. Server-Side Save (Uncomment when backend endpoint is ready)
        /* 
        await fetch('/api/templates/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateData: data }),
        });
        */

        setSaveStatus('saved');
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to auto-save draft:', error);
        setSaveStatus('error');
      }
    }, 2000),
    [] // Empty dependency array ensures the debounced function is stable
  );

  useEffect(() => {
    if (isDirty) {
      setSaveStatus('pending');
      saveDraft(templateData);
    }

    // Prevent data loss if the user tries to close the tab before the debounce finishes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus !== 'saved') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      saveDraft.cancel(); // Cleanup pending debounces on unmount
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [templateData, isDirty, saveDraft, saveStatus]);

  // Function to manually restore a draft on load
  const restoreDraft = async () => {
    const draft = await localforage.getItem('certinova_template_draft');
    return draft;
  };

  const clearDraft = async () => {
    await localforage.removeItem('certinova_template_draft');
  };

  return { saveStatus, lastSaved, restoreDraft, clearDraft };
};
