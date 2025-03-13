'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IconLoader2, IconAlertCircle, IconFileAnalytics } from '@tabler/icons-react';
import { ReportStructure , ReportData } from '@/app/types/report';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import ResizableDivider from '@/app/components/ResizableDivider';
import ReportDataViewer from '@/app/components/ReportViewer';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [reportStructure, setReportStructure] = useState<ReportStructure | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  const { project, reportId } = params as { project: string; reportId: string };
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
      <Header project={project} reportId={reportId} />

      <div className="flex w-full mt-16">
        <Sidebar
          width={sidebarWidth}
          isLoading={isLoading}
          reportStructure={reportStructure}
          basePath={basePath}
          selectedFolder={selectedFolder}
          onFolderSelect={loadFolderResult}
        />

        <ResizableDivider onResize={setSidebarWidth} />

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