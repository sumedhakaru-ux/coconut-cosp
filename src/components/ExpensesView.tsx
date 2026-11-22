import React, { useMemo, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import {
  CATEGORY_MAP,
  CYCLES,
  EXPENSE_CATEGORIES,
  EXPENSE_GROUPS,
  mapDateToCycle,
} from '../data/categories';
import { TRANSLATIONS } from '../data/i18n';
import type {
  CycleNumber,
  ExpenseCategoryId,
  ExpenseEntry,
  Language,
  ReceiptScanResult,
} from '../types/cosp';
import {
  formatCurrency,
  getCategoryLabel,
  getExpenseMatrix,
  getMonthLabel,
} from '../utils/cospCalculations';
import { CategoryIcon } from './CategoryIcon';

const AI_SCAN_ENABLED = import.meta.env.VITE_ENABLE_AI_SCAN === 'true';

interface ExpensesViewProps {
  lang: Language;
  expenses: ExpenseEntry[];
  onSaveExpense: (entry: Omit<ExpenseEntry, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteExpense: (id: string) => void;
}

function getTodayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function compressImageToBase64(
  file: File
): Promise<{ base64: string; mimeType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

  return await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1280;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const rawBase64 = dataUrl.split(',')[1] ?? '';
        resolve({ base64: rawBase64, mimeType: file.type || 'image/jpeg' });
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const outUrl = canvas.toDataURL('image/jpeg', 0.82);
      resolve({
        base64: outUrl.split(',')[1] ?? '',
        mimeType: 'image/jpeg',
      });
    };
    img.onerror = () => {
      const rawBase64 = dataUrl.split(',')[1] ?? '';
      resolve({ base64: rawBase64, mimeType: file.type || 'image/jpeg' });
    };
    img.src = dataUrl;
  });
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  lang,
  expenses,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const t = TRANSLATIONS[lang].expenses;
  const today = getTodayIso();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(today);
  const [cycle, setCycle] = useState<CycleNumber>(() => mapDateToCycle(today));
  const [categoryId, setCategoryId] = useState<ExpenseCategoryId>('plucking');
  const [amount, setAmount] = useState<string>('');
  const [customCategoryNote, setCustomCategoryNote] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const [formError, setFormError] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string>('');

  // Receipt AI scan states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // History view mode
  const [historyMode, setHistoryMode] = useState<'timeline' | 'cycles'>('timeline');
  const [expandedCycle, setExpandedCycle] = useState<CycleNumber | null>(1);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (newDate) {
      setCycle(mapDateToCycle(newDate));
    }
  };

  const resetForm = () => {
    const freshToday = getTodayIso();
    setEditingId(null);
    setDate(freshToday);
    setCycle(mapDateToCycle(freshToday));
    setCategoryId('plucking');
    setAmount('');
    setCustomCategoryNote('');
    setNote('');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError(t.validationAmount);
      return;
    }
    if (categoryId === 'other' && customCategoryNote.trim() === '') {
      setFormError(t.validationOtherText);
      return;
    }

    onSaveExpense({
      id: editingId ?? undefined,
      date: date || getTodayIso(),
      cycle,
      categoryId,
      amount: Math.round(numericAmount * 100) / 100,
      note: note.trim(),
      customCategoryNote:
        categoryId === 'other' ? customCategoryNote.trim() : undefined,
    });

    resetForm();
    setScanFeedback(null);
    setToastMsg(t.savedToast);
    window.setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStartEdit = (entry: ExpenseEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setCycle(entry.cycle);
    setCategoryId(entry.categoryId);
    setAmount(String(entry.amount));
    setCustomCategoryNote(entry.customCategoryNote ?? '');
    setNote(entry.note ?? '');
    setFormError('');
    setScanFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReceiptSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setScanFeedback({ type: 'error', text: t.scanOfflineError });
      return;
    }

    setIsScanning(true);
    setScanFeedback(null);
    setFormError('');

    try {
      const { base64, mimeType } = await compressImageToBase64(file);
      const res = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      const payload = (await res.json()) as Partial<ReceiptScanResult> & {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(payload.error || `HTTP ${res.status}`);
      }

      if (payload.amount && payload.amount > 0) {
        setAmount(String(payload.amount));
      }
      if (payload.date && /^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
        setDate(payload.date);
        setCycle(mapDateToCycle(payload.date));
      }
      if (payload.categoryId && CATEGORY_MAP[payload.categoryId]) {
        setCategoryId(payload.categoryId);
        if (payload.categoryId === 'other' && payload.note) {
          setCustomCategoryNote(payload.note);
        }
      }
      if (payload.note) {
        setNote(payload.note);
      }

      setScanFeedback({ type: 'success', text: t.scanSuccess });
      amountInputRef.current?.focus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setScanFeedback({ type: 'error', text: `${t.scanErrorPrefix}${msg}` });
    } finally {
      setIsScanning(false);
    }
  };

  // Monthly Timeline grouping
  const timelineMonths = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt - a.createdAt;
    });

    const groups: {
      monthKey: string;
      label: string;
      total: number;
      items: ExpenseEntry[];
    }[] = [];

    const indexMap = new Map<string, number>();

    for (const item of sorted) {
      const key = item.date.slice(0, 7) || 'unknown';
      const [yr, mo] = key.split('-');
      const monthNum = Number(mo);
      const label =
        Number.isFinite(monthNum) && monthNum >= 1 && monthNum <= 12
          ? `${getMonthLabel(monthNum, lang)} ${yr}`
          : key;

      let idx = indexMap.get(key);
      if (idx === undefined) {
        idx = groups.length;
        indexMap.set(key, idx);
        groups.push({ monthKey: key, label, total: 0, items: [] });
      }
      groups[idx].items.push(item);
      groups[idx].total += item.amount;
    }

    return groups;
  }, [expenses, lang]);

  const matrix = useMemo(() => getExpenseMatrix({ expenses }), [expenses]);

  return (
    <div className="space-y-6" ref={formTopRef}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-estate-ink font-serif">{t.title}</h2>
          <p className="text-sm text-estate-muted mt-1">{t.subtitle}</p>
        </div>
      </div>

      {/* Optional AI Receipt Scanner (only when VITE_ENABLE_AI_SCAN=true) */}
      {AI_SCAN_ENABLED && (
        <div className="rounded-2xl bg-gold-soft/70 border border-gold-accent/35 p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReceiptSelected}
            className="hidden"
            aria-label={t.scanReceiptBtn}
          />
          <button
            type="button"
            disabled={isScanning}
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[54px] rounded-xl bg-gold-accent hover:opacity-95 disabled:opacity-70 text-cream-paper font-bold text-base px-4 py-3 flex items-center justify-center gap-2.5 shadow-xs transition cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <span>{t.scanningReceipt}</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 shrink-0" />
                <span>{t.scanReceiptBtn.replace(/^📷\s*/, '')}</span>
              </>
            )}
          </button>

          {scanFeedback && (
            <div
              role={scanFeedback.type === 'error' ? 'alert' : 'status'}
              className={`mt-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                scanFeedback.type === 'success'
                  ? 'bg-palm-green-soft text-palm-green-dark'
                  : 'bg-clay-red-soft text-clay-red'
              }`}
            >
              {scanFeedback.text}
            </div>
          )}
        </div>
      )}

      {/* 3-Step Mobile Card Flow */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {editingId && (
          <div className="rounded-xl bg-gold-soft border border-gold-accent px-4 py-3 flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-estate-ink">{t.editingBanner}</span>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[40px] px-3 rounded-lg bg-cream-paper border border-warm-sand-dark text-xs font-bold text-estate-ink flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>{t.cancelEdit}</span>
            </button>
          </div>
        )}

        {/* Step 1: Date & Cycle */}
        <section className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-5 space-y-4">
          <h3 className="text-base font-bold text-palm-green-dark">{t.step1Title}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expense-date-input"
                className="block text-sm font-semibold text-estate-ink mb-1.5"
              >
                {t.dateLabel}
              </label>
              <input
                id="expense-date-input"
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base font-medium text-estate-ink tabular-nums"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-estate-ink mb-1.5">
                {t.cycleLabel}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {CYCLES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCycle(c)}
                    className={`min-h-[48px] rounded-xl text-sm font-bold border transition cursor-pointer tabular-nums ${
                      cycle === c
                        ? 'bg-palm-green text-cream-paper border-palm-green'
                        : 'bg-warm-sand/60 text-estate-ink border-warm-sand-dark hover:bg-warm-sand'
                    }`}
                  >
                    {lang === 'si' ? `ව${c}` : `C${c}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: 16 Categories in 4 Sections */}
        <section className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-5 space-y-5">
          <h3 className="text-base font-bold text-palm-green-dark">{t.step2Title}</h3>

          <div className="space-y-5">
            {EXPENSE_GROUPS.map((grp) => {
              const cats = EXPENSE_CATEGORIES.filter((c) => c.groupId === grp.id);
              return (
                <div key={grp.id} className="space-y-2.5">
                  <div className="text-xs sm:text-sm font-bold text-estate-muted border-b border-warm-sand pb-1.5">
                    {lang === 'si' ? grp.si : grp.en}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cats.map((cat) => {
                      const active = categoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategoryId(cat.id)}
                          aria-pressed={active}
                          className={`min-h-[54px] w-full rounded-xl px-3.5 py-2.5 text-left flex items-center gap-3 border transition cursor-pointer ${
                            active
                              ? 'bg-palm-green text-cream-paper border-palm-green shadow-xs'
                              : 'bg-warm-sand/45 text-estate-ink border-warm-sand-dark/80 hover:bg-warm-sand'
                          }`}
                        >
                          <span
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              active
                                ? 'bg-cream-paper/20 text-cream-paper'
                                : 'bg-cream-paper text-palm-green'
                            }`}
                          >
                            <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                          </span>
                          <span className="text-sm font-semibold leading-snug">
                            {lang === 'si' ? cat.si : cat.en}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Amount + Note */}
        <section className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-5 space-y-4">
          <h3 className="text-base font-bold text-palm-green-dark">{t.step3Title}</h3>

          {categoryId === 'other' && (
            <div>
              <label
                htmlFor="expense-custom-category"
                className="block text-sm font-semibold text-estate-ink mb-1.5"
              >
                {t.customCategoryLabel}
              </label>
              <input
                id="expense-custom-category"
                type="text"
                value={customCategoryNote}
                onChange={(e) => setCustomCategoryNote(e.target.value)}
                placeholder={t.customCategoryPlaceholder}
                className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expense-amount-input"
                className="block text-sm font-semibold text-estate-ink mb-1.5"
              >
                {t.amountLabel}
              </label>
              <input
                ref={amountInputRef}
                id="expense-amount-input"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
                className="w-full min-h-[54px] rounded-xl border border-warm-sand-dark bg-white px-4 text-2xl font-bold text-estate-ink tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="expense-note-input"
                className="block text-sm font-semibold text-estate-ink mb-1.5"
              >
                {t.noteLabel}
              </label>
              <input
                id="expense-note-input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.notePlaceholder}
                className="w-full min-h-[54px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
              />
            </div>
          </div>

          {formError && (
            <div
              role="alert"
              className="rounded-xl bg-clay-red-soft text-clay-red px-4 py-3 text-sm font-semibold"
            >
              {formError}
            </div>
          )}

          {toastMsg && (
            <div
              role="status"
              className="rounded-xl bg-palm-green-soft text-palm-green-dark px-4 py-3 text-sm font-bold flex items-center gap-2"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[56px] rounded-xl bg-palm-green hover:bg-palm-green-dark active:scale-[0.99] text-cream-paper font-bold text-base px-5 py-3.5 flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Check className="w-5 h-5 shrink-0" />
            <span>{editingId ? t.updateExpense : t.saveExpense}</span>
          </button>
        </section>
      </form>

      {/* Expense History View */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-estate-ink font-serif">{t.historyTitle}</h3>

          <div className="inline-flex p-1 rounded-xl bg-warm-sand border border-warm-sand-dark">
            <button
              type="button"
              onClick={() => setHistoryMode('timeline')}
              className={`min-h-[42px] px-3.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                historyMode === 'timeline'
                  ? 'bg-cream-paper text-palm-green shadow-xs'
                  : 'text-estate-muted hover:text-estate-ink'
              }`}
            >
              {t.viewTimeline}
            </button>
            <button
              type="button"
              onClick={() => setHistoryMode('cycles')}
              className={`min-h-[42px] px-3.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                historyMode === 'cycles'
                  ? 'bg-cream-paper text-palm-green shadow-xs'
                  : 'text-estate-muted hover:text-estate-ink'
              }`}
            >
              {t.viewCycleSummary}
            </button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="rounded-2xl bg-warm-sand/50 border border-warm-sand-dark p-6 text-center">
            <p className="text-base font-bold text-estate-ink">{t.noExpensesYet}</p>
            <p className="text-sm text-estate-muted mt-1">{t.noExpensesHint}</p>
          </div>
        ) : historyMode === 'timeline' ? (
          <div className="space-y-4" data-testid="expense-timeline-list">
            {timelineMonths.map((grp) => (
              <div
                key={grp.monthKey}
                className="rounded-2xl bg-cream-paper border border-warm-sand-dark overflow-hidden"
              >
                <div className="bg-warm-sand/65 px-4 py-3 flex items-center justify-between gap-2 border-b border-warm-sand-dark">
                  <span className="text-sm font-bold text-estate-ink">{grp.label}</span>
                  <span className="text-sm font-bold text-palm-green-dark tabular-nums">
                    {formatCurrency(grp.total, lang)}
                  </span>
                </div>

                <ul className="divide-y divide-warm-sand">
                  {grp.items.map((item) => {
                    const cat = CATEGORY_MAP[item.categoryId];
                    const catTitle =
                      item.categoryId === 'other' && item.customCategoryNote
                        ? `${getCategoryLabel(item.categoryId, lang)}: ${item.customCategoryNote}`
                        : getCategoryLabel(item.categoryId, lang);

                    return (
                      <li
                        key={item.id}
                        className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="w-10 h-10 rounded-xl bg-warm-sand/80 text-palm-green flex items-center justify-center shrink-0 mt-0.5">
                            <CategoryIcon
                              name={cat?.iconName ?? 'FileText'}
                              className="w-5 h-5"
                            />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-semibold text-estate-ink leading-snug">
                              {catTitle}
                            </div>
                            <div className="text-xs text-estate-muted mt-0.5 flex flex-wrap items-center gap-1.5 tabular-nums">
                              <span>{item.date}</span>
                              <span aria-hidden="true">·</span>
                              <span>{t.cycleOption(item.cycle)}</span>
                              {item.note && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="truncate max-w-[220px]">{item.note}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 pl-13 sm:pl-0">
                          <span className="text-base font-bold text-estate-ink tabular-nums mr-2">
                            {formatCurrency(item.amount, lang)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            aria-label={`${t.editBtn} ${catTitle} ${item.date}`}
                            className="min-w-[44px] min-h-[44px] rounded-xl border border-warm-sand-dark bg-warm-sand/50 hover:bg-warm-sand text-estate-ink flex items-center justify-center cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteExpense(item.id)}
                            aria-label={`${t.deleteBtn} ${catTitle} ${item.date}`}
                            className="min-w-[44px] min-h-[44px] rounded-xl border border-clay-red/30 bg-clay-red-soft/70 hover:bg-clay-red-soft text-clay-red flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          /* Cycle Summary Breakdown (Mobile-friendly stacked cards, zero wide horizontal tables) */
          <div className="space-y-3" data-testid="expense-cycle-summary">
            {CYCLES.map((c) => {
              const total = matrix.cycleTotals[c];
              const isExpanded = expandedCycle === c;
              const nonZeroCategories = EXPENSE_CATEGORIES.filter(
                (cat) => matrix.byCategoryAndCycle[cat.id][c] > 0
              );

              return (
                <div
                  key={c}
                  className="rounded-2xl bg-cream-paper border border-warm-sand-dark overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedCycle(isExpanded ? null : c)}
                    aria-expanded={isExpanded}
                    className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-warm-sand/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-palm-green text-cream-paper font-bold text-sm flex items-center justify-center tabular-nums">
                        {c}
                      </span>
                      <div className="text-left">
                        <div className="text-sm sm:text-base font-bold text-estate-ink">
                          {t.cycleOption(c)}
                        </div>
                        <div className="text-xs text-estate-muted">{t.totalForCycle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-estate-ink tabular-nums">
                        {formatCurrency(total, lang)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-estate-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-estate-muted" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-warm-sand px-4 py-3 bg-warm-sand/25">
                      {nonZeroCategories.length === 0 ? (
                        <p className="text-sm text-estate-muted py-1">{t.noExpensesInCycle}</p>
                      ) : (
                        <ul className="divide-y divide-warm-sand">
                          {nonZeroCategories.map((cat) => (
                            <li
                              key={cat.id}
                              className="py-2.5 flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="flex items-center gap-2.5 text-estate-ink">
                                <CategoryIcon
                                  name={cat.iconName}
                                  className="w-4 h-4 text-palm-green shrink-0"
                                />
                                <span>{lang === 'si' ? cat.si : cat.en}</span>
                              </span>
                              <span className="font-bold text-estate-ink tabular-nums shrink-0">
                                {formatCurrency(matrix.byCategoryAndCycle[cat.id][c], lang)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
