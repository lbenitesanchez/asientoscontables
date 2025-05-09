import React from 'react';
import { Dashboard } from './modules/Dashboard';
import { AccountsCatalog } from './modules/AccountsCatalog';
import { JournalSimulator } from './modules/JournalSimulator';
import { Ledger } from './modules/Ledger';
import { TrialBalance } from './modules/TrialBalance';
import { ScenarioLoader } from './modules/ScenarioLoader';
import { HelpTour } from './modules/HelpTour';


// TODO: Implementar navegación SPA (ejemplo: react-router-dom)

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      {/* TODO: Barra superior con logo, toggle dark/light y menú */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Dashboard />
        <AccountsCatalog />
        <JournalSimulator />
        <Ledger />
        <TrialBalance />
       

        <HelpTour />
      </main>
      {/* TODO: Footer accesible */}
    </div>
  );
}
