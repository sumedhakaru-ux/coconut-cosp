import { CATEGORY_MAP, CYCLES, EXPENSE_CATEGORIES, MONTHS } from '../data/categories';
import type {
  CospAppState,
  CospSummary,
  CycleNumber,
  ExpenseCategoryId,
  HarvestCycleEntry,
  Language,
} from '../types/cosp';

export function getCycleSalesIncome(harvest: HarvestCycleEntry): number {
  const sold = Number.isFinite(harvest.soldNuts) ? Math.max(0, harvest.soldNuts) : 0;
  const price = Number.isFinite(harvest.pricePerNut) ? Math.max(0, harvest.pricePerNut) : 0;
  return sold * price;
}

export function calculateCospSummary(
  state: Pick<CospAppState, 'expenses' | 'harvests' | 'elapsedMonthsOverride'>,
  fallbackMonth = new Date().getMonth() + 1
): CospSummary {
  let totalHarvestedNuts = 0;
  let totalSoldNuts = 0;
  let totalSpoiltNuts = 0;
  let totalFamilyConsumptionNuts = 0;
  let grandSalesIncome = 0;
  let latestCropMonth = 0;
  let completedCyclesCount = 0;

  for (const c of CYCLES) {
    const h = state.harvests[c];
    if (!h) continue;
    const harvested = Math.max(0, Number(h.harvestedNuts) || 0);
    const sold = Math.max(0, Number(h.soldNuts) || 0);
    const spoilt = Math.max(0, Number(h.spoiltNuts) || 0);
    const family = Math.max(0, Number(h.familyConsumptionNuts) || 0);
    const price = Math.max(0, Number(h.pricePerNut) || 0);

    totalHarvestedNuts += harvested;
    totalSoldNuts += sold;
    totalSpoiltNuts += spoilt;
    totalFamilyConsumptionNuts += family;
    grandSalesIncome += sold * price;

    const hasAnyCycleNuts = harvested > 0 || sold > 0 || spoilt > 0 || family > 0;
    if (h.cropMonth !== null && h.cropMonth >= 1 && h.cropMonth <= 12) {
      if (h.cropMonth > latestCropMonth) {
        latestCropMonth = h.cropMonth;
      }
      if (hasAnyCycleNuts) {
        completedCyclesCount += 1;
      }
    } else if (hasAnyCycleNuts) {
      completedCyclesCount += 1;
    }
  }

  let grandExpense = 0;
  for (const exp of state.expenses) {
    grandExpense += Math.max(0, Number(exp.amount) || 0);
  }

  const avgCospPerNut = totalHarvestedNuts > 0 ? grandExpense / totalHarvestedNuts : 0;
  const avgSellingPricePerNut = totalSoldNuts > 0 ? grandSalesIncome / totalSoldNuts : 0;
  const netProfit = grandSalesIncome - grandExpense;
  const isProfitable = avgSellingPricePerNut >= avgCospPerNut;
  const marginPerNut = avgSellingPricePerNut - avgCospPerNut;

  const autoElapsedMonths =
    latestCropMonth > 0 ? latestCropMonth : Math.min(12, Math.max(1, fallbackMonth));

  const effectiveElapsedMonths =
    state.elapsedMonthsOverride !== null &&
    state.elapsedMonthsOverride >= 1 &&
    state.elapsedMonthsOverride <= 12
      ? state.elapsedMonthsOverride
      : autoElapsedMonths;

  const avgMonthlyFamilyIncome = netProfit / effectiveElapsedMonths;

  return {
    totalHarvestedNuts,
    totalSoldNuts,
    totalSpoiltNuts,
    totalFamilyConsumptionNuts,
    grandSalesIncome,
    grandExpense,
    avgCospPerNut,
    avgSellingPricePerNut,
    netProfit,
    isProfitable,
    marginPerNut,
    autoElapsedMonths,
    effectiveElapsedMonths,
    avgMonthlyFamilyIncome,
    completedCyclesCount,
  };
}

export function nutsFromKg(kg: number, avgWeightGrams = 750): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  if (!Number.isFinite(avgWeightGrams) || avgWeightGrams <= 0) return 0;
  return Math.floor((kg * 1000) / avgWeightGrams);
}

