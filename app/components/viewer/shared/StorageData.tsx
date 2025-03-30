import CopyButton from './CopyButton';

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
    <div className="standard-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      <hr className="my-2" />
      {data ? (
        <div className="space-y-3">
          {Object.entries(data).slice(0, limit).map(([key, value], i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="standard-text-secondary font-medium truncate">{key}</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="standard-text text-sm truncate flex-1">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
                <CopyButton 
                  value={typeof value === 'string' ? value : JSON.stringify(value)}
                  index={i}
                  copiedIndex={copiedIndex}
                  onCopy={onCopy}
                  className="ml-2"
                />
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
        <p className="standard-text-secondary text-sm">No data available.</p>
      )}
    </div>
  );
}
