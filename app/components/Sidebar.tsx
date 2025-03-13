import { IconLoader2 } from '@tabler/icons-react';
import FileTree from './FileTree';
import { ReportStructure } from '@/app/types/report';

interface SidebarProps {
  width: number;
  isLoading: boolean;
  reportStructure: ReportStructure | null;
  basePath: string;
  selectedFolder: string | null;
  onFolderSelect: (path: string) => void;
}

export default function Sidebar({
  width,
  isLoading,
  reportStructure,
  basePath,
  selectedFolder,
  onFolderSelect,
}: SidebarProps) {
  return (
    <div style={{ width }} className="flex-shrink-0">
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
    </div>
  );
}
