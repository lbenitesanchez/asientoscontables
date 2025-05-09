import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store';

function toCSV(rows: string[][]): string {
  return rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

export const TrialBalance: React.FC = () => {
  const accounts = useAppStore(s => s.accounts);
  const journal = useAppStore(s => s.journal);
  const [filter, setFilter] = useState('');

  // Calcula saldos por cuenta
  const data = useMemo(() => {
    return accounts.map(acc => {
      const movimientos = journal.flatMap(j =>
        j.lines.filter(l => l.accountCode === acc.code)
      );
      const debe = movimientos.reduce((sum, l) => sum + (l.debit || 0), 0);
      const haber = movimientos.reduce((sum, l) => sum + (l.credit || 0), 0);
      const saldo = debe - haber;
      return { ...acc, debe, haber, saldo };
    }).filter(acc => acc.debe !== 0 || acc.haber !== 0);
  }, [accounts, journal]);

  const filtered = data.filter(acc =>
    acc.code.includes(filter) || acc.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalDebe = filtered.reduce((sum, acc) => sum + acc.debe, 0);
  const totalHaber = filtered.reduce((sum, acc) => sum + acc.haber, 0);
  const totalSaldo = filtered.reduce((sum, acc) => sum + acc.saldo, 0);

  const handleExport = () => {
    const rows = [
      ['Código', 'Nombre', 'Naturaleza', 'Grupo', 'Debe', 'Haber', 'Saldo'],
      ...filtered.map(acc => [acc.code, acc.name, acc.type, acc.group, acc.debe.toFixed(2), acc.haber.toFixed(2), acc.saldo.toFixed(2)])
    ];
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'balance_comprobacion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-label="Balance de Comprobación" className="mb-12">
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4 text-fuchsia-700 dark:text-fuchsia-200">
        <svg className="w-7 h-7 text-fuchsia-400 dark:text-fuchsia-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18" /></svg>
        Balance de Comprobación
      </h2>
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔎 Buscar código o nombre..."
          className="w-64 px-4 py-2 rounded-xl border border-fuchsia-200 dark:border-fuchsia-700 bg-white dark:bg-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-base transition-all"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 text-white font-semibold shadow-md hover:from-fuchsia-600 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 transition-all duration-150" onClick={handleExport}>Exportar CSV</button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-gradient-to-br from-fuchsia-50 via-white to-fuchsia-100 dark:from-fuchsia-900/70 dark:via-neutral-900 dark:to-fuchsia-800/30 animate-fade-in mb-6">
        <table className="min-w-full text-base">
          <thead className="sticky top-0 z-10 bg-fuchsia-100/80 dark:bg-fuchsia-900/60 backdrop-blur border-b border-fuchsia-200 dark:border-fuchsia-700">
            <tr>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200">Código</th>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200">Nombre</th>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200">Naturaleza</th>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200">Grupo</th>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200 text-right">Debe</th>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200 text-right">Haber</th>
              <th className="px-3 py-2 font-semibold text-fuchsia-700 dark:text-fuchsia-200 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(acc => (
              <tr key={acc.code} className="transition-all duration-150 group hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-900/40">
                <td className="px-3 py-2 font-mono text-fuchsia-800 dark:text-fuchsia-200 font-semibold">{acc.code}</td>
                <td className="px-3 py-2 text-neutral-700 dark:text-neutral-100">{acc.name}</td>
                <td className="px-3 py-2 capitalize text-fuchsia-700 dark:text-fuchsia-200">{acc.type}</td>
                <td className="px-3 py-2 text-fuchsia-600 dark:text-fuchsia-300">{acc.group}</td>
                <td className="px-3 py-2 text-right">{acc.debe.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{acc.haber.toFixed(2)}</td>
                <td className={[ 
                  acc.saldo === 0 ? 'text-neutral-500'
                  : acc.saldo > 0 ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400',
                  'px-3', 'py-2', 'text-right', 'font-semibold'
                ].join(' ')}>
                  {acc.saldo.toFixed(2)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-neutral-400 py-8 text-lg">Sin resultados</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-fuchsia-100/80 dark:bg-fuchsia-900/40">
              <td colSpan={4} className="px-3 py-2 text-right text-fuchsia-700 dark:text-fuchsia-200">Totales:</td>
              <td className="px-3 py-2 text-right text-fuchsia-700 dark:text-fuchsia-200">{totalDebe.toFixed(2)}</td>
              <td className="px-3 py-2 text-right text-fuchsia-700 dark:text-fuchsia-200">{totalHaber.toFixed(2)}</td>
              <td className={[ 
                totalSaldo === 0 ? 'text-neutral-500'
                : totalSaldo > 0 ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400',
                'px-3', 'py-2', 'text-right'
              ].join(' ')}>
                {totalSaldo.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