export function kgFromNuts(nuts: number, avgWeightGrams = 750): number {
  if (!Number.isFinite(nuts) || nuts <= 0) return 0;
  if (!Number.isFinite(avgWeightGrams) || avgWeightGrams <= 0) return 0;
  return (nuts * avgWeightGrams) / 1000;
}

export function formatLkr(amount: number, showDecimals = true): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const absFormatted = Math.abs(safe).toLocaleString('en-LK', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return safe < 0 ? `-රු. ${absFormatted}` : `රු. ${absFormatted}`;
}

export function formatLkrEnglish(amount: number, showDecimals = true): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const absFormatted = Math.abs(safe).toLocaleString('en-LK', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return safe < 0 ? `-Rs. ${absFormatted}` : `Rs. ${absFormatted}`;
}

export function formatCurrency(amount: number, lang: Language, showDecimals = true): string {
  return lang === 'si' ? formatLkr(amount, showDecimals) : formatLkrEnglish(amount, showDecimals);
}

export function formatCount(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('en-LK');
}

export function getMonthLabel(monthNum: number | null, lang: Language): string {
  if (!monthNum) return lang === 'si' ? 'නැත' : 'None';
  const found = MONTHS.find((m) => m.number === monthNum);
  return found ? (lang === 'si' ? found.si : found.en) : String(monthNum);
}

export function getExpenseMatrix(state: Pick<CospAppState, 'expenses'>): {
  byCategoryAndCycle: Record<ExpenseCategoryId, Record<CycleNumber, number>>;
  categoryTotals: Record<ExpenseCategoryId, number>;
  cycleTotals: Record<CycleNumber, number>;
} {
  const byCategoryAndCycle = {} as Record<ExpenseCategoryId, Record<CycleNumber, number>>;
  const categoryTotals = {} as Record<ExpenseCategoryId, number>;
  const cycleTotals: Record<CycleNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const cat of EXPENSE_CATEGORIES) {
    byCategoryAndCycle[cat.id] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    categoryTotals[cat.id] = 0;
  }

  for (const exp of state.expenses) {
    const amt = Math.max(0, Number(exp.amount) || 0);
    if (!byCategoryAndCycle[exp.categoryId]) continue;
    byCategoryAndCycle[exp.categoryId][exp.cycle] += amt;
    categoryTotals[exp.categoryId] += amt;
    cycleTotals[exp.cycle] += amt;
  }

  return { byCategoryAndCycle, categoryTotals, cycleTotals };
}

