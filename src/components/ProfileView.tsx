import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Database,
  Download,
  FileSpreadsheet,
  Printer,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { CYCLES } from '../data/categories';
import { TRANSLATIONS } from '../data/i18n';
import type { CospAppState, CospSummary, FarmerProfile } from '../types/cosp';
import {
  formatCount,
  formatCurrency,
  generateCsvReport,
  generateWhatsAppSummary,
  getCycleSalesIncome,
  getMonthLabel,
} from '../utils/cospCalculations';

interface ProfileViewProps {
  state: CospAppState;
  summary: CospSummary;
  onUpdateProfile: (patch: Partial<FarmerProfile>) => void;
  onLoadSampleData: () => void;
  onClearAllData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  state,
  summary,
  onUpdateProfile,
  onLoadSampleData,
  onClearAllData,
}) => {
  const lang = state.language;
  const t = TRANSLATIONS[lang].profile;
  const p = state.profile;

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleDownloadCsv = () => {
    const csvContent = generateCsvReport(state);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (p.farmerName || 'farmer').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.href = url;
    a.download = `coconut-cosp-${p.year}-${safeName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyWhatsapp = async () => {
    const text = generateWhatsAppSummary(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWhatsapp(true);
      window.setTimeout(() => setCopiedWhatsapp(false), 2500);
    } catch {
      // Fallback textarea copy
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedWhatsapp(true);
      window.setTimeout(() => setCopiedWhatsapp(false), 2500);
    }
  };

  const handleLoadSample = () => {
    onLoadSampleData();
    setFeedbackMsg(t.sampleLoadedMsg);
    window.setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleConfirmClear = () => {
    onClearAllData();
    setShowClearConfirm(false);
    setFeedbackMsg(t.clearedMsg);
    window.setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-estate-ink font-serif">{t.title}</h2>
        <p className="text-sm text-estate-muted mt-1">{t.subtitle}</p>
      </div>

      {feedbackMsg && (
        <div
          role="status"
          className="rounded-xl bg-palm-green-soft border border-palm-green/30 text-palm-green-dark px-4 py-3 text-sm font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Farmer Profile Form */}
      <section className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prof-spo" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.spoName}
            </label>
            <input
              id="prof-spo"
              type="text"
              value={p.spoName}
              onChange={(e) => onUpdateProfile({ spoName: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
            />
          </div>

          <div>
            <label htmlFor="prof-cluster" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.locationCluster}
            </label>
            <input
              id="prof-cluster"
              type="text"
              value={p.locationCluster}
              onChange={(e) => onUpdateProfile({ locationCluster: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
            />
          </div>

          <div>
            <label htmlFor="prof-farmer" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.farmerName}
            </label>
            <input
              id="prof-farmer"
              type="text"
              value={p.farmerName}
              onChange={(e) => onUpdateProfile({ farmerName: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
            />
          </div>

          <div>
            <label htmlFor="prof-farmer-id" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.farmerId}
            </label>
            <input
              id="prof-farmer-id"
              type="text"
              value={p.farmerId}
              onChange={(e) => onUpdateProfile({ farmerId: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="prof-mobile" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.contactMobile}
            </label>
            <input
              id="prof-mobile"
              type="tel"
              inputMode="tel"
              value={p.contactMobile}
              onChange={(e) => onUpdateProfile({ contactMobile: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="prof-year" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.year}
            </label>
            <input
              id="prof-year"
              type="number"
              inputMode="numeric"
              value={p.year}
              onChange={(e) =>
                onUpdateProfile({ year: Number(e.target.value) || new Date().getFullYear() })
              }
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base font-bold text-estate-ink tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="prof-floid" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.floId}
            </label>
            <input
              id="prof-floid"
              type="text"
              value={p.floId}
              onChange={(e) => onUpdateProfile({ floId: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
            />
          </div>

          <div>
            <label htmlFor="prof-member" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.memberNumber}
            </label>
            <input
              id="prof-member"
              type="text"
              value={p.memberNumber}
              onChange={(e) => onUpdateProfile({ memberNumber: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base text-estate-ink"
            />
          </div>

          <div>
            <label htmlFor="prof-acres" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.landSizeAcres}
            </label>
            <input
              id="prof-acres"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={p.landSizeAcres}
              onChange={(e) => onUpdateProfile({ landSizeAcres: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base font-bold text-estate-ink tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="prof-trees" className="block text-sm font-semibold text-estate-ink mb-1.5">
              {t.bearingTrees}
            </label>
            <input
              id="prof-trees"
              type="number"
              inputMode="numeric"
              min="0"
              value={p.bearingTrees}
              onChange={(e) => onUpdateProfile({ bearingTrees: e.target.value })}
              className="w-full min-h-[48px] rounded-xl border border-warm-sand-dark bg-white px-3.5 text-base font-bold text-estate-ink tabular-nums"
            />
          </div>
        </div>

        <p className="text-xs text-estate-muted pt-1">{t.autoSavedNote}</p>
      </section>

      {/* Export & SPO Reporting */}
      <section className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-6 space-y-3.5 shadow-xs">
        <h3 className="text-base font-bold text-estate-ink flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-palm-green shrink-0" />
          <span>{t.exportSectionTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="min-h-[52px] rounded-xl bg-palm-green hover:bg-palm-green-dark text-cream-paper font-bold text-sm sm:text-base px-4 py-3 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>{t.downloadCsv}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSummaryModal(true)}
            className="min-h-[52px] rounded-xl bg-warm-sand hover:bg-warm-sand-dark text-estate-ink border border-warm-sand-dark font-bold text-sm sm:text-base px-4 py-3 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Share2 className="w-5 h-5 shrink-0 text-palm-green" />
            <span>{t.printSummary}</span>
          </button>
        </div>
      </section>

      {/* Training & Data Management */}
      <section className="rounded-2xl bg-warm-sand/60 border border-warm-sand-dark p-4 sm:p-6 space-y-3.5">
        <h3 className="text-base font-bold text-estate-ink">{t.trainingDataTitle}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleLoadSample}
            className="min-h-[52px] rounded-xl bg-gold-accent hover:opacity-95 text-cream-paper font-bold text-sm sm:text-base px-4 py-3 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Database className="w-5 h-5 shrink-0" />
            <span>{t.loadSampleBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="min-h-[52px] rounded-xl bg-clay-red-soft hover:bg-clay-red/15 text-clay-red border border-clay-red/40 font-bold text-sm sm:text-base px-4 py-3 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Trash2 className="w-5 h-5 shrink-0" />
            <span>{t.clearAllBtn}</span>
          </button>
        </div>
      </section>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-confirm-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-cream-paper border border-warm-sand-dark p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-clay-red">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 id="clear-confirm-title" className="text-lg font-bold">
                {t.clearConfirmTitle}
              </h3>
            </div>
            <p className="mt-3 text-sm text-estate-muted leading-relaxed">{t.clearConfirmBody}</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 min-h-[48px] rounded-xl bg-clay-red text-cream-paper font-bold text-sm cursor-pointer"
              >
                {t.clearConfirmYes}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 min-h-[48px] rounded-xl bg-warm-sand text-estate-ink font-bold text-sm cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable / WhatsApp Summary Card Modal */}
      {showSummaryModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-modal-title"
        >
          <div className="print-only-area w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-cream-paper border border-warm-sand-dark p-5 sm:p-6 shadow-2xl">
            <div className="no-print flex items-center justify-between gap-3 pb-3 border-b border-warm-sand">
              <h3 id="summary-modal-title" className="text-lg font-bold text-estate-ink">
                {t.summaryModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                aria-label={TRANSLATIONS[lang].close}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-estate-muted hover:bg-warm-sand cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Card Content */}
            <div className="mt-4 rounded-2xl border border-warm-sand-dark bg-white p-4 sm:p-5 space-y-4">
              <div className="border-b border-warm-sand pb-3">
                <div className="text-lg font-bold text-palm-green-dark font-serif">
                  {TRANSLATIONS[lang].appName} · {p.year}
                </div>
                <div className="text-xs text-estate-muted mt-1 space-y-0.5">
                  {p.farmerName && <div>{p.farmerName}</div>}
                  {(p.farmerId || p.contactMobile) && (
                    <div className="tabular-nums">
                      {p.farmerId ? `ID: ${p.farmerId}` : ''}
                      {p.farmerId && p.contactMobile ? ' · ' : ''}
                      {p.contactMobile ? p.contactMobile : ''}
                    </div>
                  )}
                  {p.spoName && (
                    <div>
                      {p.spoName}
                      {p.locationCluster ? ` · ${p.locationCluster}` : ''}
                    </div>
                  )}
                  {(p.floId || p.memberNumber) && (
                    <div className="tabular-nums">
                      FLO: {p.floId || '-'} · Member: {p.memberNumber || '-'}
                    </div>
                  )}
                  {(p.landSizeAcres || p.bearingTrees) && (
                    <div className="tabular-nums">
                      {p.landSizeAcres || '-'} Acres · {p.bearingTrees || '-'} Trees
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-warm-sand/50 p-3">
                  <div className="text-xs text-estate-muted">
                    {TRANSLATIONS[lang].home.kpiAvgCosp}
                  </div>
                  <div className="text-lg font-bold text-estate-ink tabular-nums mt-0.5">
                    {formatCurrency(summary.avgCospPerNut, lang)}
                  </div>
                </div>
                <div className="rounded-xl bg-warm-sand/50 p-3">
                  <div className="text-xs text-estate-muted">
                    {TRANSLATIONS[lang].home.kpiAvgPrice}
                  </div>
                  <div className="text-lg font-bold text-palm-green tabular-nums mt-0.5">
                    {formatCurrency(summary.avgSellingPricePerNut, lang)}
                  </div>
                </div>
                <div className="rounded-xl bg-warm-sand/50 p-3">
                  <div className="text-xs text-estate-muted">
                    {summary.netProfit >= 0
                      ? TRANSLATIONS[lang].home.kpiNetProfit
                      : TRANSLATIONS[lang].home.kpiNetLoss}
                  </div>
                  <div
                    className={`text-lg font-bold tabular-nums mt-0.5 ${
                      summary.netProfit < 0 ? 'text-clay-red' : 'text-palm-green-dark'
                    }`}
                  >
                    {formatCurrency(summary.netProfit, lang)}
                  </div>
                </div>
                <div className="rounded-xl bg-warm-sand/50 p-3">
                  <div className="text-xs text-estate-muted">
                    {TRANSLATIONS[lang].home.kpiMonthlyIncome}
                  </div>
                  <div className="text-lg font-bold text-estate-ink tabular-nums mt-0.5">
                    {formatCurrency(summary.avgMonthlyFamilyIncome, lang)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm border-t border-warm-sand pt-3">
                {CYCLES.map((c) => {
                  const h = state.harvests[c];
                  const spoilt = Math.max(0, Number(h?.spoiltNuts) || 0);
                  const family = Math.max(0, Number(h?.familyConsumptionNuts) || 0);
                  if (
                    !h ||
                    (!h.cropMonth &&
                      h.harvestedNuts === 0 &&
                      h.soldNuts === 0 &&
                      spoilt === 0 &&
                      family === 0)
                  ) {
                    return null;
                  }
                  return (
                    <div key={c} className="space-y-0.5">
                      <div className="flex items-center justify-between tabular-nums">
                        <span className="text-estate-muted">
                          {TRANSLATIONS[lang].harvest.cycleCardTitle(c)} ({getMonthLabel(h.cropMonth, lang)})
                        </span>
                        <span className="font-semibold text-estate-ink">
                          {formatCount(h.harvestedNuts)} / {formatCount(h.soldNuts)} ·{' '}
                          {formatCurrency(getCycleSalesIncome(h), lang, false)}
                        </span>
                      </div>
                      {(spoilt > 0 || family > 0) && (
                        <div className="text-[11px] text-estate-muted tabular-nums text-right">
                          {TRANSLATIONS[lang].harvest.spoiltShort}: {formatCount(spoilt)} ·{' '}
                          {TRANSLATIONS[lang].harvest.familyShort}: {formatCount(family)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="no-print mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyWhatsapp}
                className="min-h-[48px] rounded-xl bg-palm-green hover:bg-palm-green-dark text-cream-paper font-bold text-sm px-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedWhatsapp ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.copiedWhatsapp}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t.copyWhatsapp}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[48px] rounded-xl bg-warm-sand hover:bg-warm-sand-dark text-estate-ink border border-warm-sand-dark font-bold text-sm px-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printNow}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
