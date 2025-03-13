import { useRouter } from 'next/navigation';
import { IconSpider, IconLogout } from '@tabler/icons-react';

interface HeaderProps {
  project: string;
  reportId: string;
}

export default function Header({ project, reportId }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-14">
      <div className="h-full flex items-center space-x-6 px-4">
        <IconSpider className="w-10 h-10 text-red-500" />
        <div className="flex items-center text-lg">
          <span className="text-gray-900 font-medium">Application:</span>
          <span className="text-gray-600 ml-2">{project}</span>
        </div>
        <div className="h-4 w-px bg-gray-300" />
        <div className="flex items-center text-lg">
          <span className="text-gray-900 font-medium">Report:</span>
          <span className="text-gray-600 ml-2">{reportId}</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <IconLogout className="w-5 h-5" />
          <span>Close</span>
        </button>
      </div>
    </div>
  );
}
