import React, { useState } from 'react';
import { useAppStore } from '../store';

const escenarios = [
  // Existentes arriba...
  {
    nombre: 'Pago de planilla',
    descripcion: 'Pago de planilla mensual: sueldos brutos S/ 8,000, ESSALUD 9%, ONP 13%, retención de quinta categoría 8%, provisión de gratificación y vacaciones, y pago neto al personal.',
    asientos: [
      {
        date: new Date().toISOString().slice(0, 10),
        lines: [
          { accountCode: '6211', debit: 8000, credit: 0, description: 'Gasto en sueldos y salarios brutos' },
          { accountCode: '6261', debit: 720, credit: 0, description: 'Gasto en ESSALUD (9%)' },
          { accountCode: '6271', debit: 666.67, credit: 0, description: 'Provisión de gratificaciones (1/6 de sueldo)' },
          { accountCode: '6272', debit: 666.67, credit: 0, description: 'Provisión de vacaciones (1/6 de sueldo)' },

          { accountCode: '4011', debit: 0, credit: 1040, description: 'ONP por pagar (13%)' },
          { accountCode: '4012', debit: 0, credit: 640, description: 'Retención quinta categoría por pagar (8%)' },
          { accountCode: '4013', debit: 0, credit: 720, description: 'ESSALUD por pagar (9%)' },
          { accountCode: '4014', debit: 0, credit: 666.67, description: 'Gratificaciones por pagar' },
          { accountCode: '4015', debit: 0, credit: 666.67, description: 'Vacaciones por pagar' },

          { accountCode: '1011', debit: 0, credit: 5866.66, description: 'Pago neto en efectivo al personal' },
        ],
      },
    ],
    color: 'rose',
  },
  {
    nombre: 'Depreciación mensual de activo fijo',
    descripcion: 'Registro de la depreciación mensual de un equipo de computo por S/ 200.',
    asientos: [
      {
        date: new Date().toISOString().slice(0, 10),
        lines: [
          { accountCode: '6851', debit: 200, credit: 0, description: 'Gasto por depreciación del periodo' },
          { accountCode: '1591', debit: 0, credit: 200, description: 'Depreciación acumulada de activo fijo' },
        ],
      },
    ],
    color: 'gray',
  },
  {
    nombre: 'Préstamo bancario recibido',
    descripcion: 'Recepción de un préstamo bancario por S/ 10,000 depositado en cuenta corriente.',
    asientos: [
      {
        date: new Date().toISOString().slice(0, 10),
        lines: [
          { accountCode: '1041', debit: 10000, credit: 0, description: 'Banco - cuenta corriente' },
          { accountCode: '2111', debit: 0, credit: 10000, description: 'Préstamo bancario por pagar' },
        ],
      },
    ],
    color: 'indigo',
  },
  {
    nombre: 'Compra de mercadería al contado',
    descripcion: 'Compra de mercadería por S/ 1,000 pagada al contado en efectivo. Se reconoce el ingreso al inventario y la salida de caja.',
    asientos: [
      {
        date: new Date().toISOString().slice(0, 10),
        lines: [
          { accountCode: '6011', debit: 1000, credit: 0, description: 'Compra de mercadería (Inventario)' },
          { accountCode: '1011', debit: 0, credit: 1000, description: 'Pago en efectivo (Caja)' },
        ],
      },
    ],
    color: 'blue',
  },
  {
    nombre: 'Venta de mercadería a crédito',
    descripcion: 'Venta de mercadería por S/ 1,500 a crédito (el cliente pagará después). Costo de la mercadería vendida: S/ 1,000. Se reconoce la cuenta por cobrar, la venta y el costo de ventas.',
    asientos: [
      {
        date: new Date().toISOString().slice(0, 10),
        lines: [
          { accountCode: '1212', debit: 1500, credit: 0, description: 'Cuenta por cobrar a cliente' },
          { accountCode: '7011', debit: 0, credit: 1500, description: 'Venta de mercadería' },
          { accountCode: '6911', debit: 1000, credit: 0, description: 'Costo de ventas' },
          { accountCode: '6011', debit: 0, credit: 1000, description: 'Salida de mercadería (Inventario)' },
        ],
      },
    ],
    color: 'green',
  },
  {
    nombre: 'Pago de servicios básicos',
    descripcion: 'Pago del recibo de luz por S/ 300 al contado. Se reconoce el gasto por servicios básicos y la salida de caja.',
    asientos: [
      {
        date: new Date().toISOString().slice(0, 10),
        lines: [
          { accountCode: '6311', debit: 300, credit: 0, description: 'Gasto por servicios básicos (Luz)' },
          { accountCode: '1011', debit: 0, credit: 300, description: 'Pago en efectivo (Caja)' },
        ],
      },
    ],
    color: 'yellow',
  },
];

export const EscenariosPreCargados: React.FC = () => {
  const addJournalEntry = useAppStore(s => s.addJournalEntry);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const handleCargar = (esc: typeof escenarios[0]) => {
    esc.asientos.forEach(asiento => {
      addJournalEntry({ ...asiento, id: crypto.randomUUID() });
    });
    setMensaje(`Escenario \"${esc.nombre}\" cargado correctamente.`);
    setTimeout(() => setMensaje(null), 2000);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {escenarios.map((esc, i) => (
          <div
            key={esc.nombre}
            className={`group relative bg-gradient-to-tr from-${esc.color}-100/80 via-white to-${esc.color}-200/80 dark:from-${esc.color}-900/60 dark:to-${esc.color}-700/60 rounded-2xl shadow-lg p-7 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`}
          >
            <div className="flex items-center gap-2 mb-1">
              {/* Iconos modernos para cada escenario */}
              {esc.color === 'blue' && (
                <svg className="w-7 h-7 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3.314 0-6 1.343-6 3v2c0 1.657 2.686 3 6 3s6-1.343 6-3v-2c0-1.657-2.686-3-6-3z" /></svg>
              )}
              {esc.color === 'green' && (
                <svg className="w-7 h-7 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>
              )}
              {esc.color === 'yellow' && (
                <svg className="w-7 h-7 text-yellow-500 dark:text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
              )}
              <span className="font-semibold text-lg text-neutral-700 dark:text-neutral-100 drop-shadow-sm">{esc.nombre}</span>
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">{esc.descripcion}</span>
            <button
              className="mt-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
              onClick={() => handleCargar(esc)}
            >
              <span className="inline-flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Cargar escenario
              </span>
            </button>
          </div>
        ))}
      </div>
      {mensaje && (
        <div className="mt-6 flex justify-center animate-fade-in">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-6 py-2 rounded-xl shadow font-medium text-lg transition-all duration-300">
            {mensaje}
          </span>
        </div>
      )}
    </>
  );
};
