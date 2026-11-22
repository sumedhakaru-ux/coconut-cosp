import { useCallback, useEffect, useState } from 'react';
import { CYCLES } from '../data/categories';
import { createEmptyHarvests, createEmptyState, createSampleState } from '../data/sampleData';
import type {
  CospAppState,
  CycleNumber,
  ExpenseEntry,
  FarmerProfile,
  HarvestCycleEntry,
  Language,
} from '../types/cosp';

const STORAGE_KEY = 'coconut_cosp_app_v1';

function loadInitialState(): CospAppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    const parsed = JSON.parse(raw) as Partial<CospAppState>;
    const base = createEmptyState();
    const emptyHarvests = createEmptyHarvests();
    const hydratedHarvests = { ...emptyHarvests };
    if (parsed.harvests && typeof parsed.harvests === 'object') {
      for (const c of CYCLES) {
        const savedCycle = parsed.harvests[c];
        if (savedCycle) {
          hydratedHarvests[c] = {
            ...emptyHarvests[c],
            ...savedCycle,
            cycle: c,
            harvestedNuts: Math.max(0, Number(savedCycle.harvestedNuts) || 0),
            soldNuts: Math.max(0, Number(savedCycle.soldNuts) || 0),
            spoiltNuts: Math.max(0, Number(savedCycle.spoiltNuts) || 0),
            familyConsumptionNuts: Math.max(0, Number(savedCycle.familyConsumptionNuts) || 0),
            pricePerNut: Math.max(0, Number(savedCycle.pricePerNut) || 0),
          };
        }
      }
    }
    return {
      language: parsed.language === 'en' ? 'en' : 'si',
      profile: { ...base.profile, ...(parsed.profile ?? {}) },
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      harvests: hydratedHarvests,
      elapsedMonthsOverride:
        typeof parsed.elapsedMonthsOverride === 'number' &&
        parsed.elapsedMonthsOverride >= 1 &&
        parsed.elapsedMonthsOverride <= 12
          ? parsed.elapsedMonthsOverride
          : null,
    };
  } catch {
    return createEmptyState();
  }
}

export function useCospStorage() {
  const [state, setState] = useState<CospAppState>(() => loadInitialState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [state]);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const updateProfile = useCallback((patch: Partial<FarmerProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  }, []);

  const addOrUpdateExpense = useCallback(
    (entry: Omit<ExpenseEntry, 'id' | 'createdAt'> & { id?: string }) => {
      setState((prev) => {
        if (entry.id) {
          return {
            ...prev,
            expenses: prev.expenses.map((item) =>
              item.id === entry.id
                ? {
                    ...item,
                    date: entry.date,
                    cycle: entry.cycle,
                    categoryId: entry.categoryId,
                    amount: entry.amount,
                    note: entry.note,
                    customCategoryNote: entry.customCategoryNote,
                  }
                : item
            ),
          };
        }
        const newItem: ExpenseEntry = {
          id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          date: entry.date,
          cycle: entry.cycle,
          categoryId: entry.categoryId,
          amount: entry.amount,
          note: entry.note,
          customCategoryNote: entry.customCategoryNote,
          createdAt: Date.now(),
        };
        return {
          ...prev,
          expenses: [newItem, ...prev.expenses],
        };
      });
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== id),
    }));
  }, []);

  const saveHarvestCycle = useCallback((harvest: HarvestCycleEntry) => {
    setState((prev) => ({
      ...prev,
      harvests: {
        ...prev.harvests,
        [harvest.cycle]: harvest,
      },
    }));
  }, []);

  const clearHarvestCycle = useCallback((cycle: CycleNumber) => {
    setState((prev) => ({
      ...prev,
      harvests: {
        ...prev.harvests,
        [cycle]: {
          cycle,
          cropMonth: null,
          harvestedNuts: 0,
          soldNuts: 0,
          spoiltNuts: 0,
          familyConsumptionNuts: 0,
          pricePerNut: 0,
          buyerType: 'fairtrade',
        },
      },
    }));
  }, []);

  const setElapsedMonthsOverride = useCallback((months: number | null) => {
    setState((prev) => ({
      ...prev,
      elapsedMonthsOverride: months,
    }));
  }, []);

  const loadSampleData = useCallback(() => {
    setState((prev) => createSampleState(prev.language));
  }, []);

  const clearAllData = useCallback(() => {
    setState((prev) => ({
      ...createEmptyState(),
      language: prev.language,
    }));
  }, []);

  return {
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
  };
}
