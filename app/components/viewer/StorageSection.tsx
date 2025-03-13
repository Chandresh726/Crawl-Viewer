import { useState } from 'react';
import StorageData from './shared/StorageData';

interface StorageSectionProps {
  storage: {
    localStorage: Record<string, string>;
    sessionStorage: Record<string, string>;
  };
}

export default function StorageSection({ storage }: StorageSectionProps) {
  const [localLimit, setLocalLimit] = useState(3);
  const [sessionLimit, setSessionLimit] = useState(3);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const hasLocalStorage = storage.localStorage && Object.keys(storage.localStorage).length > 0;
  const hasSessionStorage = storage.sessionStorage && Object.keys(storage.sessionStorage).length > 0;

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorageData 
          data={hasLocalStorage ? storage.localStorage : null} 
          title="Local Storage" 
          limit={localLimit} 
          setLimit={setLocalLimit} 
          onCopy={handleCopy} 
          copiedIndex={copiedIndex} 
        />
        <StorageData 
          data={hasSessionStorage ? storage.sessionStorage : null} 
          title="Session Storage" 
          limit={sessionLimit} 
          setLimit={setSessionLimit} 
          onCopy={handleCopy} 
          copiedIndex={copiedIndex} 
        />
      </div>
    </div>
  );
}
