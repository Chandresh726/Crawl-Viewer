import { useState } from 'react';
import { ReportStructure } from '@/app/types/report';
import { 
  IconChevronRight, 
  IconChevronDown,
  IconFolder, 
  IconFolderFilled,
  IconFileAnalytics,
  IconHome
} from '@tabler/icons-react';

export interface FileTreeProps {
  structure: ReportStructure;
  basePath: string;
  onFolderSelect: (path: string) => void;
  selectedFolder?: string | null;
  showOnlyFolders?: boolean;
}

export default function FileTree({ 
  structure, 
  basePath, 
  onFolderSelect,
  selectedFolder = null,
  showOnlyFolders = true
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folder: string, isExpanding: boolean, hasSubfolders: boolean) => {
    const folderPath = `${basePath}/${folder}`;
    
    // Only select the folder if it's not already selected
    if (folderPath !== selectedFolder) {
      onFolderSelect(folderPath);
    }

    // Only handle expansion for folders with subfolders
    if (hasSubfolders) {
      const newExpanded = new Set(expandedFolders);
      if (!isExpanding) {
        newExpanded.delete(folder);
      } else {
        newExpanded.add(folder);
      }
      setExpandedFolders(newExpanded);
    }
  };

  const handleRootClick = () => {
    // Only select root if it's not already selected
    if (basePath !== selectedFolder) {
      onFolderSelect(basePath);
    }
  };

  const isSelected = (path: string): boolean => {
    const fullPath = `${basePath}/${path}`;
    return fullPath === selectedFolder;
  };

  const hasSubfolders = (struct: ReportStructure | null): boolean => {
    if (!struct) return false;
    return Object.values(struct).some(value => value !== null);
  };

  const renderTree = (struct: ReportStructure, currentPath: string) => {
    const entries = Object.entries(struct)
      .filter(([_, value]) => showOnlyFolders ? value !== null : true);

    if (entries.length === 0) return null;

    return entries.map(([name, subStructure]) => {
      const path = currentPath ? `${currentPath}/${name}` : name;
      const isFolder = subStructure !== null;
      const isExpanded = expandedFolders.has(path);
      const isPathSelected = isSelected(path);
      const containsSubfolders = hasSubfolders(subStructure);

      if (!isFolder && showOnlyFolders) return null;

      return (
        <div key={path} className="select-none">
          <button
            onClick={() => isFolder && toggleFolder(path, !isExpanded, containsSubfolders)}
            className={`flex items-center w-full hover:bg-gray-100 px-2 py-2 rounded text-left group
              ${isPathSelected ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-center w-full min-w-0">
              <div className="flex-shrink-0 flex items-center">
                {isFolder && containsSubfolders && (
                  <span className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600">
                    {isExpanded ? (
                      <IconChevronDown className="w-4 h-4" />
                    ) : (
                      <IconChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
                {isFolder ? (
                  containsSubfolders ? (
                    <span className="w-4 h-4 mr-2">
                      <IconFolder className="w-4 h-4 text-gray-400" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 mr-2">
                      <IconFileAnalytics className="w-4 h-4 text-gray-400" />
                    </span>
                  )
                ) : (
                  <span className="w-4 h-4 mr-2">
                    <IconFileAnalytics className="w-4 h-4 text-gray-400" />
                  </span>
                )}
              </div>
              <span className={`text-gray-700 font-medium truncate flex-1
                ${isPathSelected ? 'text-blue-600' : ''}`}
              >
                /{name}
              </span>
            </div>
          </button>
          {isFolder && isExpanded && (
            <div className="ml-4 mt-1 border-l border-gray-200 pl-2">
              {renderTree(subStructure, path)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="text-sm space-y-2">
      <button
        onClick={handleRootClick}
        className={`flex items-center w-full hover:bg-gray-100 px-2 py-2 rounded text-left group
          ${selectedFolder === basePath ? 'bg-blue-50' : ''}`}
      >
        <div className="flex items-center w-full min-w-0">
          <div className="flex-shrink-0 flex items-center">
            <span className="w-4 h-4 mr-2">
              <IconFolderFilled className="w-4 h-4 text-blue-500" />
            </span>
          </div>
          <span className={`text-gray-700 font-medium truncate flex-1
            ${selectedFolder === basePath ? 'text-blue-600' : ''}`}
          >
            /
          </span>
        </div>
      </button>
      {renderTree(structure, '')}
    </div>
  );
} 