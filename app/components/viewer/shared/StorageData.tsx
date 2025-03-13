import { IconCheck, IconCopy } from '@tabler/icons-react';

interface StorageDataProps {
  data: Record<string, string> | null;
  title: string;
  limit: number;
  setLimit: (value: number) => void;
  onCopy: (value: string, index: number) => void;
  copiedIndex: number | null;
}

export default function StorageData({ data, title, limit, setLimit, onCopy, copiedIndex }: StorageDataProps) {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      <hr className="my-2" />
      {data ? (
        <div className="space-y-3">
          {Object.entries(data).slice(0, limit).map(([key, value], i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="text-sm font-medium text-gray-500 truncate">{key}</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-sm text-gray-900 truncate flex-1">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
                <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => onCopy(typeof value === 'string' ? value : JSON.stringify(value), i)}>
                  {copiedIndex === i ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-2">
            {Object.keys(data).length > limit && (
              <button className="text-blue-600 hover:underline text-xs flex items-center cursor-pointer" onClick={() => setLimit(limit + 3)}>
                <span>Show More</span>
              </button>
            )}
            {limit > 3 && (
              <button className="text-blue-600 hover:underline text-xs flex items-center cursor-pointer" onClick={() => setLimit(3)}>
                <span>Show Less</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500">No data available.</p>
      )}
    </div>
  );
}
