// Single source of truth for the celebration details.
export const EVENT = {
  groom: 'Mazen',
  bride: 'Nourhan',
  // Egypt observes EEST (UTC+3) in August.
  dateISO: '2026-08-05T19:00:00+03:00',
  dateLabel: 'Wednesday, 5 August 2026',
  timeLabel: '7:00 PM',
  venueName: 'The Étoile Grand',
  venueArea: 'King Mariout, Alexandria',
  mapsQuery: 'The Etoile Grand King Mariout Alexandria Egypt',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.MazenAndNourhan.com'
};

export const mapsEmbedSrc = (q = EVENT.mapsQuery) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`;
export const mapsLinkSrc = (q = EVENT.mapsQuery) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const mapsDirectionsSrc = (q = EVENT.mapsQuery) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
