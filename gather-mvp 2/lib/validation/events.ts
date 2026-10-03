import type { EventInput, ValidationIssue } from '@/types/events';

export function normalizeDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }

  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    const parsed = new Date(year, month - 1, day);
    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
}

export function normalizeTime(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const total = Math.round(value * 24 * 60);
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?(?:\s*([AP]M))?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? '00');
  const meridiem = match[3]?.toUpperCase();
  if (minute > 59 || hour > 23 || (meridiem ? hour < 1 || hour > 12 : hour > 23)) return null;
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function validUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

export function validateRows(rows: Record<string, unknown>[]): { valid: EventInput[]; issues: ValidationIssue[] } {
  const valid: EventInput[] = [];
  const issues: ValidationIssue[] = [];
  rows.forEach((row, index) => {
    const excelRow = index + 2;
    const eventName = String(row['Event Name'] ?? '').trim();
    const cca = String(row['CCA'] ?? '').trim();
    const location = String(row['Location'] ?? '').trim();
    const eventDate = normalizeDate(row['Date']);
    const startTime = normalizeTime(row['Time']);
    const registration = String(row['Registration Link'] ?? '').trim();
    const endTimeRaw = String(row['End Time'] ?? '').trim();
    const endTime = endTimeRaw ? normalizeTime(row['End Time']) : null;
    const rowIssues: string[] = [];
    if (!eventName) rowIssues.push('Missing event name');
    if (!cca) rowIssues.push('Missing CCA');
    if (!eventDate) rowIssues.push('Invalid date');
    if (!startTime) rowIssues.push('Invalid time');
    if (!location) rowIssues.push('Missing location');
    if (registration && !validUrl(registration)) rowIssues.push('Invalid registration URL');
    if (endTimeRaw && !endTime) rowIssues.push('Invalid end time');
    if (rowIssues.length) {
      rowIssues.forEach(message => issues.push({ row: excelRow, message }));
      return;
    }
    valid.push({
      event_name: eventName,
      cca,
      event_date: eventDate!,
      start_time: startTime!,
      end_time: endTime,
      location,
      registration_link: registration || null,
      description: String(row['Description'] ?? '').trim() || null,
      speaker: String(row['Speaker'] ?? '').trim() || null,
    });
  });
  return { valid, issues };
}
