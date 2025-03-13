import { useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface LinksListProps {
  links: string[];
  limit: number;
  setLimit: (value: number) => void;
}

export default function LinksList({ links, limit, setLimit }: LinksListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="space-y-2">
      {links.slice(0, limit).map((link, i) => (
        <div 
          key={i}
          className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-sm">
            {link}
          </a>
          <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => handleCopy(link, i)}>
            {copiedIndex === i ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
          </button>
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
