import React, { useState } from 'react';
import { useAppStore, Account } from '../store';

function validateAccount(account: Partial<Account>, existing: Account[]): string | null {
  if (!account.code || !/^\d{4}$/.test(account.code)) return 'Código debe ser de 4 dígitos.';
  if (!account.name || account.name.length < 3) return 'Nombre requerido (≥3 caracteres).';
  if (!account.type) return 'Naturaleza requerida.';
  if (!account.group) return 'Grupo requerido.';
  if (existing.some(a => a.code === account.code)) return 'Código ya existe.';
  return null;
}

const typeOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'pasivo', label: 'Pasivo' },
  { value: 'patrimonio', label: 'Patrimonio' },
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'gasto', label: 'Gasto' },
];

export const AccountsCatalog: React.FC = () => {
  const accounts = useAppStore(s => s.accounts);
  const addAccount = useAppStore(s => s.addAccount);
  const editAccount = useAppStore((s: any) => s.editAccount);
  const deleteAccount = useAppStore((s: any) => s.deleteAccount);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<Partial<Account>>({ code: '', name: '', type: 'activo', group: '' });
  const [editCode, setEditCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filtered = accounts.filter(acc =>
    acc.code.includes(filter) || acc.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleChange = (field: keyof Account, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = validateAccount(form, accounts);
    if (err) return setError(err);
    addAccount(form as Account);
    setForm({ code: '', name: '', type: 'activo', group: '' });
  };

  const handleEdit = (acc: Account) => {
    setEditCode(acc.code);
    setForm({ ...acc });
    setError('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCode) return;
    if (!form.code || !form.name || !form.type || !form.group) return setError('Todos los campos son obligatorios.');
    editAccount(editCode, form);
    setEditCode(null);
    setForm({ code: '', name: '', type: 'activo', group: '' });
    setError('');
  };

  return (
    <section aria-label="Catálogo de Cuentas" className="mb-12">
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-200">
        <svg className="w-7 h-7 text-emerald-400 dark:text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18" /></svg>
        Catálogo de Cuentas
      </h2>
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔎 Buscar código o nombre..."
          className="w-64 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base transition-all"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-emerald-900/70 dark:via-neutral-900 dark:to-emerald-800/30 animate-fade-in mb-6">
        <table className="min-w-full text-base">
          <thead className="sticky top-0 z-10 bg-emerald-100/80 dark:bg-emerald-900/60 backdrop-blur border-b border-emerald-200 dark:border-emerald-700">
            <tr>
              <th className="px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-200">Código</th>
              <th className="px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-200">Nombre</th>
              <th className="px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-200">Naturaleza</th>
              <th className="px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-200">Grupo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(acc => (
              <tr key={acc.code} className={
                (editCode === acc.code ? 'bg-emerald-100 dark:bg-emerald-900/30 ' : '') +
                'transition-all duration-150 group hover:bg-emerald-50/60 dark:hover:bg-emerald-900/40'}>
                <td className="px-3 py-2 font-mono text-emerald-800 dark:text-emerald-200 font-semibold">{acc.code}</td>
                <td className="px-3 py-2 text-neutral-700 dark:text-neutral-100">{acc.name}</td>
                <td className="px-3 py-2 capitalize text-emerald-700 dark:text-emerald-200">{acc.type}</td>
                <td className="px-3 py-2 text-emerald-600 dark:text-emerald-300">{acc.group}</td>
                <td className="flex gap-1">
                  <button className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-700 shadow transition-all" onClick={() => handleEdit(acc)} aria-label="Editar">✎</button>
                  <button className="px-2 py-1 rounded-lg bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 shadow transition-all" onClick={() => deleteAccount(acc.code)} aria-label="Eliminar">🗑</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-neutral-400 py-8 text-lg">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={editCode ? handleUpdate : handleSubmit} className="flex flex-wrap gap-3 items-end bg-gradient-to-tr from-emerald-50 via-white to-emerald-100 dark:from-emerald-900/60 dark:to-emerald-700/60 rounded-2xl shadow-lg p-6 mb-2 animate-fade-in">
        <input
          type="text"
          className="w-24 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-neutral-800 shadow-sm font-mono text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Código"
          value={form.code}
          onChange={e => handleChange('code', e.target.value)}
          disabled={!!editCode}
          maxLength={4}
          required
        />
        <input
          type="text"
          className="w-44 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-neutral-800 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Nombre"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          required
        />
        <select
          className="w-36 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-neutral-800 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={form.type}
          onChange={e => handleChange('type', e.target.value)}
          required
        >
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          className="w-44 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-neutral-800 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Grupo"
          value={form.group}
          onChange={e => handleChange('group', e.target.value)}
          required
        />
        <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-semibold shadow-md hover:from-emerald-600 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-150">
          {editCode ? 'Actualizar' : 'Agregar'}
        </button>
        {editCode && (
          <button type="button" className="px-4 py-2 rounded-xl bg-gradient-to-r from-neutral-200 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 text-neutral-700 dark:text-neutral-100 shadow-md hover:from-neutral-300 hover:to-neutral-200 dark:hover:from-neutral-600 dark:hover:to-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-150" onClick={() => { setEditCode(null); setForm({ code: '', name: '', type: 'activo', group: '' }); setError(''); }}>Cancelar</button>
        )}
      </form>
      {error && <div className="text-red-600 font-medium mt-2 animate-fade-in">{error}</div>}
    </section>
  );
};
