import { ReportData } from '@/app/types/report';
import {
  HeaderSection,
  LinksSection,
  CookiesSection,
  FormsSection,
  ApiCallsSection,
  StorageSection
} from './viewer';
import MetricsSection from './viewer/MetricsSection';
import { motion } from 'framer-motion';

interface ReportViewerProps {
  data: ReportData;
}

export default function ReportViewer({ data }: ReportViewerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="min-h-screen p-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <motion.div variants={item}>
          <HeaderSection url={data.url} metadata={data.metadata} data={data} />
        </motion.div>

        <motion.div variants={item}>
          <MetricsSection data={data} />
        </motion.div>

        <motion.div variants={item}>
          <LinksSection links={{ internal: data.internalLinks, external: data.externalLinks }} />
        </motion.div>

        <motion.div variants={item}>
          <CookiesSection cookies={data.cookies} />
        </motion.div>

        <motion.div variants={item}>
          <ApiCallsSection calls={data.apiCalls} />
        </motion.div>

        <motion.div variants={item}>
          <FormsSection forms={data.forms} />
        </motion.div>

        <motion.div variants={item}>
          <StorageSection storage={{ localStorage: data.localStorage, sessionStorage: data.sessionStorage }} />
        </motion.div>
      </div>
    </motion.div>
  );
}