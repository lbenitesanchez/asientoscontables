import React from 'react';
// TODO: Implementar tutorial interactivo y tooltips contextuales
export const HelpTour: React.FC = () => {
  return (
    <section aria-label="Ayuda contextual" className="mb-12">
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4 text-cyan-700 dark:text-cyan-200">
        <svg className="w-7 h-7 text-cyan-400 dark:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" /></svg>
        Ayuda contextual
      </h2>
      <div className="bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-cyan-900/70 dark:via-neutral-900 dark:to-cyan-800/30 rounded-2xl shadow-xl p-8 space-y-4 animate-fade-in">
        <p className="text-lg text-neutral-700 dark:text-neutral-200 font-medium">
          Bienvenido al simulador de asientos contables. Aquí tienes una guía rápida:
        </p>
        <ul className="pl-7 space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-1 w-3 h-3 rounded-full bg-cyan-400 dark:bg-cyan-600 shadow"></span>
            <span className="text-base text-neutral-700 dark:text-neutral-200"><b>Dashboard:</b> Visualiza KPIs (Indicador Clave de Desempeño), carga escenarios y consulta el libro diario.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-3 h-3 rounded-full bg-cyan-400 dark:bg-cyan-600 shadow"></span>
            <span className="text-base text-neutral-700 dark:text-neutral-200"><b>Catálogo de cuentas:</b> Administra tus cuentas contables, agrégalas, edítalas o elimínalas según tus necesidades.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-3 h-3 rounded-full bg-cyan-400 dark:bg-cyan-600 shadow"></span>
            <span className="text-base text-neutral-700 dark:text-neutral-200"><b>Simulador de asientos:</b> Registra transacciones contables, asegurando que el debe y el haber estén balanceados.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-3 h-3 rounded-full bg-cyan-400 dark:bg-cyan-600 shadow"></span>
            <span className="text-base text-neutral-700 dark:text-neutral-200"><b>Libro Diario:</b> Consulta todos los asientos registrados, con filtro por fecha, cuenta o descripción.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-3 h-3 rounded-full bg-cyan-400 dark:bg-cyan-600 shadow"></span>
            <span className="text-base text-neutral-700 dark:text-neutral-200"><b>Libro Mayor:</b> Visualiza los movimientos y saldos de cada cuenta en formato T.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-3 h-3 rounded-full bg-cyan-400 dark:bg-cyan-600 shadow"></span>
            <span className="text-base text-neutral-700 dark:text-neutral-200"><b>Balance de comprobación:</b> Verifica que tus cuentas estén cuadradas y exporta a CSV.</span>
          </li>
        </ul>
        <p className="text-base text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/40 rounded-xl px-5 py-3 shadow-inner">
          <b>Tips:</b> Usa los escenarios pre-cargados para practicar, y filtra o exporta la información según lo necesites. Si tienes dudas sobre algún módulo, consulta esta ayuda o explora los tooltips y mensajes del sistema.
        </p>
      </div>
    </section>
  );
};
