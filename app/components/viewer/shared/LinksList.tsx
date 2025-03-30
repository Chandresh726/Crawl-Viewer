import { useState } from 'react';
import CopyButton from './CopyButton';

interface LinksListProps {
  links: string[];
  limit: number;
  setLimit: (value: number) => void;
}

export default function LinksList({ links, limit, setLimit }: LinksListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="space-y-2">
      {links.slice(0, limit).map((link, i) => (
        <div key={i} className="flex items-center justify-between standard-text-secondary hover:text-blue-600 transition-colors">
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-sm">
            {link}
          </a>
          <CopyButton 
            value={link}
            index={i}
            copiedIndex={copiedIndex}
            onCopy={handleCopy}
            className="ml-2"
          />
        </div>
      ))}
      <div className="flex justify-between">
        {links.length > limit && (
          <button className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer" onClick={() => setLimit(limit + 10)}>
            <span>Show More</span>
          </button>
        )}
        {limit > 5 && (
          <button className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer" onClick={() => setLimit(5)}>
            <span>Show Less</span>
          </button>
        )}
      </div>
    </div>
  );
}
