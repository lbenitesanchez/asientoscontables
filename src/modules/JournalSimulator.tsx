import React, { useState } from 'react';
import { useAppStore, Account, JournalEntryLine } from '../store';

function getEmptyLine(): JournalEntryLine {
  return {
    accountCode: '',
    debit: 0,
    credit: 0,
    description: '',
  };
}

export const JournalSimulator: React.FC = () => {
  const accounts = useAppStore((s) => s.accounts);
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<JournalEntryLine[]>([getEmptyLine(), getEmptyLine()]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleLineChange = (idx: number, field: keyof JournalEntryLine, value: string | number) => {
    setLines((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const handleAddLine = () => setLines((prev) => [...prev, getEmptyLine()]);
  const handleRemoveLine = (idx: number) => setLines((prev) => prev.length > 2 ? prev.filter((_, i) => i !== idx) : prev);

  const totalDebe = lines.reduce((sum, l) => sum + Number(l.debit || 0), 0);
  const totalHaber = lines.reduce((sum, l) => sum + Number(l.credit || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (totalDebe !== totalHaber) {
      setError('El asiento no está balanceado.');
      return;
    }
    if (lines.some((l) => !l.accountCode || (!l.debit && !l.credit))) {
      setError('Todas las líneas deben tener cuenta y monto.');
      return;
    }
    addJournalEntry({
      id: crypto.randomUUID(),
      date,
      lines: lines.map((l) => ({ ...l })),
    });
    setSuccess('¡Asiento registrado correctamente!');
    setLines([getEmptyLine(), getEmptyLine()]);
  };

  return (
    <section aria-label="Simulador de Asientos" className="mb-12">
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-200">
        <svg className="w-7 h-7 text-indigo-400 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18" /></svg>
        Simulador de Asientos
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 dark:from-indigo-900/60 dark:to-indigo-700/60 rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="font-semibold text-indigo-700 dark:text-indigo-200">Fecha:</label>
          <input type="date" className="w-44 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-neutral-800 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-400" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-indigo-900/70 dark:via-neutral-900 dark:to-indigo-800/30 animate-fade-in mb-6">
          <table className="min-w-full text-base">
            <thead className="sticky top-0 z-10 bg-indigo-100/80 dark:bg-indigo-900/60 backdrop-blur border-b border-indigo-200 dark:border-indigo-700">
              <tr>
                <th className="px-3 py-2 font-semibold text-indigo-700 dark:text-indigo-200">Cuenta</th>
                <th className="px-3 py-2 font-semibold text-indigo-700 dark:text-indigo-200">Debe</th>
                <th className="px-3 py-2 font-semibold text-indigo-700 dark:text-indigo-200">Haber</th>
                <th className="px-3 py-2 font-semibold text-indigo-700 dark:text-indigo-200">Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="transition-all duration-150 group hover:bg-indigo-50/60 dark:hover:bg-indigo-900/40">
                  <td className="px-3 py-2">
                    <input
                      list="accounts-list"
                      className="w-40 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-neutral-800 shadow-sm font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={line.accountCode}
                      onChange={e => handleLineChange(idx, 'accountCode', e.target.value)}
                      required
                      placeholder="Código"
                      autoComplete="off"
                    />
                    <datalist id="accounts-list">
                      {accounts.map(acc => (
                        <option key={acc.code} value={acc.code}>{acc.code} - {acc.name}</option>
                      ))}
                    </datalist>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="w-28 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-neutral-800 shadow-sm text-base text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={line.debit || ''}
                      onChange={e => handleLineChange(idx, 'debit', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="w-28 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-neutral-800 shadow-sm text-base text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={line.credit || ''}
                      onChange={e => handleLineChange(idx, 'credit', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-48 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-neutral-800 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={line.description}
                      onChange={e => handleLineChange(idx, 'description', e.target.value)}
                    />
                  </td>
                  <td>
                    <button type="button" className="px-2 py-1 rounded-lg bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 shadow transition-all" onClick={() => handleRemoveLine(idx)} title="Eliminar línea" aria-label="Eliminar línea">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-indigo-100/80 dark:bg-indigo-900/40">
                <td className="px-3 py-2 text-right text-indigo-700 dark:text-indigo-200">Totales:</td>
                <td className="px-3 py-2 text-right text-indigo-700 dark:text-indigo-200">{totalDebe.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-indigo-700 dark:text-indigo-200">{totalHaber.toFixed(2)}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="button" className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 text-indigo-700 dark:text-indigo-200 shadow-md hover:from-indigo-200 hover:to-indigo-300 dark:hover:from-indigo-700 dark:hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-150" onClick={handleAddLine}>+ Añadir línea</button>
          <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-150">Registrar asiento</button>
        </div>
        {error && <div className="text-red-600 font-medium mt-4 animate-fade-in">{error}</div>}
        {success && <div className="text-green-600 font-medium mt-4 animate-fade-in">{success}</div>}
      </form>
    </section>
  );
};
