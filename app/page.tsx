'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconSpider, IconChevronDown, IconX } from '@tabler/icons-react';

export default function Home() {
  const router = useRouter();
  const [project, setProject] = useState('');
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [reports, setReports] = useState<string[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await fetch('/api/reports/available');
        const data = await response.json();
        if (response.ok) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      if (!project) {
        setReports([]);
        return;
      }

      setLoadingReports(true);
      try {
        const response = await fetch(`/api/reports/available?project=${encodeURIComponent(project)}`);
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
  }, [project]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectInputRef.current && !projectInputRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
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
    if (project && reportId) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/${project}/${reportId}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.toLowerCase().includes(project.toLowerCase())
  );

  const filteredReports = reports.filter(r => 
    r.toLowerCase().includes(reportId.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100 p-8 w-full max-w-md border border-blue-100">
        <div className="flex items-center justify-center mb-6">
          <IconSpider className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500 mb-2 text-center">
          Report Viewer
        </h1>
        <p className="text-gray-600 mb-8 text-center">Enter project and report details to view</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group relative" ref={projectInputRef}>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <div className="relative">
              <input
                id="project"
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                onFocus={() => setShowProjectDropdown(true)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 pr-10"
                placeholder="Enter project name"
                required
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {project && (
                  <button
                    type="button"
                    onClick={() => {
                      setProject('');
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
            </div>
            {showProjectDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[180px] overflow-auto">
                {loadingProjects ? (
                  <div className="p-4 text-center text-gray-500">Loading projects...</div>
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setProject(p);
                        setShowProjectDropdown(false);
                      }}
                    >
                      {p}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-900">No projects found</div>
                )}
              </div>
            )}
          </div>

          <div className="group relative" ref={reportInputRef}>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 pr-10"
                placeholder="Enter report ID"
                required
                disabled={!project}
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
            </div>
            {showReportDropdown && project && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[180px] overflow-auto">
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
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !project || !reportId}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl 
                     hover:from-gray-700 hover:to-gray-800 active:scale-[0.98] transition-all duration-200 
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
