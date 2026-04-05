/** Format API dates for dashboard copy */
export function formatAppointmentDate(iso: string | Date | undefined): string {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

export function formatAppointmentTime(iso: string | Date | undefined): string {
  if (!iso) return '';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

export function initials(first?: string, last?: string): string {
  const a = (first?.[0] ?? '').toUpperCase();
  const b = (last?.[0] ?? '').toUpperCase();
  return (a + b) || '?';
}

export function bookingStatusLabel(status: string): string {
  const s = status?.toLowerCase() ?? '';
  if (s === 'waiting-list') return 'Waiting list';
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';
}
