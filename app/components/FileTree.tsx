import { useState } from 'react';
import { ReportStructure } from '@/app/types/report';
import { 
  IconChevronRight, 
  IconChevronDown,
  IconFolder, 
  IconFolderFilled,
  IconFileAnalytics
} from '@tabler/icons-react';

interface FolderItemProps {
  name: string;
  path: string;
  structure: ReportStructure;
  isSelected: boolean;
  onSelect: (path: string) => void;
  expandedFolders: Set<string>;
  onToggleExpand: (path: string) => void;
  selectedFolder: string | null;
}

// Component for rendering individual folder items
function FolderItem({ 
  name, 
  path, 
  structure, 
  isSelected,
  onSelect,
  expandedFolders,
  onToggleExpand,
  selectedFolder
}: FolderItemProps) {
  const hasSubfolders = Object.values(structure).some(value => value !== null);
  const isExpanded = expandedFolders.has(path);

  const handleClick = () => {
    onSelect(path);
    if (hasSubfolders) {
      onToggleExpand(path);
    }
  };

  return (
    <div className="select-none">
      <button
        onClick={handleClick}
        className={`flex items-center w-full hover:bg-gray-100 px-2 py-2 rounded text-left group
          ${isSelected ? 'bg-blue-100' : ''}`}
      >
        <div className="flex items-center w-full min-w-0">
          <div className="flex-shrink-0 flex items-center">
            {hasSubfolders && (
              <span className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600">
                {isExpanded ? (
                  <IconChevronDown className="w-4 h-4" />
                ) : (
                  <IconChevronRight className="w-4 h-4" />
                )}
              </span>
            )}
            <span className="w-4 h-4 mr-2">
              {hasSubfolders ? (
                <IconFolder className="w-4 h-4 text-gray-400" />
              ) : (
                <IconFileAnalytics className="w-4 h-4 text-gray-400" />
              )}
            </span>
          </div>
          <span className={`text-gray-700 font-medium truncate flex-1
            ${isSelected ? 'text-blue-600' : ''}`}
          >
            /{name}
          </span>
        </div>
      </button>
      
      {/* Render subfolders if expanded */}
      {isExpanded && hasSubfolders && (
        <div className="ml-4 mt-1 border-l border-gray-200 pl-2">
          {Object.entries(structure)
            .filter(([, value]) => value !== null)
            .map(([subName, subStructure]) => {
              const subPath = `${path}/${subName}`;
              return (
                <FolderItem
                  key={subName}
                  name={subName}
                  path={subPath}
                  structure={subStructure as ReportStructure}
                  isSelected={subPath === selectedFolder}
                  onSelect={onSelect}
                  expandedFolders={expandedFolders}
                  onToggleExpand={onToggleExpand}
                  selectedFolder={selectedFolder}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

interface FileTreeProps {
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

  const handleToggleExpand = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="text-sm space-y-2">
      {/* Root folder */}
      <button
        onClick={() => onFolderSelect(basePath)}
        className={`flex items-center w-full hover:bg-gray-100 px-2 py-2 rounded text-left group
          ${selectedFolder === basePath ? 'bg-blue-100' : ''}`}
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
      
      {/* Folder structure */}
      {Object.entries(structure)
        .filter(([, value]) => showOnlyFolders ? value !== null : true)
        .map(([name, subStructure]) => (
          <FolderItem
            key={name}
            name={name}
            path={`${basePath}/${name}`}
            structure={subStructure as ReportStructure}
            isSelected={`${basePath}/${name}` === selectedFolder}
            onSelect={onFolderSelect}
            expandedFolders={expandedFolders}
            onToggleExpand={handleToggleExpand}
            selectedFolder={selectedFolder}
          />
        ))}
    </div>
  );
}