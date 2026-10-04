'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, FileSpreadsheet, Loader2, UploadCloud, XCircle } from 'lucide-react';

type Preview = { total: number; valid: number; issues: { row:number; message:string }[]; fileName: string; };

export function ExcelUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type:'success'|'error'; text:string } | null>(null);

  async function validate(selected: File) {
    setFile(selected); setMessage(null); setLoading(true); setPreview(null);
    const form = new FormData(); form.append('file', selected);
    try {
      const res = await fetch('/api/admin/gather/import', { method:'POST', body: form, headers:{'x-preview':'true'} });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not validate this workbook.');
      setPreview({ total:data.total, valid:data.validCount, issues:data.issues, fileName:selected.name });
    } catch (error) { setMessage({type:'error', text:error instanceof Error ? error.message : 'Could not validate this workbook.'}); }
    finally { setLoading(false); }
  }

  async function importEvents() {
    if (!file) return;
    setImporting(true); setMessage(null);
    const form = new FormData(); form.append('file', file);
    try {
      const res = await fetch('/api/admin/gather/import', { method:'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed.');
      setMessage({type:'success', text:`${data.imported} events imported successfully${data.skipped ? ` · ${data.skipped} row skipped` : ''}.`});
      setPreview(null); setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) { setMessage({type:'error', text:error instanceof Error ? error.message : 'Import failed.'}); }
    finally { setImporting(false); }
  }

  return <div>
    <div onClick={() => inputRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) validate(f);}} className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-black/15 bg-[#fafaf8] px-6 text-center transition-colors hover:border-brand/50 hover:bg-red-50/30">
      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) validate(f);}} />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card"><UploadCloud className="h-6 w-6 text-brand" /></div>
      <p className="mt-5 text-base font-extrabold">Drop Excel file here</p><p className="mt-1 text-sm text-[#888]">or click to choose a .xlsx, .xls or .csv file</p>
    </div>
    {loading && <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow-card"><Loader2 className="h-4 w-4 animate-spin text-brand" /> Validating workbook…</div>}
    {preview && !loading && <div className="mt-5 rounded-card bg-white p-5 shadow-card">
      <div className="flex items-center gap-3"><FileSpreadsheet className="h-5 w-5 text-brand" /><div className="font-bold">{preview.fileName}</div></div>
      <div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-xl bg-[#f7f7f5] p-4"><div className="text-2xl font-extrabold">{preview.total}</div><div className="text-xs text-[#888]">rows detected</div></div><div className="rounded-xl bg-[#f7f7f5] p-4"><div className="text-2xl font-extrabold">{preview.valid}</div><div className="text-xs text-[#888]">valid</div></div><div className="rounded-xl bg-[#fff2f2] p-4"><div className="text-2xl font-extrabold text-brand">{preview.issues.length}</div><div className="text-xs text-[#888]">errors</div></div></div>
      {preview.issues.length > 0 && <div className="mt-5 space-y-2">{preview.issues.map((issue,i)=><div key={`${issue.row}-${i}`} className="flex gap-3 rounded-xl bg-[#fff7f7] px-4 py-3 text-sm"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span><strong>Row {issue.row}</strong> · {issue.message}</span></div>)}</div>}
      <button disabled={preview.valid === 0 || importing} onClick={importEvents} className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40">{importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} IMPORT EVENTS</button>
      {preview.issues.length > 0 && <p className="mt-2 text-center text-xs text-[#888]">Valid rows will be imported; invalid rows will be skipped.</p>}
    </div>}
    {message && <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-brand'}`}>{message.text}</div>}
  </div>;
}
