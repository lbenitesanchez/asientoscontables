import { create } from 'zustand';

// Tipos estrictos para cuentas y asientos
export type Account = {
  code: string;
  name: string;
  type: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
  group: string;
};

export type JournalEntryLine = {
  accountCode: string;
  debit: number;
  credit: number;
  description: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  lines: JournalEntryLine[];
};

interface AppState {
  accounts: Account[];
  journal: JournalEntry[];
  addAccount: (account: Account) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  // TODO: Métodos para editar/eliminar cuentas y asientos
}

const initialAccounts: Account[] = [
  { code: '1011', name: 'Caja', type: 'activo', group: 'Activo Corriente' },
  { code: '1211', name: 'Clientes', type: 'activo', group: 'Activo Corriente' },
  { code: '3311', name: 'Maquinaria y Equipo', type: 'activo', group: 'Activo No Corriente' },
  { code: '3321', name: 'Muebles y Enseres', type: 'activo', group: 'Activo No Corriente' },
  { code: '3331', name: 'Vehículos', type: 'activo', group: 'Activo No Corriente' },
  { code: '4011', name: 'IGV Débito Fiscal', type: 'pasivo', group: 'Pasivo Corriente' },
  { code: '4211', name: 'IGV Crédito Fiscal', type: 'activo', group: 'Activo Corriente' },
  { code: '6011', name: 'Compras Mercaderías', type: 'gasto', group: 'Gastos Operativos' },
  { code: '6211', name: 'Sueldos', type: 'gasto', group: 'Gastos de Personal' },
  { code: '6311', name: 'Depreciación Acumulada', type: 'activo', group: 'Activo No Corriente' },
  { code: '6911', name: 'Pérdida por diferencia', type: 'gasto', group: 'Otros Gastos' },
  { code: '7011', name: 'Ventas Mercaderías', type: 'ingreso', group: 'Ingresos Ordinarios' }
];

export const useAppStore = create<AppState>((set) => ({
  accounts: [...initialAccounts],
  journal: [],
  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),
  addJournalEntry: (entry) =>
    set((state) => ({ journal: [...state.journal, entry] })),
  editAccount: (code: string, data: Partial<Account>) =>
    set((state) => ({
      accounts: state.accounts.map(acc => acc.code === code ? { ...acc, ...data } : acc)
    })),
  deleteAccount: (code: string) =>
    set((state) => ({ accounts: state.accounts.filter(acc => acc.code !== code) })),
}));

// TODO: Integrar persistencia con Dexie y sincronización con IndexedDB
