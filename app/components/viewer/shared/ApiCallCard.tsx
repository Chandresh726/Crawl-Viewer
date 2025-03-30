import { useState } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { ApiCall } from '@/app/types/report';
import { parseUrl } from '@/app/utils/url';
import JsonViewer, { JsonValue } from '@/app/components/JsonViewer';
import { motion, AnimatePresence } from 'framer-motion';
import CopyButton from './CopyButton';

interface ApiCallCardProps {
  call: ApiCall;
}

export default function ApiCallCard({ call }: ApiCallCardProps) {
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
  const methodColorClass = methodColor[call.method] || 'bg-gray-100 text-gray-800';

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="standard-container rounded-2xl overflow-hidden"
    >
      <motion.div 
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="hidden md:block ml-2">
            {expanded ? <IconChevronUp className="w-5 h-5 text-gray-600" /> : <IconChevronDown className="w-5 h-5 text-gray-600" />}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${methodColorClass}`}>
            {call.method}
          </span>
          <span className="text-md font-medium text-gray-900 break-all">
            {domain}{path}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-md font-medium ${statusColor}`}>
          {call.response?.status || 'N/A'}
        </span>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="divide-y standard-border bg-white"
          >
            {/* Query String */}
            {params && (
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-medium standard-text mb-2 flex justify-between items-center">
                  Query String
                  <CopyButton 
                    value={params}
                    index={3}
                    copiedIndex={copiedIndex}
                    onCopy={handleCopy}
                    className="ml-2"
                  />
                </h4>
                <div className="bg-white p-4 standard-border text-xs">
                  <span className="text-gray-900 break-all">{params}</span>
                </div>
              </div>
            )}

            {/* Request Headers */}
            <div className="p-4 bg-gray-50">
              <h4 className="text-sm font-medium standard-text mb-2 flex justify-between items-center">
                Request Headers
                <CopyButton 
                  value={JSON.stringify(call.headers)}
                  index={0}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                  className="ml-2"
                />
              </h4>
              <div className="bg-white p-4 standard-border text-xs whitespace-pre-wrap break-all">
                <div className="w-full space-y-1">
                  {Object.entries(call.headers).map(([key, value], idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="font-medium text-gray-700 min-w-[120px] mr-2">{key}:</span>
                      <span className="text-green-600 break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Response Headers and Body */}
            {call.response && (
              <>
                <div className="p-4 bg-gray-50">
                  <h4 className="text-sm font-medium standard-text mb-2 flex justify-between items-center">
                    Response Headers
                    <CopyButton 
                      value={JSON.stringify(call.response?.headers ?? {})}
                      index={1}
                      copiedIndex={copiedIndex}
                      onCopy={handleCopy}
                      className="ml-2"
                    />
                  </h4>
                  <div className="bg-white p-4 standard-border text-xs whitespace-pre-wrap break-all">
                    <div className="w-full space-y-1">
                      {Object.entries(call.response.headers).map(([key, value], idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="font-medium text-gray-700 min-w-[120px] mr-2">{key}:</span>
                          <span className="text-green-600 break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <h4 className="text-sm font-medium standard-text mb-2 flex justify-between items-center">
                    Response Body
                    <CopyButton 
                      value={JSON.stringify(call.response?.body || {})}
                      index={2}
                      copiedIndex={copiedIndex}
                      onCopy={handleCopy}
                      className="ml-2"
                    />
                  </h4>
                  <div className="bg-white p-4 standard-border text-xs">
                    <JsonViewer data={(call.response?.body as JsonValue) ?? {}} />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
