import { IconSpider, IconMenu2, IconChevronLeft, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  project: string;
  reportId: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function Header({ project, reportId, isMobileOpen, onMobileToggle }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-14">
      <div className="h-full flex items-center px-2 md:px-4 space-x-2 md:space-x-6">
        {/* Sidebar Toggle */}
        <button
          onClick={onMobileToggle}
          className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
        >
          {isMobileOpen ? (
            <IconChevronLeft className="w-5 h-5 text-gray-600" />
          ) : (
            <IconMenu2 className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <IconSpider className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
        
        <div className="flex flex-1 items-center space-x-2 md:space-x-6 min-w-0 text-sm md:text-base">
          <div className="flex items-center min-w-0">
            <span className="text-gray-900 font-medium whitespace-nowrap">App:</span>
            <span className="text-gray-600 ml-1 truncate">{project}</span>
          </div>

          <div className="h-4 w-px bg-gray-300 hidden sm:block" />

          <div className="flex items-center min-w-0">
            <span className="text-gray-900 font-medium whitespace-nowrap">ID:</span>
            <span className="text-gray-600 ml-1 truncate">{reportId}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="ml-auto flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <span className="hidden sm:inline">Close</span>
          <IconX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
