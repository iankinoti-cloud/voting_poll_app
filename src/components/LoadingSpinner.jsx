import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 40 }) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `3px solid #3d3830`,
        borderTop: `3px solid #c8b89a`,
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}
