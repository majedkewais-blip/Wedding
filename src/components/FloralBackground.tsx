'use client';
import { motion } from 'framer-motion';

/** Ambient floating gold botanicals — purely decorative. */
export default function FloralBackground() {
  const sprigs = [
    { top: '8%', left: '4%', s: 1.1, d: 0 },
    { top: '22%', right: '6%', s: 0.8, d: 1.5 },
    { bottom: '14%', left: '7%', s: 0.9, d: 0.8 },
    { bottom: '8%', right: '5%', s: 1.2, d: 2.2 },
    { top: '52%', left: '50%', s: 0.7, d: 3 }
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {sprigs.map((p, i) => (
        <motion.svg
          key={i} viewBox="0 0 120 120" width={120 * p.s} height={120 * p.s}
          className="absolute opacity-[0.13]"
          style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom } as React.CSSProperties}
          initial={{ opacity: 0 }} animate={{ opacity: 0.13 }} transition={{ duration: 2, delay: p.d }}
        >
          <g className="animate-floaty" style={{ transformOrigin: 'center', animationDelay: `${p.d}s` }}>
            <path d="M10 80 C40 60 70 45 105 20" fill="none" stroke="#B0894E" strokeWidth="1.4" />
            {[[30, 60], [52, 47], [74, 36], [92, 28]].map(([x, y], j) => (
              <ellipse key={j} cx={x} cy={y} rx="11" ry="5.5"
                transform={`rotate(-30 ${x} ${y})`} fill="none" stroke="#B0894E" strokeWidth="1.2" />
            ))}
          </g>
        </motion.svg>
      ))}
    </div>
  );
}
