import React, { useState } from 'react';
import { Calculator, Check, ChevronRight, Trash2, X } from 'lucide-react';
import { CYCLES, MONTHS } from '../data/categories';
import { TRANSLATIONS } from '../data/i18n';
import type { BuyerType, CycleNumber, HarvestCycleEntry, Language } from '../types/cosp';
import {
  formatCount,
  formatCurrency,
  getCycleSalesIncome,
  getMonthLabel,
  kgFromNuts,
  nutsFromKg,
} from '../utils/cospCalculations';

interface HarvestViewProps {
  lang: Language;
  harvests: Record<CycleNumber, HarvestCycleEntry>;
  onSaveCycle: (entry: HarvestCycleEntry) => void;
  onClearCycle: (cycle: CycleNumber) => void;
}

export const HarvestView: React.FC<HarvestViewProps> = ({
  lang,
  harvests,
  onSaveCycle,
  onClearCycle,
}) => {
  const t = TRANSLATIONS[lang].harvest;
  const [editingCycle, setEditingCycle] = useState<CycleNumber | null>(null);
  const [cropMonth, setCropMonth] = useState<string>('');
  const [harvestedNuts, setHarvestedNuts] = useState<string>('');
  const [soldNuts, setSoldNuts] = useState<string>('');
  const [spoiltNuts, setSpoiltNuts] = useState<string>('');
  const [familyConsumptionNuts, setFamilyConsumptionNuts] = useState<string>('');
  const [pricePerNut, setPricePerNut] = useState<string>('');
  const [buyerType, setBuyerType] = useState<BuyerType>('fairtrade');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Weight-to-Nut Converter Modal state
  const [showConverter, setShowConverter] = useState(false);
  const [avgWeightGrams, setAvgWeightGrams] = useState<string>('750');
  const [weightKgInput, setWeightKgInput] = useState<string>('');
  const [nutsInput, setNutsInput] = useState<string>('');
  const [converterTarget, setConverterTarget] = useState<'sold' | 'harvested'>('sold');

  const openCycleModal = (cycle: CycleNumber) => {
    const existing = harvests[cycle];
    setEditingCycle(cycle);
    setCropMonth(existing?.cropMonth ? String(existing.cropMonth) : '');
    setHarvestedNuts(existing?.harvestedNuts ? String(existing.harvestedNuts) : '');
    setSoldNuts(existing?.soldNuts ? String(existing.soldNuts) : '');
    setSpoiltNuts(existing?.spoiltNuts ? String(existing.spoiltNuts) : '');
    setFamilyConsumptionNuts(
      existing?.familyConsumptionNuts ? String(existing.familyConsumptionNuts) : ''
    );
    setPricePerNut(existing?.pricePerNut ? String(existing.pricePerNut) : '');
    setBuyerType(existing?.buyerType ?? 'fairtrade');
    setErrorMsg('');
  };

  const closeCycleModal = () => {
    setEditingCycle(null);
    setErrorMsg('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle) return;
    const monthNum = cropMonth ? Number(cropMonth) : null;
    const harvested = Math.max(0, Math.round(Number(harvestedNuts) || 0));
    const sold = Math.max(0, Math.round(Number(soldNuts) || 0));
    const spoilt = Math.max(0, Math.round(Number(spoiltNuts) || 0));
    const family = Math.max(0, Math.round(Number(familyConsumptionNuts) || 0));
    const price = Math.max(0, Number(pricePerNut) || 0);

    if (!monthNum || monthNum < 1 || monthNum > 12) {
      setErrorMsg(t.validationMonth);
      return;
    }
    if (harvested <= 0 && sold <= 0 && spoilt <= 0 && family <= 0) {
      setErrorMsg(t.validationNuts);
      return;
    }

    onSaveCycle({
      cycle: editingCycle,
      cropMonth: monthNum,
      harvestedNuts: harvested,
      soldNuts: sold,
      spoiltNuts: spoilt,
      familyConsumptionNuts: family,
      pricePerNut: price,
      buyerType,
    });
    closeCycleModal();
  };

  const openConverter = (target: 'sold' | 'harvested') => {
    setConverterTarget(target);
    const currentNuts =
      target === 'sold' ? Number(soldNuts) || 0 : Number(harvestedNuts) || 0;
    const avgW = Number(avgWeightGrams) || 750;
    if (currentNuts > 0) {
      setNutsInput(String(currentNuts));
      setWeightKgInput(String(kgFromNuts(currentNuts, avgW)));
    } else {
      setNutsInput('');
      setWeightKgInput('');
    }
    setShowConverter(true);
  };

  const handleKgChange = (val: string) => {
    setWeightKgInput(val);
    const kg = Number(val);
    const avgW = Number(avgWeightGrams) || 750;
    if (val === '' || !Number.isFinite(kg) || kg <= 0) {
      setNutsInput('');
    } else {
      setNutsInput(String(nutsFromKg(kg, avgW)));
    }
  };

  const handleNutsChange = (val: string) => {
    setNutsInput(val);
    const nuts = Number(val);
    const avgW = Number(avgWeightGrams) || 750;
    if (val === '' || !Number.isFinite(nuts) || nuts <= 0) {
      setWeightKgInput('');
    } else {
      setWeightKgInput(String(kgFromNuts(nuts, avgW)));
    }
  };

  const handleAvgWeightChange = (val: string) => {
    setAvgWeightGrams(val);
    const avgW = Number(val);
    const kg = Number(weightKgInput);
    if (Number.isFinite(avgW) && avgW > 0 && Number.isFinite(kg) && kg > 0) {
      setNutsInput(String(nutsFromKg(kg, avgW)));
    }
  };

  const applyConvertedNuts = () => {
    const n = Math.max(0, Math.round(Number(nutsInput) || 0));
    if (converterTarget === 'sold') {
      setSoldNuts(n > 0 ? String(n) : '');
    } else {
      setHarvestedNuts(n > 0 ? String(n) : '');
    }
    setShowConverter(false);
  };

  const liveHarvested = Math.max(0, Math.round(Number(harvestedNuts) || 0));
  const liveSold = Math.max(0, Math.round(Number(soldNuts) || 0));
  const liveSpoilt = Math.max(0, Math.round(Number(spoiltNuts) || 0));
  const liveFamily = Math.max(0, Math.round(Number(familyConsumptionNuts) || 0));
  const liveAccounted = liveSold + liveSpoilt + liveFamily;
  const liveRemaining = liveHarvested - liveAccounted;

  const liveIncome =
    Math.max(0, Number(soldNuts) || 0) * Math.max(0, Number(pricePerNut) || 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-estate-ink font-serif">{t.title}</h2>
        <p className="text-sm text-estate-muted mt-1">{t.subtitle}</p>
      </div>

      {/* 6 Cycle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CYCLES.map((c) => {
          const entry = harvests[c];
          const spoiltCount = Math.max(0, Number(entry?.spoiltNuts) || 0);
          const familyCount = Math.max(0, Number(entry?.familyConsumptionNuts) || 0);
          const isLogged =
            entry &&
            (entry.cropMonth !== null ||
              entry.harvestedNuts > 0 ||
              entry.soldNuts > 0 ||
              spoiltCount > 0 ||
              familyCount > 0);
          const income = getCycleSalesIncome(entry);

          return (
            <button
              key={c}
              type="button"
              onClick={() => openCycleModal(c)}
              className={`text-left w-full rounded-2xl border p-4 sm:p-5 transition cursor-pointer min-h-[120px] flex flex-col justify-between ${
                isLogged
                  ? 'bg-cream-paper border-palm-green/40 hover:border-palm-green shadow-xs'
                  : 'bg-warm-sand/50 border-warm-sand-dark hover:bg-warm-sand/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold tabular-nums ${
                      isLogged
                        ? 'bg-palm-green text-cream-paper'
                        : 'bg-warm-sand-dark text-estate-ink'
                    }`}
                  >
                    {c}
                  </span>
                  <div>
                    <div className="text-base font-bold text-estate-ink">
                      {t.cycleCardTitle(c)}
                    </div>
                    <div className="text-xs text-estate-muted">
                      {isLogged && entry.cropMonth
                        ? getMonthLabel(entry.cropMonth, lang)
                        : t.notLogged}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-estate-muted shrink-0" />
              </div>

              {isLogged ? (
                <div className="mt-4 pt-3 border-t border-warm-sand space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-estate-muted text-xs">{t.harvestedNuts}</span>
                    <span className="font-bold text-estate-ink tabular-nums">
                      {formatCount(entry.harvestedNuts)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-estate-muted text-xs">
                      {t.soldNuts} · {formatCurrency(entry.pricePerNut, lang)}
                    </span>
                    <span className="font-bold text-estate-ink tabular-nums">
                      {formatCount(entry.soldNuts)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-estate-muted text-xs">{t.spoiltShort}</span>
                    <span className="font-semibold text-clay-red tabular-nums">
                      {formatCount(spoiltCount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-estate-muted text-xs">{t.familyShort}</span>
                    <span className="font-semibold text-estate-ink tabular-nums">
                      {formatCount(familyCount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-warm-sand/60">
                    <span className="text-estate-muted text-xs">{t.totalCycleIncome}</span>
                    <span className="font-bold text-palm-green tabular-nums">
                      {formatCurrency(income, lang)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-warm-sand-dark/50 text-xs font-medium text-palm-green">
                  {t.tapToRecord}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Cycle Edit Modal */}
      {editingCycle !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="harvest-modal-title"
        >
          <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-cream-paper border border-warm-sand-dark p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-warm-sand">
              <h3 id="harvest-modal-title" className="text-lg font-bold text-estate-ink">
                {t.cycleCardTitle(editingCycle)}
              </h3>
              <button
                type="button"
                onClick={closeCycleModal}
                aria-label={TRANSLATIONS[lang].close}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-estate-muted hover:bg-warm-sand cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {/* Crop Month */}
              <div>
                <label
                  htmlFor="harvest-crop-month"
                  className="block text-sm font-semibold text-estate-ink mb-1.5"
                >
                  {t.cropMonth}
                </label>
                <select
                  id="harvest-crop-month"
                  value={cropMonth}
                  onChange={(e) => setCropMonth(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
                >
                  <option value="">{t.selectMonth}</option>
                  {MONTHS.map((m) => (
                    <option key={m.number} value={m.number}>
                      {lang === 'si' ? `${m.si} (${m.en})` : `${m.en} (${m.si})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Converter shortcut banner inside form */}
              <button
                type="button"
                onClick={() => openConverter('sold')}
                className="w-full min-h-[48px] rounded-xl bg-gold-soft border border-gold-accent/40 px-4 py-2.5 flex items-center justify-between text-sm font-bold text-estate-ink hover:bg-gold-soft/80 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-gold-accent shrink-0" />
                  <span>{t.converterBtn.replace(/^🥥\s*/, '')}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gold-accent shrink-0" />
              </button>

              {/* Harvested & Sold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="harvested-nuts-input"
                    className="block text-sm font-semibold text-estate-ink mb-1.5"
                  >
                    {t.harvestedNuts}
                  </label>
                  <input
                    id="harvested-nuts-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={harvestedNuts}
                    onChange={(e) => setHarvestedNuts(e.target.value)}
                    placeholder="0"
                    className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-estate-ink tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sold-nuts-input"
                    className="block text-sm font-semibold text-estate-ink mb-1.5"
                  >
                    {t.soldNuts}
                  </label>
                  <input
                    id="sold-nuts-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={soldNuts}
                    onChange={(e) => setSoldNuts(e.target.value)}
                    placeholder="0"
                    className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-estate-ink tabular-nums"
                  />
                </div>
              </div>

              {/* Spoilt/Rejected & Family Consumption / Shared Nuts */}
              <div className="rounded-xl bg-warm-sand/45 border border-warm-sand-dark/70 p-3.5 space-y-3">
                <div>
                  <label
                    htmlFor="spoilt-nuts-input"
                    className="block text-sm font-semibold text-estate-ink mb-1.5"
                  >
                    {t.spoiltNuts}
                  </label>
                  <input
                    id="spoilt-nuts-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={spoiltNuts}
                    onChange={(e) => setSpoiltNuts(e.target.value)}
                    placeholder="0"
                    className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-clay-red tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="family-nuts-input"
                    className="block text-sm font-semibold text-estate-ink mb-1.5 leading-snug"
                  >
                    {t.familyConsumptionNuts}
                  </label>
                  <input
                    id="family-nuts-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={familyConsumptionNuts}
                    onChange={(e) => setFamilyConsumptionNuts(e.target.value)}
                    placeholder="0"
                    className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-estate-ink tabular-nums"
                  />
                </div>

                {(liveHarvested > 0 || liveAccounted > 0) && (
                  <div
                    data-testid="cycle-nut-breakdown"
                    className="pt-2 border-t border-warm-sand-dark/60 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-estate-muted">{t.accountedNuts}</span>
                      <span className="font-bold text-estate-ink tabular-nums shrink-0 whitespace-nowrap">
                        {formatCount(liveAccounted)}
                        {liveHarvested > 0 ? ` / ${formatCount(liveHarvested)}` : ''}
                      </span>
                    </div>
                    {liveHarvested > 0 && liveRemaining > 0 && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-estate-muted">{t.remainingUnaccounted}</span>
                        <span className="font-semibold text-estate-ink tabular-nums">
                          {formatCount(liveRemaining)}
                        </span>
                      </div>
                    )}
                    {liveHarvested > 0 && liveRemaining < 0 && (
                      <div className="text-clay-red font-semibold">
                        {t.overAccountedHint}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price per Nut */}
              <div>
                <label
                  htmlFor="price-per-nut-input"
                  className="block text-sm font-semibold text-estate-ink mb-1.5"
                >
                  {t.pricePerNut}
                </label>
                <input
                  id="price-per-nut-input"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={pricePerNut}
                  onChange={(e) => setPricePerNut(e.target.value)}
                  placeholder="0.00"
                  className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-estate-ink tabular-nums"
                />
              </div>

              {/* Buyer Type Toggle */}
              <div>
                <span className="block text-sm font-semibold text-estate-ink mb-1.5">
                  {t.buyerType}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'fairtrade', label: t.buyerFairtrade },
                      { id: 'local', label: t.buyerLocal },
                      { id: 'other', label: t.buyerOther },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBuyerType(opt.id)}
                      className={`min-h-[48px] rounded-xl px-2 py-2 text-xs font-semibold border transition cursor-pointer ${
                        buyerType === opt.id
                          ? 'bg-palm-green text-cream-paper border-palm-green'
                          : 'bg-warm-sand/60 text-estate-ink border-warm-sand-dark hover:bg-warm-sand'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Income Preview */}
              <div className="rounded-xl bg-palm-green-soft p-3.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-palm-green-dark">
                  {t.totalCycleIncome}
                </span>
                <span
                  data-testid="cycle-live-income"
                  className="text-lg font-bold text-palm-green-dark tabular-nums"
                >
                  {formatCurrency(liveIncome, lang)}
                </span>
              </div>

              {errorMsg && (
                <div role="alert" className="rounded-xl bg-clay-red-soft text-clay-red px-3.5 py-2.5 text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[52px] rounded-xl bg-palm-green hover:bg-palm-green-dark text-cream-paper font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>{t.saveCycle}</span>
                </button>
                {harvests[editingCycle]?.cropMonth !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearCycle(editingCycle);
                      closeCycleModal();
                    }}
                    className="min-h-[52px] px-4 rounded-xl border border-clay-red/40 text-clay-red hover:bg-clay-red-soft font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.clearCycle}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weight-to-Nut Converter Modal */}
      {showConverter && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="converter-modal-title"
        >
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-cream-paper border border-warm-sand-dark p-5 sm:p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-warm-sand">
              <div>
                <h3 id="converter-modal-title" className="text-lg font-bold text-estate-ink">
                  {t.converterTitle}
                </h3>
                <p className="text-xs text-estate-muted mt-0.5">{t.converterSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowConverter(false)}
                aria-label={TRANSLATIONS[lang].close}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-estate-muted hover:bg-warm-sand cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="conv-avg-weight"
                  className="block text-sm font-semibold text-estate-ink mb-1.5"
                >
                  {t.avgWeightLabel}
                </label>
                <input
                  id="conv-avg-weight"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={avgWeightGrams}
                  onChange={(e) => handleAvgWeightChange(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base font-bold text-estate-ink tabular-nums"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="conv-kg-input"
                    className="block text-sm font-semibold text-estate-ink mb-1.5"
                  >
                    {t.kgLabel}
                  </label>
                  <input
                    id="conv-kg-input"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    value={weightKgInput}
                    onChange={(e) => handleKgChange(e.target.value)}
                    placeholder="750"
                    className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-estate-ink tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="conv-nuts-input"
                    className="block text-sm font-semibold text-estate-ink mb-1.5"
                  >
                    {t.nutsResultLabel}
                  </label>
                  <input
                    id="conv-nuts-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={nutsInput}
                    onChange={(e) => handleNutsChange(e.target.value)}
                    placeholder="1000"
                    className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-lg font-bold text-palm-green tabular-nums"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-estate-muted mb-1.5">
                  {t.applyToFieldLabel}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConverterTarget('sold')}
                    className={`min-h-[44px] rounded-xl text-xs font-bold border cursor-pointer ${
                      converterTarget === 'sold'
                        ? 'bg-palm-green text-cream-paper border-palm-green'
                        : 'bg-warm-sand/60 text-estate-ink border-warm-sand-dark'
                    }`}
                  >
                    {t.applyToSold}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConverterTarget('harvested')}
                    className={`min-h-[44px] rounded-xl text-xs font-bold border cursor-pointer ${
                      converterTarget === 'harvested'
                        ? 'bg-palm-green text-cream-paper border-palm-green'
                        : 'bg-warm-sand/60 text-estate-ink border-warm-sand-dark'
                    }`}
                  >
                    {t.applyToHarvested}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={applyConvertedNuts}
                className="w-full min-h-[52px] rounded-xl bg-palm-green hover:bg-palm-green-dark text-cream-paper font-bold text-base cursor-pointer"
              >
                {t.useThisNumber} ({formatCount(Math.max(0, Math.round(Number(nutsInput) || 0)))})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
