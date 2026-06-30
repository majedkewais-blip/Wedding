'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EVENT } from '@/lib/event';

function diff(target: number) {
  const t = Math.max(0, target - Date.now());
  return {
    days: Math.floor(t / 86400000),
    hours: Math.floor((t / 3600000) % 24),
    minutes: Math.floor((t / 60000) % 60),
    seconds: Math.floor((t / 1000) % 60)
  };
}

export default function Countdown() {
  const target = new Date(EVENT.dateISO).getTime();
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: [string, number][] = [
    ['Days', t.days], ['Hours', t.hours], ['Minutes', t.minutes], ['Seconds', t.seconds]
  ];
  return (
    <div className="flex justify-center gap-3 md:gap-6">
      {units.map(([label, val], i) => (
        <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="glass rounded-2xl px-4 py-4 md:px-7 md:py-6 min-w-[72px] md:min-w-[110px] text-center">
          <div className="font-serif text-3xl md:text-5xl font-semibold text-forest tabular-nums">
            {String(val).padStart(2, '0')}
          </div>
          <div className="eyebrow mt-1 !tracking-[0.2em]">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}
