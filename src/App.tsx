import React, { useEffect, useMemo, useState } from 'react';
import { Home, ReceiptText, Sprout, User } from 'lucide-react';
import { ExpensesView } from './components/ExpensesView';
import { HarvestView } from './components/HarvestView';
import { HomeDashboard } from './components/HomeDashboard';
import { ProfileView } from './components/ProfileView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAControls';
import { TRANSLATIONS } from './data/i18n';
import { useCospStorage } from './hooks/useCospStorage';
import type { TabKey } from './types/cosp';
import { calculateCospSummary } from './utils/cospCalculations';

export default function App() {
  const {
    state,
    setLanguage,
    updateProfile,
    addOrUpdateExpense,
    deleteExpense,
    saveHarvestCycle,
    clearHarvestCycle,
    setElapsedMonthsOverride,
    loadSampleData,
    clearAllData,
  } = useCospStorage();

  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const lang = state.language;
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'si' ? 'si' : 'en';
  }, [lang]);

  const summary = useMemo(() => calculateCospSummary(state), [state]);

  const handleNavigate = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: t.nav.home, icon: <Home className="w-5 h-5" /> },
    { key: 'expenses', label: t.nav.expenses, icon: <ReceiptText className="w-5 h-5" /> },
    { key: 'harvest', label: t.nav.harvest, icon: <Sprout className="w-5 h-5" /> },
    { key: 'profile', label: t.nav.profile, icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-cream-paper text-estate-ink flex flex-col">
      {/* Sticky Top App Bar (56px) */}
      <header className="no-print sticky top-0 z-30 h-14 bg-cream-paper/95 backdrop-blur-md border-b border-warm-sand-dark">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/icon.svg"
              alt=""
              width={28}
              height={28}
              className="w-7 h-7 rounded-lg shrink-0"
            />
            <h1 className="text-base sm:text-lg font-bold text-palm-green-dark font-serif truncate whitespace-nowrap">
              {t.appName}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton lang={lang} />

            {/* Simple Language Toggle */}
            <div
              role="group"
              aria-label="Language"
              className="inline-flex p-0.5 rounded-xl bg-warm-sand border border-warm-sand-dark shrink-0"
            >
              <button
                type="button"
                onClick={() => setLanguage('si')}
                aria-pressed={lang === 'si'}
                className={`min-h-[38px] px-2.5 sm:px-3 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  lang === 'si'
                    ? 'bg-palm-green text-cream-paper shadow-xs'
                    : 'text-estate-ink hover:bg-warm-sand-dark/50'
                }`}
              >
                සිංහල
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-[38px] px-2.5 sm:px-3 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  lang === 'en'
                    ? 'bg-palm-green text-cream-paper shadow-xs'
                    : 'text-estate-ink hover:bg-warm-sand-dark/50'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </header>

      <OfflineIndicator lang={lang} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-24">
        {activeTab === 'home' && (
          <HomeDashboard
            state={state}
            summary={summary}
            onNavigate={handleNavigate}
            onUpdateProfile={updateProfile}
            onOverrideElapsedMonths={setElapsedMonthsOverride}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            lang={lang}
            expenses={state.expenses}
            onSaveExpense={addOrUpdateExpense}
            onDeleteExpense={deleteExpense}
          />
        )}

        {activeTab === 'harvest' && (
          <HarvestView
            lang={lang}
            harvests={state.harvests}
            onSaveCycle={saveHarvestCycle}
            onClearCycle={clearHarvestCycle}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            state={state}
            summary={summary}
            onUpdateProfile={updateProfile}
            onLoadSampleData={loadSampleData}
            onClearAllData={clearAllData}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar (4 Tabs, 64px) */}
      <nav
        aria-label="Primary Navigation"
        className="no-print fixed bottom-0 left-0 right-0 z-40 bg-cream-paper/95 backdrop-blur-md border-t border-warm-sand-dark pb-safe"
      >
        <div className="max-w-3xl mx-auto grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavigate(item.key)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 px-1 transition-colors cursor-pointer ${
                  active
                    ? 'text-palm-green font-bold'
                    : 'text-estate-muted hover:text-estate-ink font-medium'
                }`}
              >
                <span
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                    active ? 'bg-palm-green-soft text-palm-green' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
