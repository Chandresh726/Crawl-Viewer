import { ReportData } from '@/app/types/report';
import {
  HeaderSection,
  LinksSection,
  CookiesSection,
  FormsSection,
  ApiCallsSection,
  StorageSection
} from './viewer';

interface ReportViewerProps {
  data: ReportData;
}

export default function ReportViewer({ data }: ReportViewerProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <HeaderSection url={data.url} metadata={data.metadata} />
        <LinksSection links={{ internal: data.internalLinks, external: data.externalLinks }} />
        <CookiesSection cookies={data.cookies} />
        <ApiCallsSection calls={data.apiCalls} />
        <FormsSection forms={data.forms} />
        <StorageSection storage={{ localStorage: data.localStorage, sessionStorage: data.sessionStorage }} />
      </div>
    </div>
  );
}