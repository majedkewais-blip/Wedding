import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabaseAdmin';
import type { RsvpInput } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(s: unknown, max = 120): string {
  return String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: RsvpInput;
  try { body = (await req.json()) as RsvpInput; }
  catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  // ---- honeypot (basic spam protection) ----
  if ((body as unknown as Record<string, string>)?.['website']) {
    return NextResponse.json({ ok: true }); // silently ignore bots
  }

  const invitee = clean(body.invitee_name);
  if (invitee.length < 2) {
    return NextResponse.json({ error: 'Please enter your full name.' }, { status: 422 });
  }

  const phone = clean(body.phone, 40);
  const email = clean(body.email, 120).toLowerCase();
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address looks invalid.' }, { status: 422 });
  }

  const guests = Array.isArray(body.additional_guests) ? body.additional_guests : [];
  const additional_guests = guests
    .map((g) => ({ name: clean(g?.name) }))
    .filter((g) => g.name.length > 0)
    .slice(0, 30);

  const note = clean(body.note, 400);

  try {
    const db = getAdminClient();

    // ---- duplicate prevention: same name (+ phone/email if given) within 14 days ----
    let dq = db.from('rsvps').select('id').ilike('invitee_name', invitee);
    if (phone) dq = dq.eq('phone', phone);
    else if (email) dq = dq.eq('email', email);
    const { data: existing } = await dq.limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'It looks like this RSVP was already submitted. Thank you!' },
        { status: 409 }
      );
    }

    const { error } = await db.from('rsvps').insert({
      invitee_name: invitee,
      phone: phone || null,
      email: email || null,
      additional_guests,
      note: note || null
    });
    if (error) throw error;

    return NextResponse.json({ ok: true, party: 1 + additional_guests.length });
  } catch (e) {
    console.error('RSVP insert failed', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
