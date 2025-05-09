import React, { useState } from 'react';
import { JournalDiary } from './JournalDiary';
import { EscenariosPreCargados } from './EscenariosPreCargados';
import { useAppStore } from '../store';
// TODO: Importar animaciones de Framer Motion y KPIs desde store
export const Dashboard: React.FC = () => {
  const journal = useAppStore(s => s.journal);
  const accounts = useAppStore(s => s.accounts);

  // KPIs
  const transacciones = journal.length;
  const balance = accounts.reduce((sum, acc) => {
    const movimientos = journal.flatMap(j =>
      j.lines.filter(l => l.accountCode === acc.code)
    );
    const debe = movimientos.reduce((s, l) => s + (l.debit || 0), 0);
    const haber = movimientos.reduce((s, l) => s + (l.credit || 0), 0);
    return sum + (debe - haber);
  }, 0);
  const errores = journal.filter(j => {
    const totalDebe = j.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalHaber = j.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    return totalDebe !== totalHaber;
  }).length;

  return (
    <section aria-label="Dashboard" className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI: Transacciones */}
        <div className="group relative bg-gradient-to-tr from-blue-100/80 via-white to-blue-200/80 dark:from-blue-900/60 dark:to-blue-700/60 rounded-2xl shadow-xl p-7 flex flex-col items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-2">
            <svg className="w-7 h-7 text-blue-500 dark:text-blue-300 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M9 14h6m-6 4h6" /></svg>
            <span className="block text-base font-medium text-neutral-600 dark:text-neutral-300">Transacciones</span>
          </div>
          <span className="text-4xl font-bold text-blue-700 dark:text-blue-200 drop-shadow-sm">{transacciones}</span>
        </div>
        {/* KPI: Balance */}
        <div className="group relative bg-gradient-to-tr from-green-100/80 via-white to-green-200/80 dark:from-green-900/60 dark:to-green-700/60 rounded-2xl shadow-xl p-7 flex flex-col items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-2">
            <svg className="w-7 h-7 text-green-500 dark:text-green-300 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3.314 0-6 1.343-6 3v2c0 1.657 2.686 3 6 3s6-1.343 6-3v-2c0-1.657-2.686-3-6-3z" /></svg>
            <span className="block text-base font-medium text-neutral-600 dark:text-neutral-300">Balance</span>
          </div>
          <span className="text-4xl font-bold text-green-700 dark:text-green-200 drop-shadow-sm">{balance.toFixed(2)}</span>
        </div>
        {/* KPI: Errores */}
        <div className="group relative bg-gradient-to-tr from-red-100/80 via-white to-red-200/80 dark:from-red-900/60 dark:to-red-700/60 rounded-2xl shadow-xl p-7 flex flex-col items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-2">
            <svg className="w-7 h-7 text-red-500 dark:text-red-300 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            <span className="block text-base font-medium text-neutral-600 dark:text-neutral-300">Errores</span>
          </div>
          <span className={"text-4xl font-bold drop-shadow-sm " + (errores > 0 ? "text-red-700 dark:text-red-200" : "text-neutral-400 dark:text-neutral-500")}>{errores}</span>
        </div>
      </div>
      {/* TODO: Toggle dark/light, progreso usuario */}

      <div className="mt-10 mb-8">
        <h2 className="text-lg font-semibold mb-2">Escenarios pre-cargados</h2>
        <EscenariosPreCargados />
      </div>
      <div className="mt-10">
        <JournalDiary />
      </div>

    </section>
  );
};
