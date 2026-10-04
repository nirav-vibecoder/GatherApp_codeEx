import { GatherHeader } from '@/components/gather/GatherHeader';
import { GatherSidebar } from '@/components/gather/GatherSidebar';
import { GatherPageClient } from '@/components/gather/GatherPageClient';
import { getEventsForWindow } from '@/lib/events';

export const dynamic = 'force-dynamic';

export default async function GatherPage() {
  const events = await getEventsForWindow(new Date());
  const today = new Date();
  const startDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  return <div className="min-h-screen bg-paper">
    <GatherHeader />
    <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-7 md:px-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-10 lg:py-9">
      <GatherSidebar />
      <div className="min-w-0">
        <div className="mb-7 px-1">
          <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-brand">Campus calendar</div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">GATHER</h1>
          <p className="mt-2 text-lg font-medium text-[#3f3f3f]">Everything happening on campus.</p>
          <p className="mt-1 text-sm text-[#888]">That WhatsApp message is probably gone by now.</p>
        </div>
        <GatherPageClient events={events} />
      </div>
    </main>
  </div>;
}
