'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const signIn = async () => {
    setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
    setBusy(false);
  };

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="glass rounded-3xl p-10 w-full max-w-sm">
        <div className="grid place-items-center w-14 h-14 rounded-full bg-forest text-ivory mx-auto mb-5"><Lock size={22} /></div>
        <h1 className="font-script text-4xl text-forest text-center">Host login</h1>
        <p className="eyebrow text-center mt-2 mb-6">Guest list — private</p>
        <input className="field" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input className="field mt-3" type="password" placeholder="Password" value={pw}
          onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && signIn()} />
        {err && <p className="text-sm text-emerald-900/80 mt-3 font-serif italic">{err}</p>}
        <button onClick={signIn} disabled={busy} className="btn btn-primary w-full mt-6 disabled:opacity-60">
          {busy ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Unlock dashboard'}
        </button>
      </div>
    </div>
  );
}
