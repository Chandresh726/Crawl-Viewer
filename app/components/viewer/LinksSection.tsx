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
    <div className="standard-grid md:grid-cols-2">
      <div className="standard-card">
        <h3 className="section-header">
          Internal Links ({links.internal.length})
        </h3>
        <hr className="mb-4" />
        {links.internal.length > 0 ? (
          <LinksList 
            links={links.internal} 
            limit={internalLimit} 
            setLimit={setInternalLimit} 
          />
        ) : (
          <p className="standard-text-secondary">No internal links available.</p>
        )}
      </div>
      <div className="standard-card">
        <h3 className="section-header">
          External Links ({links.external.length})
        </h3>
        <hr className="mb-4" />
        {links.external.length > 0 ? (
          <LinksList 
            links={links.external} 
            limit={externalLimit} 
            setLimit={setExternalLimit} 
          />
        ) : (
          <p className="standard-text-secondary">No external links available.</p>
        )}
      </div>
    </div>
  );
}
