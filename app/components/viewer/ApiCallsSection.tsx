import { motion } from 'framer-motion';
import ApiCallCard from './shared/ApiCallCard';
import { ApiCall } from '@/app/types/report';

interface ApiCallsSectionProps {
  calls: ApiCall[];
}

export default function ApiCallsSection({ calls }: ApiCallsSectionProps) {
  if (!calls?.length) return null;

  return (
    <div className="standard-section">
      <h2 className="section-header">API Calls ({calls.length})</h2>
      <div className="space-y-4">
        {calls.map((call, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <ApiCallCard call={call} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