function csvCell(val: string | number): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function generateCsvReport(state: CospAppState): string {
  const summary = calculateCospSummary(state);
  const matrix = getExpenseMatrix(state);
  const lines: string[] = [];

  lines.push([csvCell('පොල් ගිණුම් පොත (Coconut COSP) - වාර්තාව'), csvCell(state.profile.year)].join(','));
  lines.push('');

  // Profile Section
  lines.push(csvCell('1. ගොවි සහ SPO විස්තර / Farmer & SPO Profile'));
  lines.push([csvCell('SPO නම / SPO Name'), csvCell(state.profile.spoName)].join(','));
  lines.push([csvCell('ස්ථානය / පොකුර / Location'), csvCell(state.profile.locationCluster)].join(','));
  lines.push([csvCell('ගොවියාගේ නම / Farmer Name'), csvCell(state.profile.farmerName)].join(','));
  lines.push([csvCell('ගොවි හැඳුනුම් අංකය / Farmer ID'), csvCell(state.profile.farmerId)].join(','));
  lines.push([csvCell('දුරකථන අංකය / Contact Mobile'), csvCell(state.profile.contactMobile)].join(','));
  lines.push([csvCell('වර්ෂය / Year'), csvCell(state.profile.year)].join(','));
  lines.push([csvCell('FLO ID'), csvCell(state.profile.floId)].join(','));
  lines.push([csvCell('සාමාජික අංකය / Member No'), csvCell(state.profile.memberNumber)].join(','));
  lines.push([csvCell('ඉඩම් ප්‍රමාණය (අක්කර) / Acres'), csvCell(state.profile.landSizeAcres)].join(','));
  lines.push([csvCell('ගෙඩි දරන ගස් / Bearing Trees'), csvCell(state.profile.bearingTrees)].join(','));
  lines.push('');

  // KPIs
  lines.push(csvCell('2. COSP ප්‍රධාන දර්ශක / COSP Key Indicators'));
  lines.push([csvCell('නෙළූ මුළු ගෙඩි / Total Harvested Nuts'), csvCell(summary.totalHarvestedNuts)].join(','));
  lines.push([csvCell('විකුණූ මුළු ගෙඩි / Total Sold Nuts'), csvCell(summary.totalSoldNuts)].join(','));
  lines.push([csvCell('නරක් වූ / ඉවත දැමූ ගෙඩි / Total Spoilt/Rejected Nuts'), csvCell(summary.totalSpoiltNuts)].join(','));
  lines.push([csvCell('පවුලේ පරිභෝජනයට හා හිතවතුන්ට / Family & Shared Nuts'), csvCell(summary.totalFamilyConsumptionNuts)].join(','));
  lines.push([csvCell('මුළු විකුණුම් ආදායම / Grand Sales Income (LKR)'), csvCell(summary.grandSalesIncome.toFixed(2))].join(','));
  lines.push([csvCell('මුළු වියදම / Grand Expense (LKR)'), csvCell(summary.grandExpense.toFixed(2))].join(','));
  lines.push([csvCell('සාමාන්‍ය නිෂ්පාදන පිරිවැය / Avg COSP per Nut (LKR)'), csvCell(summary.avgCospPerNut.toFixed(2))].join(','));
  lines.push([csvCell('සාමාන්‍ය ලැබුණු ගෙඩි මිල / Avg Selling Price per Nut (LKR)'), csvCell(summary.avgSellingPricePerNut.toFixed(2))].join(','));
  lines.push([csvCell('ශුද්ධ ලාභය / පාඩුව / Net Profit or Loss (LKR)'), csvCell(summary.netProfit.toFixed(2))].join(','));
  lines.push([csvCell('ගත වූ මාස / Elapsed Months'), csvCell(summary.effectiveElapsedMonths)].join(','));
  lines.push([csvCell('සාමාන්‍ය මාසික පවුල් ආදායම / Avg Monthly Family Income (LKR)'), csvCell(summary.avgMonthlyFamilyIncome.toFixed(2))].join(','));
  lines.push('');

  // 6-Cycle Harvest Table
  lines.push(csvCell('3. අස්වැන්න සහ විකුණුම් (වට 6) / 6-Cycle Harvest & Sales'));
  lines.push(
    [
      'වටය / Cycle',
      'භෝග මාසය / Crop Month',
      'නෙළූ ගෙඩි / Harvested',
      'විකුණූ ගෙඩි / Sold',
      'නරක් වූ / ඉවත දැමූ ගෙඩි / Spoilt',
      'පවුලට හා හිතවතුන්ට / Family & Shared',
      'ගෙඩියක මිල / Price (LKR)',
      'මුළු ආදායම / Sales Income (LKR)',
      'ගැනුම්කරු / Buyer',
    ]
      .map(csvCell)
      .join(',')
  );

  for (const c of CYCLES) {
    const h = state.harvests[c];
    const income = getCycleSalesIncome(h);
    lines.push(
      [
        `වටය ${c} (Cycle ${c})`,
        h.cropMonth ? `${getMonthLabel(h.cropMonth, 'si')} (${getMonthLabel(h.cropMonth, 'en')})` : '-',
        h.harvestedNuts,
        h.soldNuts,
        Math.max(0, Number(h.spoiltNuts) || 0),
        Math.max(0, Number(h.familyConsumptionNuts) || 0),
        h.pricePerNut.toFixed(2),
        income.toFixed(2),
        h.buyerType,
      ]
        .map(csvCell)
        .join(',')
    );
  }
  lines.push('');

  // 16x6 Expense Matrix
  lines.push(csvCell('4. වියදම් විස්තරය (කාණ්ඩ 16 x වට 6) / Expense Matrix'));
  lines.push(
    [
      'වියදම් වර්ගය (Sinhala)',
      'Category (English)',
      'වටය 1',
      'වටය 2',
      'වටය 3',
      'වටය 4',
      'වටය 5',
      'වටය 6',
      'මුළු එකතුව / Total (LKR)',
    ]
      .map(csvCell)
      .join(',')
  );

  for (const cat of EXPENSE_CATEGORIES) {
    const row = matrix.byCategoryAndCycle[cat.id];
    lines.push(
      [
        cat.si,
        cat.en,
        row[1].toFixed(2),
        row[2].toFixed(2),
        row[3].toFixed(2),
        row[4].toFixed(2),
        row[5].toFixed(2),
        row[6].toFixed(2),
        matrix.categoryTotals[cat.id].toFixed(2),
      ]
        .map(csvCell)
        .join(',')
    );
  }

  lines.push(
    [
      'මුළු වියදම් එකතුව',
      'Grand Expense Total',
      matrix.cycleTotals[1].toFixed(2),
      matrix.cycleTotals[2].toFixed(2),
      matrix.cycleTotals[3].toFixed(2),
      matrix.cycleTotals[4].toFixed(2),
      matrix.cycleTotals[5].toFixed(2),
      matrix.cycleTotals[6].toFixed(2),
      summary.grandExpense.toFixed(2),
    ]
      .map(csvCell)
      .join(',')
  );

  // UTF-8 BOM for Microsoft Excel Sinhala support
  return '\uFEFF' + lines.join('\r\n');
}

