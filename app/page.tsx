'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconSpider, IconChevronDown, IconX } from '@tabler/icons-react';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="standard-card p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <IconSpider className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Report Viewer
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Access and analyze application crawl reports
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative" ref={applicationInputRef}>
            <label htmlFor="application" className="block text-sm font-medium text-gray-700 mb-2">
              Application Name
            </label>
            <div className="relative">
              <input
                id="application"
                type="text"
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                onFocus={() => setShowApplicationDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         text-gray-900 bg-white transition-colors placeholder:text-gray-400 pr-10"
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
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <IconX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {showApplicationDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[180px] overflow-auto">
                {loadingApplications ? (
                  <div className="p-4 text-center text-gray-500">Loading applications...</div>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none 
                               border-b border-gray-200 last:border-b-0"
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
              </div>
            )}
          </div>

          <div className="relative" ref={reportInputRef}>
            <label htmlFor="reportId" className="block text-sm font-medium text-gray-700 mb-2">
              Report ID
            </label>
            <div className="relative">
              <input
                id="reportId"
                type="text"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                onFocus={() => setShowReportDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         text-gray-900 bg-white transition-colors placeholder:text-gray-400 pr-10"
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
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <IconX className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {showReportDropdown && application && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[180px] overflow-auto">
                {loadingReports ? (
                  <div className="p-4 text-center text-gray-500">Loading reports...</div>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none 
                               border-b border-gray-200 last:border-b-0"
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
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !application || !reportId}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors 
                     font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'View Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
