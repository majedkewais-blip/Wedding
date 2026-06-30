'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Loader2 } from 'lucide-react';

type Guest = { id: number; name: string };

export default function RSVPForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [hp, setHp] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [party, setParty] = useState(1);
  const [seq, setSeq] = useState(1);

  const addGuest = () => { setGuests((g) => [...g, { id: seq, name: '' }]); setSeq((s) => s + 1); };
  const setGuest = (id: number, v: string) =>
    setGuests((g) => g.map((x) => (x.id === id ? { ...x, name: v } : x)));
  const removeGuest = (id: number) => setGuests((g) => g.filter((x) => x.id !== id));

  const submit = async () => {
    if (name.trim().length < 2) { setMsg('Please enter your full name.'); setStatus('error'); return; }
    setStatus('sending'); setMsg('');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitee_name: name, phone, email, note, website: hp,
          additional_guests: guests.map((g) => ({ name: g.name })).filter((g) => g.name.trim())
        })
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'Something went wrong.'); setStatus('error'); return; }
      setParty(data.party || 1 + guests.filter((g) => g.name.trim()).length);
      setStatus('done');
    } catch { setMsg('Network error. Please try again.'); setStatus('error'); }
  };

  if (status === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-10 md:p-14 text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
          className="mx-auto mb-5 grid place-items-center w-16 h-16 rounded-full bg-forest text-ivory">
          <Check size={30} />
        </motion.div>
        <h3 className="font-script text-5xl text-forest">Thank you</h3>
        <p className="font-serif text-lg text-inksoft mt-4 leading-relaxed">
          Your RSVP for a party of <strong className="text-forest">{party}</strong> has been received.
          We can&apos;t wait to celebrate our special day with you.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }}
      className="glass rounded-3xl p-7 md:p-10 max-w-lg mx-auto">
      <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)}
        name="website" className="hidden" aria-hidden />

      <label className="eyebrow block mb-2">Your name</label>
      <input className="field" value={name} placeholder="Full name"
        onChange={(e) => setName(e.target.value)} />

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="eyebrow block mb-2">Phone <span className="lowercase tracking-normal">(optional)</span></label>
          <input className="field" value={phone} inputMode="tel" placeholder="+20 ..."
            onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Email <span className="lowercase tracking-normal">(optional)</span></label>
          <input className="field" value={email} inputMode="email" placeholder="you@email.com"
            onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <AnimatePresence>
        {guests.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <label className="eyebrow block mb-2 mt-4">Guest {i + 1}</label>
            <div className="flex gap-2">
              <input className="field" value={g.name} placeholder="Guest name"
                onChange={(e) => setGuest(g.id, e.target.value)} />
              <button onClick={() => removeGuest(g.id)} aria-label="Remove guest"
                className="shrink-0 grid place-items-center w-12 rounded-xl border border-gold/30 text-forest hover:bg-gold/10">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button onClick={addGuest}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-gold px-5 py-2.5 text-sm text-forest hover:bg-gold/10 transition">
        <span className="grid place-items-center w-6 h-6 rounded-full bg-forest text-ivory"><Plus size={14} /></span>
        Add a guest
      </button>

      <label className="eyebrow block mb-2 mt-6">A note for the couple <span className="lowercase tracking-normal">(optional)</span></label>
      <textarea className="field min-h-[80px]" value={note} onChange={(e) => setNote(e.target.value)} />

      {status === 'error' && <p className="text-emerald-900/80 text-sm mt-3 font-serif italic">{msg}</p>}

      <button onClick={submit} disabled={status === 'sending'}
        className="btn btn-primary w-full mt-6 disabled:opacity-60">
        {status === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Confirm attendance'}
      </button>
    </motion.div>
  );
}
