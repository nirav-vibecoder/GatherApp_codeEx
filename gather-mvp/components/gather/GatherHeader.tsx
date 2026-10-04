import { Search, UserRound } from 'lucide-react';

export function GatherHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center gap-8 px-5 md:px-8 lg:px-10">
        <div className="w-[230px] shrink-0">
          <div className="text-[28px] font-extrabold tracking-[-0.05em]">Etrigan <span className="text-brand">3.0</span></div>
          <div className="-mt-1 ml-[66px] text-[11px] font-semibold tracking-wide">campus directory</div>
        </div>
        <div className="mx-auto hidden max-w-[600px] flex-1 md:block">
          <div className="flex h-12 items-center rounded-full bg-[#f0f0ef] px-5 text-sm text-[#888]">
            <span>Search campus directory</span><Search className="ml-auto h-5 w-5" />
          </div>
        </div>
        <div className="ml-auto flex min-w-[205px] items-center gap-3">
          <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#d8d8d6] sm:flex"><UserRound className="h-6 w-6 text-white" /></div>
          <div><div className="text-sm font-bold">Nirav Meghani</div><div className="text-xs text-[#666]">PGP42147</div></div>
        </div>
      </div>
    </header>
  );
}
