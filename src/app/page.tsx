'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import FloralBackground from '@/components/FloralBackground';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import { SectionHeading } from '@/components/Section';
import RSVPForm from '@/components/RSVPForm';
import Venue from '@/components/Venue';
import Gallery from '@/components/Gallery';
import MusicToggle from '@/components/MusicToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { EVENT } from '@/lib/event';

export default function Home() {
  const rsvpRef = useRef<HTMLDivElement>(null);
  const toRsvp = () => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="relative">
      <LoadingScreen />
      <FloralBackground />
      <MusicToggle />
      <ThemeToggle />

      <Hero onRsvp={toRsvp} />

      <section className="py-20 md:py-28 px-6">
        <SectionHeading kicker="Counting the days" title="Until we say I do" />
        <Countdown />
      </section>

      <section ref={rsvpRef} className="py-20 md:py-28 px-6 scroll-mt-10">
        <SectionHeading kicker="Kindly respond" title="Will you join us?" />
        <RSVPForm />
      </section>

      <section className="py-20 md:py-28 px-6">
        <SectionHeading kicker="Where" title="The Venue" />
        <Venue />
      </section>

      <section className="py-20 md:py-28 px-6">
        <SectionHeading kicker="A glimpse" title="The Setting" />
        <Gallery />
      </section>

      <footer className="py-16 text-center px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="font-script text-4xl text-forest">{EVENT.groom} &amp; {EVENT.bride}</div>
          <div className="eyebrow mt-2">05 · 08 · 2026</div>
          <a href="/admin" className="inline-block mt-8 text-[11px] tracking-[0.3em] uppercase text-inksoft/60 hover:text-forest">
            Host login
          </a>
        </motion.div>
      </footer>
    </main>
  );
}
