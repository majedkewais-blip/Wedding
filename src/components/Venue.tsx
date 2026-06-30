'use client';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { EVENT, mapsEmbedSrc, mapsLinkSrc, mapsDirectionsSrc } from '@/lib/event';

export default function Venue() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-gold"><MapPin size={18} />
              <span className="eyebrow !text-gold">The venue</span></div>
            <h3 className="font-script text-4xl md:text-5xl text-forest mt-2">{EVENT.venueName}</h3>
            <p className="font-serif text-lg text-inksoft mt-1">{EVENT.venueArea}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href={mapsDirectionsSrc()} target="_blank" rel="noopener" className="btn btn-primary">
                <Navigation size={15} /> Get directions
              </a>
              <a href={mapsLinkSrc()} target="_blank" rel="noopener" className="btn btn-ghost">
                <ExternalLink size={15} /> Open in Maps
              </a>
            </div>
          </div>
          <div className="min-h-[280px]">
            <iframe title="Venue map" src={mapsEmbedSrc()} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[280px] border-0" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
