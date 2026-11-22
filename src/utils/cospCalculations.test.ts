import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyState, createSampleState } from '../data/sampleData';
import { CATEGORY_MAP, EXPENSE_CATEGORIES, mapDateToCycle } from '../data/categories';
import {
  calculateCospSummary,
  calculateCycleCospTrend,
  formatLkr,
  generateCsvReport,
  getCycleSalesIncome,
  kgFromNuts,
  nutsFromKg,
} from './cospCalculations';

test('exact 16 Sinhala COSP categories exist', () => {
  assert.equal(EXPENSE_CATEGORIES.length, 16);
  assert.equal(CATEGORY_MAP.plucking.si, 'පොල් කැඩීම');
  assert.equal(CATEGORY_MAP.dehusking.si, 'පොල් ලෙලි ගැසීම');
});

test('sample dataset computes exact COSP formulas', () => {
  const sample = createSampleState('si');
  const summary = calculateCospSummary(sample, 11);

  assert.equal(summary.totalHarvestedNuts, 3350);
  assert.equal(summary.totalSoldNuts, 2300);
  assert.equal(summary.totalSpoiltNuts, 250);
  assert.equal(summary.totalFamilyConsumptionNuts, 800);
  assert.equal(summary.grandSalesIncome, 178100);
  assert.equal(summary.grandExpense, 169550);
  assert.equal(summary.netProfit, 8550);
  assert.equal(summary.completedCyclesCount, 2);
  assert.equal(summary.autoElapsedMonths, 6);
  assert.equal(summary.effectiveElapsedMonths, 6);
  assert.equal(summary.avgMonthlyFamilyIncome, 1425);
  assert.ok(Math.abs(summary.avgCospPerNut - 169550 / 3350) < 1e-6);
  assert.ok(Math.abs(summary.avgSellingPricePerNut - 178100 / 2300) < 1e-6);
  assert.equal(summary.isProfitable, true);
});

test('calculateCycleCospTrend returns 6 cycles with accurate per-cycle COSP', () => {
  const sample = createSampleState('si');
  const trend = calculateCycleCospTrend(sample, 'si');

  assert.equal(trend.length, 6);
  assert.equal(trend[0].cycle, 1);
  assert.equal(trend[0].shortLabel, 'ව1');
  assert.equal(trend[0].cycleExpense, 108350);
  assert.equal(trend[0].harvestedNuts, 1700);
  assert.equal(trend[0].cospPerNut, 63.74);

  assert.equal(trend[1].cycle, 2);
  assert.equal(trend[1].cycleExpense, 61200);
  assert.equal(trend[1].harvestedNuts, 1650);
  assert.equal(trend[1].cospPerNut, 37.09);

  // Unlogged cycles 3..6 return null cospPerNut
  assert.equal(trend[2].cospPerNut, null);
  assert.equal(trend[5].cospPerNut, null);
});

test('net loss and manual elapsed months override work accurately', () => {
  const state = createEmptyState(2026);
  state.harvests[1] = {
    cycle: 1,
    cropMonth: 4,
    harvestedNuts: 1000,
    soldNuts: 1000,
    spoiltNuts: 0,
    familyConsumptionNuts: 0,
    pricePerNut: 40,
    buyerType: 'local',
  };
  state.expenses.push({
    id: 'e1',
    date: '2026-04-01',
    cycle: 2,
    categoryId: 'fertilizer',
    amount: 60000,
    note: '',
    createdAt: 1,
  });

  const s1 = calculateCospSummary(state, 11);
  assert.equal(getCycleSalesIncome(state.harvests[1]), 40000);
  assert.equal(s1.netProfit, -20000);
  assert.equal(s1.isProfitable, false);
  assert.equal(s1.avgCospPerNut, 60);
  assert.equal(s1.avgSellingPricePerNut, 40);
  assert.equal(s1.effectiveElapsedMonths, 4);
  assert.equal(s1.avgMonthlyFamilyIncome, -5000);

  state.elapsedMonthsOverride = 10;
  const s2 = calculateCospSummary(state, 11);
  assert.equal(s2.effectiveElapsedMonths, 10);
  assert.equal(s2.avgMonthlyFamilyIncome, -2000);
});

test('weight-to-nut converter math matches specification', () => {
  assert.equal(nutsFromKg(750, 750), 1000);
  assert.equal(nutsFromKg(100, 750), 133); // Math.floor(100000 / 750) = 133
  assert.equal(kgFromNuts(1000, 750), 750);
  assert.equal(kgFromNuts(200, 800), 160);
});

test('mapDateToCycle maps months 1-12 into cycles 1-6', () => {
  assert.equal(mapDateToCycle('2026-01-15'), 1);
  assert.equal(mapDateToCycle('2026-02-28'), 1);
  assert.equal(mapDateToCycle('2026-03-01'), 2);
  assert.equal(mapDateToCycle('2026-06-15'), 3);
  assert.equal(mapDateToCycle('2026-12-20'), 6);
});

test('CSV export includes UTF-8 BOM, farmer identification, spoilt/family nuts, and Sinhala/English metrics', () => {
  const sample = createSampleState('si');
  const csv = generateCsvReport(sample);
  assert.equal(csv.startsWith('\uFEFF'), true);
  assert.ok(csv.includes('පොල් කැඩීම'));
  assert.ok(csv.includes('F-2026-0142'));
  assert.ok(csv.includes('077 458 2190'));
  assert.ok(csv.includes('169550.00'));
  assert.ok(csv.includes('178100.00'));
  assert.ok(csv.includes('නරක් වූ / ඉවත දැමූ ගෙඩි'));
  assert.ok(csv.includes('පවුලට හා හිතවතුන්ට'));
  assert.ok(csv.includes('150'));
  assert.ok(csv.includes('450'));
});

test('currency formatting uses en-LK and Sinhala prefix', () => {
  assert.equal(formatLkr(1250), 'රු. 1,250.00');
  assert.equal(formatLkr(-500), '-රු. 500.00');
});

test('legacy harvest records without spoilt/family fields default to 0 without NaN', () => {
  const legacyState = createEmptyState(2026);
  // Simulate an older persisted harvest object missing the new fields
  legacyState.harvests[1] = {
    cycle: 1,
    cropMonth: 2,
    harvestedNuts: 800,
    soldNuts: 600,
    pricePerNut: 70,
    buyerType: 'fairtrade',
  } as typeof legacyState.harvests[1];

  const summary = calculateCospSummary(legacyState, 11);
  assert.equal(summary.totalHarvestedNuts, 800);
  assert.equal(summary.totalSoldNuts, 600);
  assert.equal(summary.totalSpoiltNuts, 0);
  assert.equal(summary.totalFamilyConsumptionNuts, 0);
  assert.equal(summary.grandSalesIncome, 42000);
});
