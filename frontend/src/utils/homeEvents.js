const vietnamDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
});

export function eventTimestamp(value) {
  if (!value || typeof value !== 'string') return NaN;
  const normalized = value.trim().replace(' ', 'T');
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return Date.parse(`${normalized}T00:00:00+07:00`);
  return Date.parse(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(normalized) ? normalized : `${normalized}+07:00`);
}

// Events without an end time remain visible through their calendar day in Vietnam.
export function selectHomeEvents(events, now = Date.now()) {
  return events.flatMap(event => {
    if (event.status === 'cancelled') return [];
    const start = eventTimestamp(event.event_date);
    if (!Number.isFinite(start)) return [];
    const explicitEnd = eventTimestamp(event.end_date);
    const day = vietnamDate.format(new Date(start));
    const end = Number.isFinite(explicitEnd) ? explicitEnd : Date.parse(`${day}T00:00:00+07:00`) + 86400000;
    if (end <= now || end < start) return [];
    return [{ ...event, start, end, liveStatus: start <= now ? 'ongoing' : 'upcoming' }];
  }).sort((a, b) => {
    if (a.liveStatus !== b.liveStatus) return a.liveStatus === 'ongoing' ? -1 : 1;
    return (a.liveStatus === 'ongoing' ? b.start - a.start : a.start - b.start) || String(a.id).localeCompare(String(b.id));
  }).slice(0, 3);
}
