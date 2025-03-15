'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconSpider, IconChevronDown, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [application, setApplication] = useState('');
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<string[]>([]);
  const [reports, setReports] = useState<string[]>([]);
  const [showApplicationDropdown, setShowApplicationDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const applicationInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoadingApplications(true);
      try {
        const response = await fetch('/api/reports/available');
        const data = await response.json();
        if (response.ok) {
          setApplications(data.projects);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      if (!application) {
        setReports([]);
        return;
      }

      setLoadingReports(true);
      try {
        const response = await fetch(`/api/reports/available?project=${encodeURIComponent(application)}`);
        const data = await response.json();
        if (response.ok) {
          setReports(data.reports);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, [application]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (applicationInputRef.current && !applicationInputRef.current.contains(event.target as Node)) {
        setShowApplicationDropdown(false);
      }
      if (reportInputRef.current && !reportInputRef.current.contains(event.target as Node)) {
        setShowReportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (application && reportId) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/${application}/${reportId}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredApplications = applications.filter(p => 
    p.toLowerCase().includes(application.toLowerCase())
  );

  const filteredReports = reports.filter(r => 
    r.toLowerCase().includes(reportId.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-100 via-red-300 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-200/50 p-8 w-full max-w-md border border-white/50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center mb-6"
        >
          <IconSpider className="w-16 h-16 text-red-500 drop-shadow-lg" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-500 mb-2 text-center"
        >
          Report Viewer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8 text-center"
        >
          Access and analyze application crawl reports
        </motion.p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group relative" ref={applicationInputRef}>
            <label htmlFor="application" className="block text-sm font-medium text-gray-700 mb-2">
              Application Name
            </label>
            <motion.div
              whileTap={{ scale: 0.995 }}
              className="relative"
            >
              <input
                id="application"
                type="text"
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                onFocus={() => setShowApplicationDropdown(true)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-300/20 focus:border-red-500 text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 pr-10 hover:border-red-300"
                placeholder="Enter application name"
                required
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {application && (
                  <button
                    type="button"
                    onClick={() => {
                      setApplication('');
                      setReportId('');
                      setReports([]);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <IconX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
            <AnimatePresence>
              {showApplicationDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 max-h-[180px] overflow-auto"
                >
                  {loadingApplications ? (
                    <div className="p-4 text-center text-gray-500">Loading applications...</div>
                  ) : filteredApplications.length > 0 ? (
                    filteredApplications.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setApplication(p);
                          setShowApplicationDropdown(false);
                        }}
                      >
                        {p}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-900">No applications found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="group relative" ref={reportInputRef}>
            <label htmlFor="reportId" className="block text-sm font-medium text-gray-700 mb-2">
              Report ID
            </label>
            <motion.div
              whileTap={{ scale: 0.995 }}
              className="relative"
            >
              <input
                id="reportId"
                type="text"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                onFocus={() => setShowReportDropdown(true)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-300/20 focus:border-red-500 text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 pr-10 hover:border-red-300"
                placeholder="Enter report ID"
                required
                disabled={!application}
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {reportId && (
                  <button
                    type="button"
                    onClick={() => setReportId('')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <IconX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
            <AnimatePresence>
              {showReportDropdown && application && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 max-h-[180px] overflow-auto"
                >
                  {loadingReports ? (
                    <div className="p-4 text-center text-gray-500">Loading reports...</div>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setReportId(r);
                          setShowReportDropdown(false);
                        }}
                      >
                        {r}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-900">No reports found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !application || !reportId}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 px-4 rounded-2xl 
                     hover:from-red-600 hover:to-red-700 transition-all duration-300 
                     font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
                     shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'View Report'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
