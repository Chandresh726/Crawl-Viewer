import { useState } from 'react';
import { IconX, IconCopy, IconCheck, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import JsonViewer, { JsonValue } from './JsonViewer';

// Type definitions
interface Metadata {
  title?: string;
  description?: string;
  keywords?: string;
}

interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: string;
}

interface FormInput {
  name?: string;
  id?: string;
  type?: string;
  value?: string;
  required?: boolean;
}

interface Form {
  action?: string;
  method?: string;
  inputs?: FormInput[];
}

interface ApiCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  response?: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
  };
}

interface ReportData {
  url: string;
  metadata: Metadata;
  internalLinks: string[];
  externalLinks: string[];
  cookies: Cookie[];
  apiCalls: ApiCall[];
  forms: Form[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

interface ReportViewerProps {
  data: ReportData;
}

const parseUrl = (url: string) => {
  try {
    const { hostname, pathname, search } = new URL(url);
    return { domain: hostname, path: pathname, params: search };
  } catch {
    return { domain: '', path: '', params: '' };
  }
};

const HeaderSection = ({ url, metadata }: { url: string, metadata: Metadata }) => {
  const { domain, path, params } = parseUrl(url);
  const hasContent = metadata?.title || metadata?.description || metadata?.keywords;

  return (
    <div className="space-y-4 bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="text-2xl text-gray-900">
          <span className="font-bold">Domain: </span><span className="text-gray-700">{domain}</span>
          <span className="ml-4 font-bold">Path: </span><span className="text-gray-700">{path}</span>
        </div>
      </div>
      {params && (
        <div className="text-sm text-gray-500 mt-2">Params: {params}</div>
      )}
      {hasContent && (
        <div className="mt-2">
          {metadata.title && (
            <div className="flex justify-normal">
              <span className="text-md font-medium text-gray-500">Title:</span>
              <p className="text-md font-medium text-gray-900 ml-4">{metadata.title}</p>
            </div>
          )}
          {metadata.description && (
            <div className="my-2">
              <span className="text-sm font-medium text-gray-500">Description</span>
              <p className="text-sm text-gray-700">{metadata.description}</p>
            </div>
          )}
          {metadata.keywords && (
            <div>
              <span className="text-sm font-medium text-gray-500">Keywords</span>
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
};

// Convert renderLinks to a proper component
const LinksList = ({ 
  links, 
  limit, 
  setLimit 
}: { 
  links: string[],
  limit: number,
  setLimit: (value: number) => void 
}) => {
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
};

const LinksSection = ({ links }: { links: { internal: string[], external: string[] } }) => {
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
};

const StorageData = ({ 
  data, 
  title, 
  limit, 
  setLimit,
  onCopy,
  copiedIndex
}: { 
  data: Record<string, string> | null;
  title: string;
  limit: number;
  setLimit: (value: number) => void;
  onCopy: (value: string, index: number) => void;
  copiedIndex: number | null;
}) => (
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

const StorageSection = ({ storage }: { 
  storage: { 
    localStorage: Record<string, string>; 
    sessionStorage: Record<string, string>; 
  } 
}) => {
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
};

const CookiesSection = ({ cookies }: { cookies: Cookie[] }) => {
  const [cookieLimit, setCookieLimit] = useState(3);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  if (!cookies?.length) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Cookies ({cookies.length})</h2>
          <hr className="my-2" />
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {cookies.slice(0, cookieLimit).map((cookie, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{cookie.name}</span>
                  <div className="space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${cookie.secure ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{cookie.secure ? 'Secure' : 'Not Secure'}</span>
                    <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                      {cookie.httpOnly ? <IconCheck className="inline w-3 h-3" /> : <IconX className="inline w-3 h-3" />} HttpOnly
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Domain:</span>
                    <span className="ml-2 text-gray-900">{cookie.domain}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Path:</span>
                    <span className="ml-2 text-gray-900">{cookie.path}</span>
                  </div>
                  {cookie.sameSite && (
                    <div>
                      <span className="text-gray-500">SameSite:</span>
                      <span className="ml-2 text-gray-900">{cookie.sameSite}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-gray-500 text-sm">Value:</span>
                  <span className="ml-2 text-sm text-gray-900 break-all bg-gray-50 p-2 rounded truncate inline-block w-full">{cookie.value}</span>
                  <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => handleCopy(cookie.value, i)}>
                    {copiedIndex === i ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {cookies.length > cookieLimit && (
              <button className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer" onClick={() => setCookieLimit(cookieLimit + 5)}>
                <span>Show More</span>
              </button>
            )}
            {cookieLimit > 3 && (
              <button className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer" onClick={() => setCookieLimit(3)}>
                <span>Show Less</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormsSection = ({ forms }: { forms: Form[] }) => {
  if (!forms?.length) return null;

  const [formLimits, setFormLimits] = useState<{ [key: number]: number }>(
    Object.fromEntries(forms.map((_, i) => [i, 5]))
  );

  const handleShowMore = (formIndex: number) => {
    setFormLimits(prev => ({
      ...prev,
      [formIndex]: prev[formIndex] + 5
    }));
  };

  const handleShowLess = (formIndex: number) => {
    setFormLimits(prev => ({
      ...prev,
      [formIndex]: 5
    }));
  };

  return (
    <div className="space-y-4 bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Forms ({forms.length})</h2>
      <div className="space-y-6">
        {forms.map((form, i) => (
          <div key={i} className="bg-white rounded-sm p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Action:</span>
                <span className="ml-2 text-gray-900">{form.action || 'Not specified'}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                form.method === 'POST' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {form.method || 'GET'}
              </span>
            </div>
            {Array.isArray(form.inputs) && form.inputs.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Form Fields ({form.inputs.length})
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {form.inputs.slice(0, formLimits[i]).map((input: FormInput, j: number) => (
                    <div key={j} className="flex items-center bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${input.required ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                            {input.required ? 'Required' : 'Optional'}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {input.name || input.id || 'Unnamed field'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Type: {input.type || 'text'}
                          </span>
                        </div>
                      </div>
                      {input.value && (
                        <div className="text-sm text-gray-600">
                          Default: {input.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {form.inputs.length > 5 && (
                  <div className="flex justify-between mt-4">
                    {formLimits[i] < form.inputs.length && (
                      <button
                        onClick={() => handleShowMore(i)}
                        className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer"
                      >
                        <span>Show More</span>
                      </button>
                    )}
                    {formLimits[i] > 5 && (
                      <button
                        onClick={() => handleShowLess(i)}
                        className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer"
                      >
                        <span>Show Less</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ApiCallCard = ({ call }: { call: ApiCall }) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { domain, path, params } = parseUrl(call.url);
  const statusColor = (call.response?.status ?? 500) < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const methodColor: { [key: string]: string } = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-purple-100 text-purple-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  };
  const methodColorClass = methodColor[call.method as string] || 'bg-gray-100 text-gray-800';

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="ml-2">
            {expanded ? <IconChevronUp className="w-5 h-5 text-gray-600" /> : <IconChevronDown className="w-5 h-5 text-gray-600" />}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${methodColorClass}`}>
            {call.method || 'UNKNOWN'}
          </span>
          <span className="text-md font-medium text-gray-900 break-all">
            {domain}{path}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-md font-medium ${statusColor}`}>
          {call.response?.status || 'N/A'}
        </span>
      </div>
      {expanded && (
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {params && (
            <div className="p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex justify-between items-center">
                Query String
                <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => handleCopy(params, 3)}>
                  {copiedIndex === 3 ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
                </button>
              </h4>
              <div className="bg-white p-4 border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-900 break-all">{params}</span>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex justify-between items-center">
              Request Headers
              <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => handleCopy(JSON.stringify(call.headers || {}), 0)}>
                {copiedIndex === 0 ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
              </button>
            </h4>
            <div className="bg-white p-4 border border-gray-200 text-xs whitespace-pre-wrap break-all">
              <div className="w-full space-y-1">
                {Object.entries(call.headers || {}).map(([key, value], idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="font-medium text-gray-700 min-w-[120px] mr-2">{key}:</span>
                    <span className="text-green-600 break-all">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex justify-between items-center">
              Response Headers
              <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => handleCopy(JSON.stringify(call.response?.headers || {}), 1)}>
                {copiedIndex === 1 ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
              </button>
            </h4>
            <div className="bg-white p-4 border border-gray-200 text-xs whitespace-pre-wrap break-all">
              <div className="w-full space-y-1">
                {Object.entries(call.response?.headers || {}).map(([key, value], idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="font-medium text-gray-700 min-w-[120px] mr-2">{key}:</span>
                    <span className="text-green-600 break-all">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex justify-between items-center">
              Response Body
              <button className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" onClick={() => handleCopy(JSON.stringify(call.response?.body || {}), 2)}>
                {copiedIndex === 2 ? <IconCheck className="w-4 h-4 text-green-600" /> : <IconCopy className="w-4 h-4 hover:text-blue-800" />}
              </button>
            </h4>
            <div className="bg-white p-4 border border-gray-200 text-xs">
              <div className="w-full">
                <JsonViewer data={(call.response?.body as JsonValue) ?? {}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ApiCallsSection = ({ calls }: { calls: ApiCall[] }) => {
  if (!calls?.length) return null;

  return (
    <div className="space-y-4 bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 text-center">API Calls ({calls.length})</h2>
      <div className="space-y-4">
        {calls.map((call, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <ApiCallCard call={call} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function ReportViewer({ data }: ReportViewerProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section */}
        <HeaderSection url={data.url} metadata={data.metadata} />

        {/* Links Section */}
        <LinksSection links={{ internal: data.internalLinks, external: data.externalLinks }} />

        {/* Cookies Section */}
        <CookiesSection cookies={data.cookies} />

        {/* API Calls Section */}
        <ApiCallsSection calls={data.apiCalls} />

        {/* Forms Section */}
        <FormsSection forms={data.forms} />

        {/* Storage Section */}
        <StorageSection storage={{ localStorage: data.localStorage, sessionStorage: data.sessionStorage }} />
      </div>
    </div>
  );
}