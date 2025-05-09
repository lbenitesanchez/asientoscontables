import Dexie, { Table } from 'dexie';
import { Account, JournalEntry } from './store';

export class AccountingDB extends Dexie {
  accounts!: Table<Account, string>;
  journal!: Table<JournalEntry, string>;

  constructor() {
    super('AccountingDB');
    this.version(1).stores({
      accounts: 'code',
      journal: 'id,date'
    });
  }
}

export const db = new AccountingDB();

// TODO: Agregar métodos para importar/exportar datos y sincronizar con el store Zustand.
