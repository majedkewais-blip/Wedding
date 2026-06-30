'use client';
import { motion } from 'framer-motion';

export function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-10">
      <div className="eyebrow mb-3">{kicker}</div>
      <h2 className="font-script text-5xl md:text-6xl text-forest">{title}</h2>
      <div className="mt-5 flex justify-center"><span className="hairline" /></div>
    </motion.div>
  );
}
