import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card flex flex-col items-center justify-center p-12 text-center"
  >
    <div className="flex h-16 w-16 items-center justify-center rounded border border-zinc-800 bg-zinc-900 mb-5 text-zinc-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{title}</h3>
    <p className="text-zinc-400 font-light max-w-md mb-6 text-sm">{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;
