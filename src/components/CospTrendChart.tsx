import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import type { CospAppState } from '../types/cosp';
import {
  calculateCycleCospTrend,
  type CycleCospPoint,
  formatCount,
  formatCurrency,
} from '../utils/cospCalculations';

interface CospTrendChartProps {
  state: CospAppState;
  avgSellingPricePerNut: number;
}

export const CospTrendChart: React.FC<CospTrendChartProps> = ({
  state,
  avgSellingPricePerNut,
}) => {
  const lang = state.language;
  const t = TRANSLATIONS[lang].home;

  const data = useMemo(
    () => calculateCycleCospTrend(state, lang),
    [state, lang]
  );

  const loggedPoints = useMemo(
    () => data.filter((d) => d.cospPerNut !== null),
    [data]
  );

  const trendSummary = useMemo(() => {
    if (loggedPoints.length === 0) return null;
    if (loggedPoints.length === 1) {
      return {
        direction: 'single' as const,
        text: t.trendSteadyMsg(loggedPoints[0].cycle),
      };
    }
    const prev = loggedPoints[loggedPoints.length - 2];
    const curr = loggedPoints[loggedPoints.length - 1];
    const diff = (curr.cospPerNut ?? 0) - (prev.cospPerNut ?? 0);
    const formattedDiff = Math.abs(diff).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (diff < -0.005) {
      return {
        direction: 'down' as const,
        text: t.trendDownMsg(prev.cycle, curr.cycle, formattedDiff),
      };
    }
    if (diff > 0.005) {
      return {
        direction: 'up' as const,
        text: t.trendUpMsg(prev.cycle, curr.cycle, formattedDiff),
      };
    }
    return {
      direction: 'single' as const,
      text: t.trendSteadyMsg(curr.cycle),
    };
  }, [loggedPoints, t]);

  const yDomainMax = useMemo(() => {
    const values = loggedPoints.map((d) => d.cospPerNut ?? 0);
    if (avgSellingPricePerNut > 0) values.push(avgSellingPricePerNut);
    const maxVal = values.length > 0 ? Math.max(...values) : 100;
    return Math.ceil((maxVal * 1.15) / 10) * 10 || 100;
  }, [loggedPoints, avgSellingPricePerNut]);

  return (
    <section
      aria-label={t.trendTitle}
      data-testid="cosp-trend-section"
      className="rounded-2xl bg-cream-paper border border-warm-sand-dark p-4 sm:p-5 shadow-xs space-y-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-estate-ink font-serif">
            {t.trendTitle}
          </h3>
          <p className="text-xs sm:text-sm text-estate-muted mt-0.5">
            {t.trendSubtitle}
          </p>
        </div>

        {loggedPoints.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-estate-muted pt-0.5">
            <span className="inline-flex items-center gap-1.5 font-semibold text-palm-green-dark">
              <span className="w-3 h-0.5 bg-palm-green inline-block" aria-hidden="true" />
              <span>{t.trendCostPerNutLegend}</span>
            </span>
            {avgSellingPricePerNut > 0 && (
              <span className="inline-flex items-center gap-1.5 font-medium text-gold-accent">
                <span
                  className="w-3 border-t-2 border-dashed border-gold-accent inline-block"
                  aria-hidden="true"
                />
                <span className="tabular-nums">
                  {t.trendAvgSellingLine}: {formatCurrency(avgSellingPricePerNut, lang)}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {trendSummary && (
        <div
          data-testid="cosp-trend-callout"
          className={`rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            trendSummary.direction === 'down'
              ? 'bg-palm-green-soft text-palm-green-dark'
              : trendSummary.direction === 'up'
              ? 'bg-clay-red-soft text-clay-red'
              : 'bg-warm-sand/70 text-estate-ink'
          }`}
        >
          {trendSummary.direction === 'down' && (
            <TrendingDown className="w-4 h-4 shrink-0 text-palm-green" />
          )}
          {trendSummary.direction === 'up' && (
            <TrendingUp className="w-4 h-4 shrink-0 text-clay-red" />
          )}
          <span>{trendSummary.text}</span>
        </div>
      )}

      {loggedPoints.length === 0 ? (
        <div
          data-testid="cosp-trend-empty"
          className="rounded-xl bg-warm-sand/45 border border-warm-sand-dark/60 px-4 py-8 text-center text-sm text-estate-muted"
        >
          {t.trendEmpty}
        </div>
      ) : (
        <div className="w-full h-[230px] sm:h-[260px]" data-testid="cosp-trend-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 12, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid stroke="#E2D8C3" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="shortLabel"
                tick={{ fill: '#4A584D', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#E2D8C3' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, yDomainMax]}
                width={52}
                tick={{ fill: '#4A584D', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) =>
                  lang === 'si' ? `රු.${val}` : `Rs.${val}`
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const point = payload[0].payload as CycleCospPoint;
                  if (point.cospPerNut === null) return null;
                  return (
                    <div className="rounded-xl bg-cream-paper border border-warm-sand-dark p-3 shadow-md text-xs space-y-1">
                      <div className="font-bold text-estate-ink">{point.fullLabel}</div>
                      <div className="text-palm-green-dark font-bold tabular-nums">
                        {t.trendCostPerNutLegend}: {formatCurrency(point.cospPerNut, lang)}
                      </div>
                      <div className="text-estate-muted tabular-nums">
                        {t.trendCycleExpenses}: {formatCurrency(point.cycleExpense, lang, false)}
                      </div>
                      <div className="text-estate-muted tabular-nums">
                        {t.trendHarvestedNuts}: {formatCount(point.harvestedNuts)} {t.nutsUnit}
                      </div>
                    </div>
                  );
                }}
              />
              {avgSellingPricePerNut > 0 && (
                <ReferenceLine
                  y={avgSellingPricePerNut}
                  stroke="#B8811F"
                  strokeDasharray="5 4"
                  strokeWidth={1.75}
                />
              )}
              <Line
                type="monotone"
                dataKey="cospPerNut"
                name={t.trendCostPerNutLegend}
                stroke="#2E5339"
                strokeWidth={3}
                connectNulls={false}
                isAnimationActive={false}
                dot={{
                  r: 5,
                  fill: '#2E5339',
                  stroke: '#FBF8F0',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: '#B8811F',
                  stroke: '#FBF8F0',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
