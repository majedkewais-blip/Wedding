'use client';
import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/** Place an mp3 at /public/audio/music.mp3 to enable. Starts muted (browser policy). */
export default function MusicToggle() {
  const ref = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (on) { a.pause(); setOn(false); }
    else { a.volume = 0.35; a.play().then(() => setOn(true)).catch(() => setOn(false)); }
  };
  return (
    <>
      <audio ref={ref} loop src="/audio/music.mp3" preload="none" />
      <button onClick={toggle} aria-label={on ? 'Mute music' : 'Play music'}
        className="fixed bottom-5 right-5 z-40 glass rounded-full p-3 text-forest hover:scale-105 transition">
        {on ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
