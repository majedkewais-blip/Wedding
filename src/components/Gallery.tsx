'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PHOTOS = [
  { src: '/gallery/venue-1.png',  alt: 'Garden reception with floral canopy and aisle' },
  { src: '/gallery/venue-2.png',  alt: 'Tables set beneath festoon lights and greenery' },
  { src: '/gallery/venue-3.png',  alt: 'Open-air seating under the palms' },
  { src: '/gallery/venue-4.png',  alt: 'White arch and ceremony setup' },
  { src: '/gallery/venue-5.png',  alt: 'Guest tables with floral centrepieces' },
  { src: '/gallery/venue-6.png',  alt: 'Candlelit dining with patterned chairs' },
  { src: '/gallery/venue-7.png',  alt: 'Lawn reception under a clear sky' },
  { src: '/gallery/venue-8.png',  alt: 'Decorated tables and lounge seating' },
  { src: '/gallery/venue-9.png',  alt: 'Garden pathway lined with greenery' },
  { src: '/gallery/venue-10.png', alt: 'Floral arbour and seating area' },
  { src: '/gallery/venue-11.png', alt: 'Long banquet table on the lawn' },
  { src: '/gallery/venue-12.png', alt: 'Evening garden setting with string lights' }
];

export default function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
        {PHOTOS.map((p, i) => (
          <motion.button key={p.src} onClick={() => setOpen(p.src)}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.08 }} whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl group ${i === 0 ? 'col-span-2 md:col-span-1 aspect-[4/3]' : 'aspect-[4/3]'}`}>
            <Image src={p.src} alt={p.alt} fill sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 ring-1 ring-inset ring-gold/30 rounded-2xl" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-matte/80 p-4 backdrop-blur">
            <button className="absolute top-5 right-5 text-ivory" aria-label="Close"><X /></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-[min(900px,92vw)] aspect-[3/2]">
              <Image src={open} alt="Venue" fill className="object-contain rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