export function generateWhatsAppSummary(state: CospAppState): string {
  const s = calculateCospSummary(state);
  const lang = state.language;
  const p = state.profile;
  const statusLine =
    s.totalHarvestedNuts === 0 && s.totalSoldNuts === 0
      ? lang === 'si'
        ? 'දත්ත තවම සම්පූර්ණ නැත'
        : 'Pending harvest data'
      : s.isProfitable
      ? lang === 'si'
        ? `✅ ලාභදායීයි (ගෙඩියකින් ${formatLkr(s.marginPerNut)} ලාභයි)`
        : `✅ Profitable (${formatLkrEnglish(s.marginPerNut)}/nut profit)`
      : lang === 'si'
      ? `⚠️ අවදානමක් (පිරිවැයට වඩා ${formatLkr(Math.abs(s.marginPerNut))} අඩුයි)`
      : `⚠️ At Risk (${formatLkrEnglish(Math.abs(s.marginPerNut))}/nut below COSP)`;

  if (lang === 'si') {
    return [
      `🌴 *පොල් ගිණුම් පොත (Coconut COSP) - ${p.year}*`,
      p.farmerName ? `ගොවියා: ${p.farmerName}` : '',
      p.farmerId ? `ගොවි හැඳුනුම් අංකය: ${p.farmerId}` : '',
      p.contactMobile ? `දුරකථන: ${p.contactMobile}` : '',
      p.spoName ? `SPO: ${p.spoName}` : '',
      p.floId || p.memberNumber ? `FLO ID: ${p.floId || '-'} | සාමාජික: ${p.memberNumber || '-'}` : '',
      '',
      `📊 *ප්‍රධාන දත්ත (වට ${s.completedCyclesCount}/6)*`,
      `• නෙළූ ගෙඩි: ${formatCount(s.totalHarvestedNuts)} | විකුණූ: ${formatCount(s.totalSoldNuts)}`,
      `• නරක් වූ / ඉවත දැමූ: ${formatCount(s.totalSpoiltNuts)} | පවුලට / හිතවතුන්ට: ${formatCount(s.totalFamilyConsumptionNuts)}`,
      `• මුළු වියදම: ${formatLkr(s.grandExpense)}`,
      `• මුළු විකුණුම්: ${formatLkr(s.grandSalesIncome)}`,
      `• සාමාන්‍ය නිෂ්පාදන පිරිවැය (COSP): *${formatLkr(s.avgCospPerNut)}*`,
      `• සාමාන්‍ය ගෙඩි මිල: *${formatLkr(s.avgSellingPricePerNut)}*`,
      `• ${s.netProfit >= 0 ? 'ශුද්ධ ලාභය' : 'ශුද්ධ පාඩුව'}: ${formatLkr(s.netProfit)}`,
      `• මාසික පවුල් ආදායම (මාස ${s.effectiveElapsedMonths}): ${formatLkr(s.avgMonthlyFamilyIncome)}`,
      '',
      statusLine,
    ]
      .filter((l) => l !== '')
      .join('\n');
  }

  return [
    `🌴 *Coconut COSP Report - ${p.year}*`,
    p.farmerName ? `Farmer: ${p.farmerName}` : '',
    p.farmerId ? `Farmer ID: ${p.farmerId}` : '',
    p.contactMobile ? `Mobile: ${p.contactMobile}` : '',
    p.spoName ? `SPO: ${p.spoName}` : '',
    p.floId || p.memberNumber ? `FLO ID: ${p.floId || '-'} | Member: ${p.memberNumber || '-'}` : '',
    '',
    `📊 *Key Metrics (${s.completedCyclesCount}/6 Cycles)*`,
    `• Harvested: ${formatCount(s.totalHarvestedNuts)} | Sold: ${formatCount(s.totalSoldNuts)}`,
    `• Spoilt/Rejected: ${formatCount(s.totalSpoiltNuts)} | Family/Shared: ${formatCount(s.totalFamilyConsumptionNuts)}`,
    `• Grand Expense: ${formatLkrEnglish(s.grandExpense)}`,
    `• Grand Sales: ${formatLkrEnglish(s.grandSalesIncome)}`,
    `• Avg COSP / Nut: *${formatLkrEnglish(s.avgCospPerNut)}*`,
    `• Avg Selling Price: *${formatLkrEnglish(s.avgSellingPricePerNut)}*`,
    `• ${s.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}: ${formatLkrEnglish(s.netProfit)}`,
    `• Monthly Family Income (${s.effectiveElapsedMonths} mos): ${formatLkrEnglish(s.avgMonthlyFamilyIncome)}`,
    '',
    statusLine,
  ]
    .filter((l) => l !== '')
    .join('\n');
}

