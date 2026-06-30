'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Rsvp } from '@/lib/types';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Users, UserPlus, ClipboardList, TrendingUp, Download, FileSpreadsheet,
  Search, RefreshCw, LogOut, Trash2, Pencil, X, Check, ArrowUpDown
} from 'lucide-react';
import * as XLSX from 'xlsx';

type SortKey = 'created_at' | 'invitee_name' | 'guest_count';

export default function Dashboard({ email }: { email: string }) {
  const [rows, setRows] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('created_at');
  const [asc, setAsc] = useState(false);
  const [minParty, setMinParty] = useState(0);
  const [editing, setEditing] = useState<Rsvp | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
    if (!error && data) setRows(data as Rsvp[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const totalRsvps = rows.length;
    const totalGuests = rows.reduce((s, r) => s + r.guest_count, 0);
    const additional = rows.reduce((s, r) => s + (r.additional_guests?.length || 0), 0);
    const avg = totalRsvps ? totalGuests / totalRsvps : 0;
    return { totalRsvps, totalGuests, additional, avg };
  }, [rows]);

  const partyDist = useMemo(() => {
    const m = new Map<number, number>();
    rows.forEach((r) => m.set(r.guest_count, (m.get(r.guest_count) || 0) + 1));
    return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([size, count]) => ({ size: `${size}`, count }));
  }, [rows]);

  const overTime = useMemo(() => {
    const m = new Map<string, number>();
    [...rows].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)).forEach((r) => {
      const d = new Date(r.created_at).toLocaleDateString();
      m.set(d, (m.get(d) || 0) + r.guest_count);
    });
    let run = 0;
    return [...m.entries()].map(([date, g]) => ({ date, guests: (run += g) }));
  }, [rows]);

  const filtered = useMemo(() => {
    let r = rows.filter((x) => x.guest_count >= minParty);
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((x) =>
        x.invitee_name.toLowerCase().includes(s) ||
        (x.phone || '').includes(s) || (x.email || '').toLowerCase().includes(s) ||
        x.additional_guests.some((g) => g.name.toLowerCase().includes(s)));
    }
    r = [...r].sort((a, b) => {
      let d = 0;
      if (sort === 'invitee_name') d = a.invitee_name.localeCompare(b.invitee_name);
      else if (sort === 'guest_count') d = a.guest_count - b.guest_count;
      else d = +new Date(a.created_at) - +new Date(b.created_at);
      return asc ? d : -d;
    });
    return r;
  }, [rows, q, sort, asc, minParty]);

  const exportRows = () => filtered.map((r, i) => ({
    '#': i + 1, Invitee: r.invitee_name,
    'Additional Guests': r.additional_guests.map((g) => g.name).join(', '),
    'Guest Count': r.guest_count, Phone: r.phone || '', Email: r.email || '',
    Note: r.note || '', 'Submitted': new Date(r.created_at).toLocaleString()
  }));

  const exportCSV = () => {
    const data = exportRows();
    const head = Object.keys(data[0] || { '#': '' });
    const csv = [head.join(','), ...data.map((row) =>
      head.map((h) => `"${String((row as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`).join(','))]
      .join('\n') + `\n\n,,TOTAL GUESTS,${stats.totalGuests}`;
    downloadBlob(new Blob([csv], { type: 'text/csv' }), 'Guest-List.csv');
  };
  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(exportRows());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVPs');
    XLSX.writeFile(wb, 'Mazen-Nourhan-Guest-List.xlsx');
  };
  const downloadBlob = (b: Blob, name: string) => {
    const u = URL.createObjectURL(b); const a = document.createElement('a');
    a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u);
  };

  const remove = async (r: Rsvp) => {
    if (!confirm(`Remove ${r.invitee_name}'s RSVP?`)) return;
    await supabase.from('rsvps').delete().eq('id', r.id); load();
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-script text-4xl md:text-5xl text-forest">Guest list</h1>
          <p className="eyebrow mt-1">Mazen &amp; Nourhan · {email}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="btn btn-ghost"><LogOut size={15} /> Sign out</button>
      </header>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Stat icon={<ClipboardList />} label="Total RSVPs" value={stats.totalRsvps} />
        <Stat icon={<Users />} label="Total guests" value={stats.totalGuests} accent />
        <Stat icon={<UserPlus />} label="Additional guests" value={stats.additional} />
        <Stat icon={<TrendingUp />} label="Avg / RSVP" value={stats.avg.toFixed(1)} />
      </div>

      {/* charts */}
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card title="Party size distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={partyDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8c9a8" />
              <XAxis dataKey="size" stroke="#78706A" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#78706A" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#213A2A" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Cumulative guests over time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={overTime}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B0894E" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#B0894E" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8c9a8" />
              <XAxis dataKey="date" stroke="#78706A" fontSize={11} />
              <YAxis allowDecimals={false} stroke="#78706A" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="guests" stroke="#B0894E" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* toolbar */}
      <div className="glass rounded-2xl p-3 md:p-4 mt-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-inksoft" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, guest, phone, email"
            className="bg-transparent outline-none w-full text-ink" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
          className="field !w-auto !py-2 text-sm">
          <option value="created_at">Newest</option>
          <option value="invitee_name">Name</option>
          <option value="guest_count">Party size</option>
        </select>
        <button onClick={() => setAsc((a) => !a)} className="btn btn-ghost !py-2"><ArrowUpDown size={14} /> {asc ? 'Asc' : 'Desc'}</button>
        <select value={minParty} onChange={(e) => setMinParty(+e.target.value)} className="field !w-auto !py-2 text-sm">
          <option value={0}>All sizes</option><option value={2}>2+</option><option value={3}>3+</option><option value={5}>5+</option>
        </select>
        <button onClick={load} className="btn btn-ghost !py-2"><RefreshCw size={14} /> Refresh</button>
        <button onClick={exportCSV} className="btn btn-ghost !py-2"><Download size={14} /> CSV</button>
        <button onClick={exportXLSX} className="btn btn-primary !py-2"><FileSpreadsheet size={14} /> Excel</button>
      </div>

      {/* table */}
      <div className="glass rounded-2xl mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {['#', 'Invitee', 'Additional guests', 'Party', 'Contact', 'Submitted', ''].map((h) => (
                <th key={h} className="eyebrow !text-[0.62rem] px-4 py-3 border-b border-gold/20 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 font-serif italic text-inksoft">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 font-serif italic text-inksoft">No RSVPs yet.</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id} className="border-b border-gold/10 hover:bg-gold/5">
                <td className="px-4 py-3 text-inksoft">{i + 1}</td>
                <td className="px-4 py-3 font-serif font-semibold text-forest text-base">{r.invitee_name}</td>
                <td className="px-4 py-3">
                  {r.additional_guests.length === 0 ? <span className="text-inksoft/50">—</span> :
                    <span className="flex flex-wrap gap-1">
                      {r.additional_guests.map((g, j) => (
                        <span key={j} className="rounded-full bg-forest/8 border border-forest/15 px-2.5 py-0.5 text-forest text-xs">{g.name}</span>
                      ))}
                    </span>}
                </td>
                <td className="px-4 py-3 font-semibold text-gold">{r.guest_count}</td>
                <td className="px-4 py-3 text-inksoft text-xs">
                  {r.phone && <div>{r.phone}</div>}{r.email && <div>{r.email}</div>}
                  {!r.phone && !r.email && '—'}
                </td>
                <td className="px-4 py-3 text-inksoft text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(r)} className="text-forest/70 hover:text-forest"><Pencil size={15} /></button>
                    <button onClick={() => remove(r)} className="text-emerald-900/50 hover:text-emerald-900"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditModal row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-4 md:p-5 ${accent ? 'ring-1 ring-gold/40' : ''}`}>
      <div className="text-gold mb-2">{icon}</div>
      <div className="font-serif text-3xl md:text-4xl font-semibold text-forest">{value}</div>
      <div className="eyebrow !text-[0.62rem] mt-1">{label}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 md:p-5">
      <div className="eyebrow mb-3">{title}</div>
      {children}
    </div>
  );
}

function EditModal({ row, onClose, onSaved }: { row: Rsvp; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(row.invitee_name);
  const [phone, setPhone] = useState(row.phone || '');
  const [email, setEmail] = useState(row.email || '');
  const [guests, setGuests] = useState(row.additional_guests.map((g) => g.name).join('\n'));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const additional_guests = guests.split('\n').map((s) => s.trim()).filter(Boolean).map((n) => ({ name: n }));
    await supabase.from('rsvps').update({
      invitee_name: name.trim(), phone: phone.trim() || null, email: email.trim() || null, additional_guests
    }).eq('id', row.id);
    setBusy(false); onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-matte/60 backdrop-blur p-4" onClick={onClose}>
      <div className="glass rounded-3xl p-7 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-script text-3xl text-forest">Edit RSVP</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <label className="eyebrow block mb-1">Invitee</label>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <input className="field" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <label className="eyebrow block mt-3 mb-1">Additional guests (one per line)</label>
        <textarea className="field min-h-[110px]" value={guests} onChange={(e) => setGuests(e.target.value)} />
        <button onClick={save} disabled={busy} className="btn btn-primary w-full mt-5"><Check size={15} /> Save changes</button>
      </div>
    </div>
  );
}
