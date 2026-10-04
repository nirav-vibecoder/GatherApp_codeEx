import { CalendarDays, ChevronDown, Home, UserRound } from 'lucide-react';

export function GatherSidebar() {
  return (
    <aside className="rounded-card bg-white p-6 shadow-card lg:sticky lg:top-[106px] lg:self-start">
      <nav className="space-y-1 text-sm font-semibold text-[#737373]">
        <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f7f7f5]" href="#"><Home className="h-4 w-4" /> HOME</a>
        <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f7f7f5]" href="#"><UserRound className="h-4 w-4" /> MY PROFILE</a>
        <div className="my-4 border-t border-black/8" />
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2.5 text-brand"><span className="flex items-center gap-3"><CalendarDays className="h-4 w-4" /> GATHER</span><span className="h-2 w-2 rounded-full bg-brand" /></div>
        <a className="block rounded-xl px-3 py-2.5 hover:bg-[#f7f7f5]" href="#">EVENTS</a>
        <div className="my-4 border-t border-black/8" />
        {['CLUBS', 'COMMITTEES', 'SPORTS'].map(item => <div key={item} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[#f7f7f5]"><span>{item}</span><ChevronDown className="h-4 w-4" /></div>)}
      </nav>
    </aside>
  );
}
