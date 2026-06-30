'use client';
import { motion } from 'framer-motion';
import { EVENT } from '@/lib/event';

const rise = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const }
});

export default function Hero({ onRsvp }: { onRsvp: () => void }) {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 text-center">
      {/* arch */}
      <motion.svg viewBox="0 0 360 520" preserveAspectRatio="none" aria-hidden
        className="absolute top-[12%] h-[78%] w-[min(560px,86vw)]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
        <motion.path d="M20 510 L20 150 Q20 20 180 20 Q340 20 340 150 L340 510"
          fill="none" stroke="#B0894E" strokeWidth="1.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, delay: 0.2, ease: 'easeInOut' }} />
      </motion.svg>

      <div className="relative z-10 max-w-xl">
        <motion.div {...rise(0.3)} className="mb-4">
          <span className="eyebrow">Together with our families</span>
        </motion.div>
        <motion.p {...rise(0.5)} className="font-serif italic text-lg md:text-xl text-inksoft">
          request the pleasure of your company
        </motion.p>

        <motion.h1 {...rise(0.7)} className="font-script text-forest leading-[0.85] mt-4">
          <span className="block text-6xl md:text-8xl">{EVENT.groom}</span>
          <span className="block text-4xl md:text-6xl text-gold my-1">&amp;</span>
          <span className="block text-6xl md:text-8xl">{EVENT.bride}</span>
        </motion.h1>

        <motion.div {...rise(1.05)} className="mt-8 flex items-center justify-center gap-4">
          <span className="hairline" />
          <span className="eyebrow !tracking-[0.28em] text-forest2">{EVENT.dateLabel}</span>
          <span className="hairline" />
        </motion.div>
        <motion.p {...rise(1.2)} className="font-serif italic text-inksoft mt-2 text-lg">
          at seven o&apos;clock in the evening
        </motion.p>
        <motion.p {...rise(1.3)} className="font-script text-3xl md:text-4xl text-forest mt-5">
          {EVENT.venueName}
        </motion.p>
        <motion.p {...rise(1.4)} className="eyebrow mt-1">{EVENT.venueArea}</motion.p>

        <motion.div {...rise(1.6)} className="mt-10">
          <button onClick={onRsvp} className="btn btn-primary">RSVP</button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.2 }}
        className="absolute bottom-6 eyebrow !tracking-[0.3em] text-inksoft">scroll</motion.div>
    </section>
  );
}
