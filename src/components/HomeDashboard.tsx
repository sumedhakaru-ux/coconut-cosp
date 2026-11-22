import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Coins,
  Pencil,
  Plus,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { CYCLES } from '../data/categories';
import { TRANSLATIONS } from '../data/i18n';
import type { CospAppState, CospSummary, FarmerProfile, TabKey } from '../types/cosp';
import { formatCount, formatCurrency } from '../utils/cospCalculations';
import { CospTrendChart } from './CospTrendChart';

interface HomeDashboardProps {
  state: CospAppState;
  summary: CospSummary;
  onNavigate: (tab: TabKey) => void;
  onUpdateProfile: (patch: Partial<FarmerProfile>) => void;
  onOverrideElapsedMonths: (months: number | null) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  summary,
  onNavigate,
  onUpdateProfile,
  onOverrideElapsedMonths,
}) => {
  const lang = state.language;
  const t = TRANSLATIONS[lang].home;
  const p = state.profile;
  const hasIdData = Boolean(
    p.farmerName.trim() || p.farmerId.trim() || p.contactMobile.trim() || p.spoName.trim()
  );
  const [isEditingId, setIsEditingId] = useState<boolean>(() => !hasIdData);

  const hasAnyNuts = summary.totalHarvestedNuts > 0 || summary.totalSoldNuts > 0;
  const hasAnyData = hasAnyNuts || summary.grandExpense > 0;
  const isLoss = summary.netProfit < 0;

  const formattedMargin = Math.abs(summary.marginPerNut).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="space-y-5">
      {/* Farmer Identification Card (Top of Home Page) */}
      <section
        aria-label={t.idCardTitle}
        data-testid="home-identification-card"
        className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-5 shadow-xs"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-palm-green-soft text-palm-green flex items-center justify-center shrink-0 mt-0.5">
              <UserCheck className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-estate-ink font-serif">
                {t.idCardTitle}
              </h2>
              <p className="text-xs text-estate-muted mt-0.5">{t.idCardSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingId((prev) => !prev)}
            className={`min-h-[40px] px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
              isEditingId
                ? 'bg-palm-green text-cream-paper hover:bg-palm-green-dark'
                : 'bg-warm-sand/80 text-estate-ink border border-warm-sand-dark hover:bg-warm-sand'
            }`}
          >
            {isEditingId ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.idDoneBtn}</span>
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                <span>{t.idEditBtn}</span>
              </>
            )}
          </button>
        </div>

        {isEditingId ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label
                htmlFor="home-id-farmer-name"
                className="block text-xs font-semibold text-estate-ink mb-1"
              >
                {t.idFarmerName}
              </label>
              <input
                id="home-id-farmer-name"
                type="text"
                value={p.farmerName}
                onChange={(e) => onUpdateProfile({ farmerName: e.target.value })}
                placeholder={t.idFarmerName}
                className="w-full min-h-[46px] rounded-xl border border-warm-sand-dark bg-white px-3 text-sm font-medium text-estate-ink"
              />
            </div>

            <div>
              <label
                htmlFor="home-id-farmer-id"
                className="block text-xs font-semibold text-estate-ink mb-1"
              >
                {t.idFarmerId}
              </label>
              <input
                id="home-id-farmer-id"
                type="text"
                value={p.farmerId}
                onChange={(e) => onUpdateProfile({ farmerId: e.target.value })}
                placeholder={t.idFarmerId}
                className="w-full min-h-[46px] rounded-xl border border-warm-sand-dark bg-white px-3 text-sm font-medium text-estate-ink tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="home-id-mobile"
                className="block text-xs font-semibold text-estate-ink mb-1"
              >
                {t.idContactMobile}
              </label>
              <input
                id="home-id-mobile"
                type="tel"
                inputMode="tel"
                value={p.contactMobile}
                onChange={(e) => onUpdateProfile({ contactMobile: e.target.value })}
                placeholder="07X XXX XXXX"
                className="w-full min-h-[46px] rounded-xl border border-warm-sand-dark bg-white px-3 text-sm font-medium text-estate-ink tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="home-id-spo-name"
                className="block text-xs font-semibold text-estate-ink mb-1"
              >
                {t.idSpoName}
              </label>
              <input
                id="home-id-spo-name"
                type="text"
                value={p.spoName}
                onChange={(e) => onUpdateProfile({ spoName: e.target.value })}
                placeholder={t.idSpoName}
                className="w-full min-h-[46px] rounded-xl border border-warm-sand-dark bg-white px-3 text-sm font-medium text-estate-ink"
              />
            </div>
          </div>
        ) : (
          <div className="mt-3.5 pt-3 border-t border-warm-sand grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-[11px] text-estate-muted">{t.idFarmerName}</div>
              <div className="font-bold text-estate-ink mt-0.5 truncate">
                {p.farmerName || t.idNotSet}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-estate-muted">{t.idFarmerId}</div>
              <div className="font-bold text-estate-ink mt-0.5 tabular-nums truncate">
                {p.farmerId || t.idNotSet}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-estate-muted">{t.idContactMobile}</div>
              <div className="font-bold text-estate-ink mt-0.5 tabular-nums truncate">
                {p.contactMobile || t.idNotSet}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-estate-muted">{t.idSpoName}</div>
              <div className="font-bold text-estate-ink mt-0.5 truncate">
                {p.spoName || t.idNotSet}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Hero Profit/Loss Banner */}
      <section
        aria-label={t.heroTitle}
        className="rounded-2xl bg-warm-sand/75 border border-warm-sand-dark p-5 sm:p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-estate-ink font-serif">
              {t.heroTitle}
            </h2>
            {p.farmerName && (
              <p className="text-xs sm:text-sm text-estate-muted mt-0.5">
                {p.farmerName}
                {p.spoName ? ` · ${p.spoName}` : ''}
              </p>
            )}
          </div>
          <span className="text-xs font-medium text-estate-muted tabular-nums">
            {p.year}
          </span>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl bg-cream-paper border border-warm-sand-dark/80 p-4">
            <div className="text-xs sm:text-sm font-medium text-estate-muted">
              {t.myCosp}
            </div>
            <div
              data-testid="hero-cosp-value"
              className="mt-1.5 text-2xl sm:text-3xl font-bold text-estate-ink tabular-nums"
            >
              {formatCurrency(summary.avgCospPerNut, lang)}
            </div>
            <div className="mt-1 text-xs text-estate-muted">{t.perNutUnit}</div>
          </div>

          <div className="rounded-xl bg-cream-paper border border-warm-sand-dark/80 p-4">
            <div className="text-xs sm:text-sm font-medium text-estate-muted">
              {t.avgSellingPrice}
            </div>
            <div
              data-testid="hero-price-value"
              className="mt-1.5 text-2xl sm:text-3xl font-bold text-palm-green tabular-nums"
            >
              {formatCurrency(summary.avgSellingPricePerNut, lang)}
            </div>
            <div className="mt-1 text-xs text-estate-muted">{t.perNutUnit}</div>
          </div>
        </div>

        {/* Bold Status Indicator */}
        {hasAnyNuts ? (
          summary.isProfitable ? (
            <div
              data-testid="hero-status-profitable"
              className="mt-4 rounded-xl bg-palm-green text-cream-paper px-4 py-3.5 flex items-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6 shrink-0 text-gold-soft" />
              <span className="text-sm sm:text-base font-bold leading-snug">
                {t.profitableBadge(formattedMargin)}
              </span>
            </div>
          ) : (
            <div
              data-testid="hero-status-loss"
              className="mt-4 rounded-xl bg-clay-red text-cream-paper px-4 py-3.5 flex items-center gap-3"
            >
              <AlertTriangle className="w-6 h-6 shrink-0 text-cream-paper" />
              <span className="text-sm sm:text-base font-bold leading-snug">
                {lang === 'si'
                  ? 'අවදානමක් — නිෂ්පාදන පිරිවැයට වඩා අඩුවෙන් විකුණයි'
                  : t.lossRiskBadge(formattedMargin)}
              </span>
            </div>
          )
        ) : (
          <div className="mt-4 rounded-xl bg-cream-paper/90 border border-warm-sand-dark px-4 py-3.5 text-sm text-estate-muted">
            <p>{t.emptyHeroHint}</p>
            {!hasAnyData && (
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="mt-2 inline-flex items-center text-sm font-semibold text-palm-green underline underline-offset-4 min-h-[44px] cursor-pointer"
              >
                {t.loadSampleHint}
              </button>
            )}
          </div>
        )}
      </section>

      {/* 2 Big Quick-Action Buttons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onNavigate('expenses')}
          className="min-h-[56px] w-full rounded-2xl bg-palm-green hover:bg-palm-green-dark active:scale-[0.99] text-cream-paper font-bold text-sm sm:text-base px-4 py-3.5 flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-5 h-5 shrink-0" />
          <span>{t.quickAddExpense.replace(/^\+\s*/, '')}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('harvest')}
          className="min-h-[56px] w-full rounded-2xl bg-gold-accent hover:opacity-95 active:scale-[0.99] text-cream-paper font-bold text-sm sm:text-base px-4 py-3.5 flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-5 h-5 shrink-0" />
          <span>{t.quickAddHarvest.replace(/^\+\s*/, '')}</span>
        </button>
      </section>

      {/* 4 KPI Cards */}
      <section aria-label="KPI Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Avg COSP */}
        <div className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 text-estate-muted">
            <span className="text-xs sm:text-sm font-medium">{t.kpiAvgCosp}</span>
            <Coins className="w-4 h-4 text-gold-accent shrink-0" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-estate-ink tabular-nums">
            {formatCurrency(summary.avgCospPerNut, lang)}
          </div>
          <div className="mt-1 text-xs text-estate-muted">{t.perNutUnit}</div>
        </div>

        {/* KPI 2: Avg Price */}
        <div className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 text-estate-muted">
            <span className="text-xs sm:text-sm font-medium">{t.kpiAvgPrice}</span>
            <ArrowUpRight className="w-4 h-4 text-palm-green shrink-0" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-palm-green tabular-nums">
            {formatCurrency(summary.avgSellingPricePerNut, lang)}
          </div>
          <div className="mt-1 text-xs text-estate-muted">{t.perNutUnit}</div>
        </div>

        {/* KPI 3: Net Profit / Net Loss */}
        <div
          data-testid="kpi-net-profit-card"
          className={`rounded-2xl border p-4 shadow-xs ${
            isLoss
              ? 'bg-clay-red-soft border-clay-red/40'
              : 'bg-palm-green-soft/70 border-palm-green/25'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs sm:text-sm font-semibold ${
                isLoss ? 'text-clay-red' : 'text-palm-green'
              }`}
            >
              {isLoss ? t.kpiNetLoss : t.kpiNetProfit}
            </span>
            {isLoss ? (
              <TrendingDown className="w-4 h-4 text-clay-red shrink-0" />
            ) : (
              <TrendingUp className="w-4 h-4 text-palm-green shrink-0" />
            )}
          </div>
          <div
            className={`mt-2 text-xl sm:text-2xl font-bold tabular-nums ${
              isLoss ? 'text-clay-red' : 'text-palm-green-dark'
            }`}
          >
            {formatCurrency(summary.netProfit, lang)}
          </div>
          <div className="mt-1 text-xs text-estate-muted tabular-nums">
            {formatCurrency(summary.grandSalesIncome, lang, false)} −{' '}
            {formatCurrency(summary.grandExpense, lang, false)}
          </div>
        </div>

        {/* KPI 4: Avg Monthly Family Income + Manual 1-12 Override */}
        <div className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 text-estate-muted">
            <span className="text-xs sm:text-sm font-medium">{t.kpiMonthlyIncome}</span>
            <Wallet className="w-4 h-4 text-gold-accent shrink-0" />
          </div>
          <div
            className={`mt-2 text-xl sm:text-2xl font-bold tabular-nums ${
              summary.avgMonthlyFamilyIncome < 0 ? 'text-clay-red' : 'text-estate-ink'
            }`}
          >
            {formatCurrency(summary.avgMonthlyFamilyIncome, lang)}
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5">
            <span className="text-xs text-estate-muted">
              {t.elapsedMonthsLabel(
                summary.effectiveElapsedMonths,
                state.elapsedMonthsOverride !== null
              )}
            </span>
            <select
              aria-label={t.elapsedMonthsSelect}
              value={state.elapsedMonthsOverride === null ? 'auto' : String(state.elapsedMonthsOverride)}
              onChange={(e) => {
                const v = e.target.value;
                onOverrideElapsedMonths(v === 'auto' ? null : Number(v));
              }}
              className="w-full min-h-[38px] rounded-lg border border-warm-sand-dark bg-warm-sand/60 px-2.5 text-xs font-semibold text-estate-ink cursor-pointer"
            >
              <option value="auto">
                {t.elapsedAuto} ({summary.autoElapsedMonths})
              </option>
              {Array.from({ length: 12 }, (_, idx) => idx + 1).map((m) => (
                <option key={m} value={m}>
                  {m} {lang === 'si' ? 'මාස' : 'mo'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 6-Cycle COSP Trend Line Chart */}
      <CospTrendChart
        state={state}
        avgSellingPricePerNut={summary.avgSellingPricePerNut}
      />

      {/* Quick Summary Progress */}
      <section className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-estate-ink">{t.progressTitle}</h3>
          <span
            data-testid="cycles-completed-label"
            className="text-sm font-bold text-palm-green tabular-nums"
          >
            {t.cyclesCompleted(summary.completedCyclesCount)}
          </span>
        </div>

        {/* 6-Cycle Visual Indicator */}
        <div className="mt-3 grid grid-cols-6 gap-2" aria-hidden="true">
          {CYCLES.map((c) => {
            const h = state.harvests[c];
            const done =
              h &&
              (h.harvestedNuts > 0 ||
                h.soldNuts > 0 ||
                (h.spoiltNuts || 0) > 0 ||
                (h.familyConsumptionNuts || 0) > 0);
            return (
              <div
                key={c}
                className={`h-3 rounded-md transition-colors ${
                  done ? 'bg-palm-green' : 'bg-warm-sand'
                }`}
              />
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-warm-sand">
          <div>
            <div className="text-xs text-estate-muted">{t.nutsHarvested}</div>
            <div className="mt-0.5 text-base font-bold text-estate-ink tabular-nums">
              {formatCount(summary.totalHarvestedNuts)} {t.nutsUnit}
            </div>
          </div>
          <div>
            <div className="text-xs text-estate-muted">{t.nutsSold}</div>
            <div className="mt-0.5 text-base font-bold text-estate-ink tabular-nums">
              {formatCount(summary.totalSoldNuts)} {t.nutsUnit}
            </div>
          </div>
          <div>
            <div className="text-xs text-estate-muted">{t.totalExpenses}</div>
            <div className="mt-0.5 text-base font-bold text-clay-red tabular-nums flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
              <span>{formatCurrency(summary.grandExpense, lang, false)}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-estate-muted">{t.totalSales}</div>
            <div className="mt-0.5 text-base font-bold text-palm-green tabular-nums flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              <span>{formatCurrency(summary.grandSalesIncome, lang, false)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-warm-sand/70">
          <div>
            <div className="text-xs text-estate-muted">{t.nutsSpoilt}</div>
            <div className="mt-0.5 text-sm font-bold text-clay-red tabular-nums">
              {formatCount(summary.totalSpoiltNuts)} {t.nutsUnit}
            </div>
          </div>
          <div>
            <div className="text-xs text-estate-muted">{t.nutsFamily}</div>
            <div className="mt-0.5 text-sm font-bold text-estate-ink tabular-nums">
              {formatCount(summary.totalFamilyConsumptionNuts)} {t.nutsUnit}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
