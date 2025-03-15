import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import FileTree from './FileTree';
import { ReportStructure } from '@/app/types/report';

interface SidebarProps {
  width: number;
  isLoading: boolean;
  reportStructure: ReportStructure | null;
  basePath: string;
  selectedFolder: string | null;
  onFolderSelect: (path: string) => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function Sidebar({
  width,
  isLoading,
  reportStructure,
  basePath,
  selectedFolder,
  onFolderSelect,
  isMobileOpen,
  onMobileToggle,
}: SidebarProps) {
  return (
    <>
      <motion.div
        style={{ width: isMobileOpen ? '100%' : width }}
        className={`
          fixed md:relative
          ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}
          transition-all duration-300 ease-in-out
          z-20 md:z-0
          flex-shrink-0
        `}
      >
        <div className="bg-white border-r border-gray-200 h-[calc(100vh-4rem)] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Extracted Resources Paths</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <IconLoader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : reportStructure && (
              <FileTree
                structure={reportStructure}
                basePath={basePath}
                onFolderSelect={onFolderSelect}
                selectedFolder={selectedFolder}
                showOnlyFolders={true}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={onMobileToggle}
        />
      )}
    </>
  );
}
