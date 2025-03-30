import { parseUrl } from '@/app/utils/url';
import { Metadata } from '@/app/types/report';

interface HeaderSectionProps {
  url: string;
  metadata: Metadata;
}

export default function HeaderSection({ url, metadata }: HeaderSectionProps) {
  const { domain, path, params } = parseUrl(url);
  const hasContent = metadata?.title || metadata?.description || metadata?.keywords;

  return (
    <div className="standard-section">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="text-2xl standard-text flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div>
            <span className="font-bold">Domain: </span>
            <span className="standard-text-secondary">{domain}</span>
          </div>
          <div>
            <span className="font-bold">Path: </span>
            <span className="standard-text-secondary">{path}</span>
          </div>
        </div>
      </div>
      {params && (
        <div className="text-sm standard-text-secondary mt-2 ">Params: {params}</div>
      )}
      {hasContent && (
        <div className="mt-2">
          {metadata.title && (
            <div className="flex justify-normal">
              <span className="text-md font-bold standard-text-secondary ">Title:</span>
              <p className="text-md font-medium standard-text ml-4">{metadata.title}</p>
            </div>
          )}
          {metadata.description && (
            <div className="my-2">
              <span className="text-sm font-bold standard-text-secondary">Description</span>
              <p className="text-sm standard-text-secondary">{metadata.description}</p>
            </div>
          )}
          {metadata.keywords && (
            <div>
              <span className="text-sm font-bold standard-text-secondary">Keywords</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {metadata.keywords.split(',').map((keyword: string, i: number) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
