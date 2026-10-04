import * as XLSX from 'xlsx';
import { validateRows } from '@/lib/validation/events';

export async function parseEventWorkbook(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstSheet) throw new Error('The Excel file has no worksheets.');
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });
  if (!rows.length) throw new Error('The selected worksheet is empty.');
  const required = ['Event Name', 'CCA', 'Date', 'Time', 'Location'];
  const headers = Object.keys(rows[0]);
  const missing = required.filter(h => !headers.includes(h));
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(', ')}`);
  return { total: rows.length, ...validateRows(rows) };
}
