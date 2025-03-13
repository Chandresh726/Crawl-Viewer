import { useState } from 'react';
import LinksList from './shared/LinksList';

interface LinksSectionProps {
  links: {
    internal: string[];
    external: string[];
  };
}

export default function LinksSection({ links }: LinksSectionProps) {
  const [internalLimit, setInternalLimit] = useState(5);
  const [externalLimit, setExternalLimit] = useState(5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Internal Links ({links.internal.length})
          </h3>
          <hr className="my-2" />
          {links.internal.length > 0 ? (
            <LinksList 
              links={links.internal} 
              limit={internalLimit} 
              setLimit={setInternalLimit} 
            />
          ) : (
            <p className="text-sm text-gray-500">No internal links available.</p>
          )}
        </div>
        <div className="bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">External Links ({links.external.length})</h3>
          <hr className="my-2" />
          {links.external.length > 0 ? (
            <LinksList 
              links={links.external} 
              limit={externalLimit} 
              setLimit={setExternalLimit} 
            />
          ) : (
            <p className="text-sm text-gray-500">No external links available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
