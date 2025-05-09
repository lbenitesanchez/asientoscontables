import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store';

export const Ledger: React.FC = () => {
  const accounts = useAppStore(s => s.accounts);
  const journal = useAppStore(s => s.journal);
  const [showAll, setShowAll] = useState(false);

  // Agrupa movimientos por cuenta
  const ledgerData = useMemo(() => {
    const map: Record<string, { code: string, name: string, type: string, group: string, entries: { date: string, debit: number, credit: number, desc: string }[] }> = {};
    accounts.forEach(acc => {
      map[acc.code] = { code: acc.code, name: acc.name, type: acc.type, group: acc.group, entries: [] };
    });
    journal.forEach(entry => {
      entry.lines.forEach(line => {
        if (map[line.accountCode]) {
          map[line.accountCode].entries.push({ date: entry.date, debit: line.debit, credit: line.credit, desc: line.description });
        }
      });
    });
    return Object.values(map).filter(acc => acc.entries.length > 0);
  }, [accounts, journal]);

  const visibleData = showAll ? ledgerData : ledgerData.slice(0, 8);

  return (
    <section aria-label="Libro Mayor" className="mb-8">
      <h2 className="text-xl font-bold mb-2">Libro Mayor</h2>
      <div className="space-y-8">
        {visibleData.length === 0 && <div className="text-neutral-400">No hay movimientos registrados.</div>}
        {visibleData.map(acc => {
          const totalDebe = acc.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
          const totalHaber = acc.entries.reduce((sum, e) => sum + (e.credit || 0), 0);
          const saldo = totalDebe - totalHaber;
          return (
            <div key={acc.code} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
              <div className="flex flex-wrap justify-between items-center mb-2">
                <span className="font-semibold font-mono">{acc.code} - {acc.name}</span>
                <span className="text-xs text-neutral-500">{acc.group} | {acc.type}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs mb-2">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Fecha</th>
                      <th className="px-2 py-1">Debe</th>
                      <th className="px-2 py-1">Haber</th>
                      <th className="px-2 py-1">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acc.entries.map((e, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1 whitespace-nowrap">{e.date}</td>
                        <td className="px-2 py-1 text-right">{e.debit ? e.debit.toFixed(2) : ''}</td>
                        <td className="px-2 py-1 text-right">{e.credit ? e.credit.toFixed(2) : ''}</td>
                        <td className="px-2 py-1">{e.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold">
                      <td className="px-2 py-1 text-right">Totales:</td>
                      <td className="px-2 py-1 text-right">{totalDebe.toFixed(2)}</td>
                      <td className="px-2 py-1 text-right">{totalHaber.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="px-2 py-1 text-right">Saldo:</td>
                      <td colSpan={3} className={saldo >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        {saldo >= 0 ? `Deudor: ${saldo.toFixed(2)}` : `Acreedor: ${(-saldo).toFixed(2)}`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      {ledgerData.length > 8 && (
        <div className="flex justify-center mt-4">
          <button className="btn btn-xs btn-outline" onClick={() => setShowAll(s => !s)}>
            {showAll ? 'Mostrar menos' : 'Mostrar más'}
          </button>
        </div>
      )}
    </section>
  );
};
