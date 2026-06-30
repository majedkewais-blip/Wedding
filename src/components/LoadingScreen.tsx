'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 1600); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-ivory">
          <div className="text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="font-script text-6xl text-forest">M <span className="text-gold">&amp;</span> N</motion.div>
            <motion.div initial={{ width: 0 }} animate={{ width: 120 }} transition={{ duration: 1.2 }}
              className="h-px bg-gold mx-auto mt-4" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