export function getCategoryLabel(categoryId: ExpenseCategoryId, lang: Language): string {
  const cat = CATEGORY_MAP[categoryId];
  return cat ? (lang === 'si' ? cat.si : cat.en) : categoryId;
}

export interface CycleCospPoint {
  cycle: CycleNumber;
  shortLabel: string;
  fullLabel: string;
  monthLabel: string;
  cycleExpense: number;
  harvestedNuts: number;
  cospPerNut: number | null;
  sellingPricePerNut: number | null;
}

export function calculateCycleCospTrend(
  state: Pick<CospAppState, 'expenses' | 'harvests'>,
  lang: Language
): CycleCospPoint[] {
  const matrix = getExpenseMatrix(state);

  return CYCLES.map((c) => {
    const h = state.harvests[c];
    const cycleExpense = matrix.cycleTotals[c] ?? 0;
    const harvestedNuts = h ? Math.max(0, Number(h.harvestedNuts) || 0) : 0;
    const soldNuts = h ? Math.max(0, Number(h.soldNuts) || 0) : 0;
    const pricePerNut = h ? Math.max(0, Number(h.pricePerNut) || 0) : 0;

    const cospPerNut =
      harvestedNuts > 0 ? Math.round((cycleExpense / harvestedNuts) * 100) / 100 : null;
    const sellingPricePerNut =
      soldNuts > 0 && pricePerNut > 0 ? Math.round(pricePerNut * 100) / 100 : null;

    const monthLabel = h?.cropMonth ? getMonthLabel(h.cropMonth, lang) : '';
    const shortLabel = lang === 'si' ? `ව${c}` : `C${c}`;
    const cycleTitle = lang === 'si' ? `වටය ${c}` : `Cycle ${c}`;
    const fullLabel = monthLabel ? `${cycleTitle} (${monthLabel})` : cycleTitle;

    return {
      cycle: c,
      shortLabel,
      fullLabel,
      monthLabel,
      cycleExpense,
      harvestedNuts,
      cospPerNut,
      sellingPricePerNut,
    };
  });
}

