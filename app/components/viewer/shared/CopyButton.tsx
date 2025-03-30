import { IconCheck, IconCopy } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyButtonProps {
  value: string;
  index: number;
  copiedIndex: number | null;
  onCopy: (value: string, index: number) => void;
  className?: string;
}

export default function CopyButton({ value, index, copiedIndex, onCopy, className = '' }: CopyButtonProps) {
  return (
    <button 
      onClick={() => onCopy(value, index)}
      className={`standard-button ${className}`}
    >
      <AnimatePresence mode="wait">
        {copiedIndex === index ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconCheck className="w-4 h-4 text-green-600" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconCopy className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
