'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const d = document.documentElement.classList.contains('dark');
    setDark(d);
  }, []);
  const toggle = () => {
    const el = document.documentElement;
    el.classList.toggle('dark');
    setDark(el.classList.contains('dark'));
  };
  return (
    <button onClick={toggle} aria-label="Toggle dark mode"
      className="fixed bottom-5 left-5 z-40 glass rounded-full p-3 text-forest hover:scale-105 transition">
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
