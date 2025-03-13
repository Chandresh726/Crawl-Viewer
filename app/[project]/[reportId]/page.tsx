'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileTree from '@/app/components/FileTree';
import ReportDataViewer from '@/app/components/ReportViewer';
import { ReportStructure } from '@/app/types/report';
import { IconLoader2, IconAlertCircle, IconLogout, IconFileAnalytics, IconSpider } from '@tabler/icons-react';

const ResizableDivider = ({ onResize }: { onResize: (width: number) => void }) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const delta = e.clientX - startX.current;
      const newWidth = startWidth.current + delta;
      
      // Constrain between 200px and 600px
      if (newWidth >= 300 && newWidth <= 600) {
        onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    startX.current = e.clientX;
    // Get the width of the sidebar element
    const sidebarElement = dividerRef.current?.previousElementSibling;
    startWidth.current = sidebarElement?.getBoundingClientRect().width || 320;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      ref={dividerRef}
      className="w-1 hover:bg-blue-400 bg-gray-200 cursor-col-resize transition-colors h-[calc(100vh-4rem)]"
      onMouseDown={handleMouseDown}
    />
  );
};

interface FileContent {
  url: string;
  metadata: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  internalLinks: string[];
  externalLinks: string[];
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite?: string;
  }>;
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  forms: Array<{
    action?: string;
    method?: string;
    inputs: Array<{
      name?: string;
      id?: string;
      type?: string;
      value?: string;
      required?: boolean;
    }>;
  }>;
  apiCalls: Array<{
    url: string;
    method: string;
    headers: Record<string, string>;
    response: {
      status: number;
      headers: Record<string, string>;
      body: unknown;
    };
  }>;
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [reportStructure, setReportStructure] = useState<ReportStructure | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  const { project, reportId } = params as { project: string; reportId: string };
  const formattedReportId = typeof reportId === 'string' && reportId.startsWith('report-') 
    ? reportId 
    : `report-${reportId}`;
  const basePath = `${project}/${reportId}`;

  const loadFolderResult = async (folderPath: string) => {
    try {
      setIsFileLoading(true);
      setFileContent(null); // Clear previous content
      const resultPath = `${folderPath}/result.json`;
      const response = await fetch(`/api/reports/content?path=${encodeURIComponent(resultPath)}`);
      const data = await response.json();
      
      if (!response.ok) {
        setFileContent(null);
        setSelectedFolder(folderPath);
        return;
      }
      
      setFileContent(data);
      setSelectedFolder(folderPath);
    } catch {
      setFileContent(null);
      setSelectedFolder(folderPath);
    } finally {
      setIsFileLoading(false);
    }
  };

  useEffect(() => {
    const fetchStructure = async () => {
      // Don't fetch if we already have the structure for this project/reportId
      if (reportStructure) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/reports/${project}/${reportId}/structure`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load report structure');
        }
        
        setReportStructure(data);
        // Load root directory report by default
        loadFolderResult(basePath);
      } catch {
        setError('Failed to load report structure. Please try again.');
        setReportStructure(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (project && reportId) {
      fetchStructure();
    }
  }, [project, reportId, reportStructure, basePath]);

  const handleFolderSelect = async (path: string) => {
    await loadFolderResult(path);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
          <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl text-red-600 mb-4">Failed to load report structure. Please try again.</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex w-full mt-16">
        {/* Sidebar */}
        <div style={{ width: sidebarWidth }} className="flex-shrink-0">
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
                  onFolderSelect={handleFolderSelect}
                  selectedFolder={selectedFolder}
                  showOnlyFolders={true}
                />
              )}
            </div>
          </div>
        </div>

        {/* Resizable Divider */}
        <ResizableDivider onResize={setSidebarWidth} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto h-[calc(100vh-4rem)] bg-white">
          {isFileLoading ? (
            <div className="flex items-center justify-center h-full">
              <IconLoader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : selectedFolder ? (
            <div className="max-w-7xl mx-auto">
              {fileContent ? (
                <ReportDataViewer data={fileContent} />
              ) : (
                <div className="bg-white overflow-hidden p-12 text-center">
                  <div className="text-gray-400 mb-3">
                    <IconFileAnalytics className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Results Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    This folder doesn&apos;t have any results to display
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a folder from the sidebar to view its results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}