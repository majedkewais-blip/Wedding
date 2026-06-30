'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Login from '@/components/admin/Login';
import Dashboard from '@/components/admin/Dashboard';

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null); setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="min-h-screen grid place-items-center font-serif text-inksoft">Loading…</div>;

  const allow = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!email) return <Login />;
  if (allow && email.toLowerCase() !== allow.toLowerCase()) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="font-serif text-xl text-forest">This account is not authorised.</p>
          <button onClick={() => supabase.auth.signOut()} className="btn btn-ghost mt-6">Sign out</button>
        </div>
      </div>
    );
  }
  return <Dashboard email={email} />;
}
