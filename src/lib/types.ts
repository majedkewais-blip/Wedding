export interface AdditionalGuest { name: string }

export interface Rsvp {
  id: string;
  invitee_name: string;
  phone: string | null;
  email: string | null;
  additional_guests: AdditionalGuest[];
  guest_count: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface RsvpInput {
  invitee_name: string;
  phone?: string;
  email?: string;
  additional_guests: AdditionalGuest[];
  note?: string;
}
