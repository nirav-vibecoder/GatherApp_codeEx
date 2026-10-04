import { NextResponse } from 'next/server';
import { parseEventWorkbook } from '@/lib/excel/parse';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const allowed = process.env.ADMIN_EMAIL;
  if (!user || !allowed || user.email?.toLowerCase() !== allowed.toLowerCase()) return null;
  return user;
}

export async function POST(request: Request) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Please select an Excel file.' }, { status: 400 });
    const parsed = await parseEventWorkbook(file);
    const preview = request.headers.get('x-preview') === 'true';
    if (preview) return NextResponse.json({ total: parsed.total, validCount: parsed.valid.length, issues: parsed.issues });
    const supabase = createSupabaseAdminClient();
    const payload = parsed.valid.map(row => ({ ...row, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('events').upsert(payload, { onConflict: 'event_name,event_date,start_time' });
    if (error) throw error;
    return NextResponse.json({ imported: payload.length, skipped: parsed.issues.length });
  } catch (error) {
    console.error('Gather import failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import failed.' }, { status: 500 });
  }
}
