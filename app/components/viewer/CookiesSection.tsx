import { useState } from 'react';
import { IconCheck, IconCopy, IconX } from '@tabler/icons-react';
import { Cookie } from '@/app/types/report';

interface CookiesSectionProps {
  cookies: Cookie[];
}

export default function CookiesSection({ cookies }: CookiesSectionProps) {
  const [cookieLimit, setCookieLimit] = useState(3);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!cookies?.length) return null;

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

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
                    <span className={`px-2 py-1 rounded text-xs ${cookie.secure ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {cookie.secure ? 'Secure' : 'Not Secure'}
                    </span>
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
                  <span className="ml-2 text-sm text-gray-900 break-all bg-gray-50 p-2 rounded truncate inline-block w-full">
                    {cookie.value}
                  </span>
                  <button 
                    className="ml-2 text-blue-600 hover:underline text-xs cursor-pointer" 
                    onClick={() => handleCopy(cookie.value, i)}
                  >
                    {copiedIndex === i ? 
                      <IconCheck className="w-4 h-4 text-green-600" /> : 
                      <IconCopy className="w-4 h-4 hover:text-blue-800" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {cookies.length > cookieLimit && (
              <button 
                className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer" 
                onClick={() => setCookieLimit(cookieLimit + 5)}
              >
                <span>Show More</span>
              </button>
            )}
            {cookieLimit > 3 && (
              <button 
                className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer" 
                onClick={() => setCookieLimit(3)}
              >
                <span>Show Less</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
