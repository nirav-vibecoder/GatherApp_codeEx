import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminGatherPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/gather/login');
  const allowed = process.env.ADMIN_EMAIL;
  if (!allowed || user.email?.toLowerCase() !== allowed.toLowerCase()) return <div className="min-h-screen bg-paper p-10"><div className="mx-auto max-w-xl rounded-card bg-white p-8 shadow-card"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Gather Admin</p><h1 className="mt-3 text-3xl font-extrabold">Access not configured</h1><p className="mt-3 text-sm leading-6 text-[#666]">Your account is authenticated, but it is not on the configured admin allowlist.</p></div></div>;
  return <main className="min-h-screen bg-paper px-5 py-8 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-[980px]">
      <div className="mb-8 flex items-center justify-between"><div><div className="text-[12px] font-bold uppercase tracking-[.22em] text-brand">Etrigan 3.0</div><h1 className="mt-2 text-4xl font-extrabold tracking-tight">GATHER ADMIN</h1><p className="mt-2 text-[#777]">Upload and publish the campus event schedule.</p></div><form action="/api/admin/gather/logout" method="post"><button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-card hover:bg-[#fafaf8]"><LogOut className="h-4 w-4" /> Sign out</button></form></div>
      <section className="rounded-card bg-white p-6 shadow-card sm:p-8"><div className="mb-6"><h2 className="text-xl font-extrabold">Event Schedule</h2><p className="mt-1 text-sm text-[#888]">Validate the workbook first. Invalid rows are never written to Supabase.</p></div><ExcelUploader /></section>
      <section className="mt-6 rounded-card bg-white p-6 shadow-card"><h2 className="text-lg font-extrabold">Expected columns</h2><p className="mt-2 text-sm leading-6 text-[#777]">Event Name · CCA · Date · Time · Location · Registration Link</p><p className="mt-2 text-xs text-[#999]">Optional columns also accepted: End Time · Description · Speaker</p></section>
    </div>
  </main>;
}
