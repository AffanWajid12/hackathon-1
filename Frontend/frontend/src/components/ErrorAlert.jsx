import { motion } from 'framer-motion';

const ErrorAlert = ({ error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.25 }}
      className="bg-red-500 text-[#e7e7e7] text-lg mx-auto max-w-180 px-4 py-3 rounded-lg shadow-md text-center"
    >
      ⚠️ {error}
    </motion.div>
  );
};

export default ErrorAlert;
