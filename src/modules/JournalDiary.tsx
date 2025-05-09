import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store';

export const JournalDiary: React.FC = () => {
  const journal = useAppStore(s => s.journal);
  const accounts = useAppStore(s => s.accounts);
  const [filter, setFilter] = useState('');

  // Prepara los asientos filtrados
  const entries = useMemo(() => {
    return journal
      .filter(entry => {
        if (!filter) return true;
        return (
          entry.date.includes(filter) ||
          entry.lines.some(line => {
            const acc = accounts.find(a => a.code === line.accountCode);
            return (
              line.accountCode.includes(filter) ||
              (acc && acc.name.toLowerCase().includes(filter.toLowerCase())) ||
              (line.description && line.description.toLowerCase().includes(filter.toLowerCase()))
            );
          })
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [journal, accounts, filter]);

  return (
    <section aria-label="Libro Diario" className="mb-12">
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-200">
        <svg className="w-7 h-7 text-blue-400 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" /></svg>
        Libro Diario
      </h2>
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔎 Filtrar por fecha, cuenta o descripción..."
          className="w-72 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900/70 dark:via-neutral-900 dark:to-blue-800/30 animate-fade-in">
        <table className="min-w-full text-base">
          <thead className="sticky top-0 z-10 bg-blue-100/80 dark:bg-blue-900/60 backdrop-blur border-b border-blue-200 dark:border-blue-700">
            <tr>
              <th className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-200">Fecha</th>
              <th className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-200">N°</th>
              <th className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-200">Cuenta</th>
              <th className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-200">Descripción</th>
              <th className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-200 text-right">Debe</th>
              <th className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-200 text-right">Haber</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr><td colSpan={6} className="text-center text-neutral-400 py-8 text-lg">Sin asientos registrados</td></tr>
            )}
            {entries.map((entry, idx) => (
              entry.lines.map((line, jdx) => {
                const acc = accounts.find(a => a.code === line.accountCode);
                return (
                  <tr
                    key={entry.id + '-' + jdx}
                    className={
                      'transition-all duration-150 ' +
                      (jdx === 0 ? 'border-t border-blue-200 dark:border-blue-700' : '') +
                      ' group hover:bg-blue-50/60 dark:hover:bg-blue-900/40'
                    }
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-semibold text-blue-900 dark:text-blue-100">{jdx === 0 ? entry.date : ''}</td>
                    <td className="px-3 py-2 text-center text-blue-800 dark:text-blue-200">{jdx === 0 ? idx + 1 : ''}</td>
                    <td className="px-3 py-2 font-mono text-blue-700 dark:text-blue-200">{line.accountCode} {acc ? `- ${acc.name}` : ''}</td>
                    <td className="px-3 py-2 text-neutral-700 dark:text-neutral-200">{line.description || ''}</td>
                    <td className="px-3 py-2 text-right text-green-700 dark:text-green-200 font-bold">{line.debit ? line.debit.toFixed(2) : ''}</td>
                    <td className="px-3 py-2 text-right text-red-700 dark:text-red-200 font-bold">{line.credit ? line.credit.toFixed(2) : ''}</td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
