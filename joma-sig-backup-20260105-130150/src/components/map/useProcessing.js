// src/hooks/useProcessing.js
import { useCallback } from 'react';
import { createHandleProcessingActions } from '../utils/processingActions';

const useProcessing = ({
  selectedLayers,
  setCurrentOperation,
  setProcessingHistory,
  setActiveWidget
}) => {
  const handleProcessing = useCallback(
    createHandleProcessingActions({
      selectedLayers,
      setCurrentOperation,
      setProcessingHistory,
      setActiveWidget
    }),
    [selectedLayers, setCurrentOperation, setProcessingHistory, setActiveWidget]
  );

  return { handleProcessing };
};

export default useProcessing;