'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IconLoader2, IconAlertCircle, IconFileAnalytics } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  useEffect(() => {
    // Close mobile sidebar when loading new content
    if (isFileLoading) {
      setIsMobileOpen(false);
    }
  }, [isFileLoading]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl max-w-md w-full mx-4 border border-red-100"
        >
          <IconAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl text-red-600 mb-4 font-medium">Failed to load report structure</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30"
          >
            Go Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        project={project} 
        reportId={reportId} 
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <div className="flex w-full mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sidebar
              width={sidebarWidth}
              isLoading={isLoading}
              reportStructure={reportStructure}
              basePath={basePath}
              selectedFolder={selectedFolder}
              onFolderSelect={loadFolderResult}
              isMobileOpen={isMobileOpen}
              onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
            />
          </motion.div>
        </AnimatePresence>

        <ResizableDivider onResize={setSidebarWidth} />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto h-[calc(100vh-3.5rem)] bg-white"
        >
          <AnimatePresence mode="wait">
            {isFileLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <IconLoader2 className="w-12 h-12 text-red-500 animate-spin" />
              </motion.div>
            ) : selectedFolder ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-7xl mx-auto"
              >
                {fileContent ? (
                  <ReportDataViewer data={fileContent} />
                ) : (
                  <div className="bg-white rounded-3xl shadow-xl p-12 text-center m-4 border border-gray-100">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-gray-400 mb-3"
                    >
                      <IconFileAnalytics className="w-16 h-16 mx-auto" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No Results Found
                    </h3>
                    <p className="text-sm text-gray-500">
                      This folder doesn&apos;t have any results to display
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full text-gray-500"
              >
                Select a folder from the sidebar to view its results
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}