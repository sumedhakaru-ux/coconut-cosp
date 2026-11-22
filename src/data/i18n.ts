import type { Language } from '../types/cosp';

export interface Translations {
  appName: string;
  appShortSubtitle: string;
  nav: {
    home: string;
    expenses: string;
    harvest: string;
    profile: string;
  };
  offlineBanner: string;
  installApp: string;
  installIos: string;
  installIosTitle: string;
  installIosStep1: string;
  installIosStep2: string;
  close: string;
  home: {
    heroTitle: string;
    myCosp: string;
    avgSellingPrice: string;
    profitableBadge: (profitPerNut: string) => string;
    lossRiskBadge: (lossPerNut: string) => string;
    emptyHeroHint: string;
    kpiAvgCosp: string;
    kpiAvgPrice: string;
    kpiNetProfit: string;
    kpiNetLoss: string;
    kpiMonthlyIncome: string;
    elapsedMonthsLabel: (months: number, isManual: boolean) => string;
    elapsedAuto: string;
    elapsedMonthsSelect: string;
    quickAddExpense: string;
    quickAddHarvest: string;
    progressTitle: string;
    cyclesCompleted: (count: number) => string;
    nutsHarvested: string;
    nutsSold: string;
    nutsSpoilt: string;
    nutsFamily: string;
    totalExpenses: string;
    totalSales: string;
    nutsUnit: string;
    perNutUnit: string;
    loadSampleHint: string;
    trendTitle: string;
    trendSubtitle: string;
    trendEmpty: string;
    trendAvgSellingLine: string;
    trendCostPerNutLegend: string;
    trendCycleExpenses: string;
    trendHarvestedNuts: string;
    trendDownMsg: (prevCycle: number, currCycle: number, diff: string) => string;
    trendUpMsg: (prevCycle: number, currCycle: number, diff: string) => string;
    trendSteadyMsg: (cycle: number) => string;
    idCardTitle: string;
    idCardSubtitle: string;
    idEditBtn: string;
    idDoneBtn: string;
    idFarmerName: string;
    idFarmerId: string;
    idContactMobile: string;
    idSpoName: string;
    idNotSet: string;
  };
  expenses: {
    title: string;
    subtitle: string;
    scanReceiptBtn: string;
    scanningReceipt: string;
    scanSuccess: string;
    scanOfflineError: string;
    scanErrorPrefix: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    dateLabel: string;
    cycleLabel: string;
    cycleOption: (c: number) => string;
    amountLabel: string;
    amountPlaceholder: string;
    customCategoryLabel: string;
    customCategoryPlaceholder: string;
    noteLabel: string;
    notePlaceholder: string;
    saveExpense: string;
    updateExpense: string;
    cancelEdit: string;
    editingBanner: string;
    historyTitle: string;
    viewTimeline: string;
    viewCycleSummary: string;
    noExpensesYet: string;
    noExpensesHint: string;
    totalForCycle: string;
    noExpensesInCycle: string;
    editBtn: string;
    deleteBtn: string;
    validationAmount: string;
    validationOtherText: string;
    savedToast: string;
  };
  harvest: {
    title: string;
    subtitle: string;
    cycleCardTitle: (c: number) => string;
    notLogged: string;
    tapToRecord: string;
    cropMonth: string;
    selectMonth: string;
    harvestedNuts: string;
    soldNuts: string;
    spoiltNuts: string;
    familyConsumptionNuts: string;
    spoiltShort: string;
    familyShort: string;
    nutBreakdownTitle: string;
    accountedNuts: string;
    remainingUnaccounted: string;
    overAccountedHint: string;
    pricePerNut: string;
    buyerType: string;
    buyerFairtrade: string;
    buyerLocal: string;
    buyerOther: string;
    totalCycleIncome: string;
    saveCycle: string;
    clearCycle: string;
    converterBtn: string;
    converterTitle: string;
    converterSubtitle: string;
    kgLabel: string;
    avgWeightLabel: string;
    nutsResultLabel: string;
    applyToFieldLabel: string;
    applyToHarvested: string;
    applyToSold: string;
    useThisNumber: string;
    validationMonth: string;
    validationNuts: string;
  };
  profile: {
    title: string;
    subtitle: string;
    spoName: string;
    locationCluster: string;
    farmerName: string;
    farmerId: string;
    contactMobile: string;
    year: string;
    floId: string;
    memberNumber: string;
    landSizeAcres: string;
    bearingTrees: string;
    autoSavedNote: string;
    exportSectionTitle: string;
    downloadCsv: string;
    printSummary: string;
    summaryModalTitle: string;
    copyWhatsapp: string;
    copiedWhatsapp: string;
    printNow: string;
    trainingDataTitle: string;
    loadSampleBtn: string;
    sampleLoadedMsg: string;
    clearAllBtn: string;
    clearConfirmTitle: string;
    clearConfirmBody: string;
    clearConfirmYes: string;
    cancel: string;
    clearedMsg: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  si: {
    appName: 'පොල් ගිණුම් පොත',
    appShortSubtitle: 'Coconut COSP',
    nav: {
      home: 'මුල් පිටුව',
      expenses: 'වියදම්',
      harvest: 'අස්වැන්න',
      profile: 'ගිණුම',
    },
    offlineBanner: 'අන්තර්ජාලය නොමැත — දත්ත දුරකථනයේ සුරැකේ',
    installApp: 'App එක දාගන්න',
    installIos: 'iPhone හි ස්ථාපනය',
    installIosTitle: 'iPhone / iPad මත ස්ථාපනය කරන්න',
    installIosStep1: '1. Safari යට ඇති Share (බෙදාගන්න) බොත්තම ඔබන්න.',
    installIosStep2: '2. පහළට ගොස් "Add to Home Screen" තෝරන්න.',
    close: 'වසන්න',
    home: {
      heroTitle: 'මගේ පොල් නිශ්පාදනයේ තත්ත්වය',
      myCosp: 'සාමාන්‍ය නිෂ්පාදන පිරිවැය',
      avgSellingPrice: 'සාමාන්‍ය ලැබුණු ගෙඩි මිල',
      profitableBadge: (p) => `ලාභදායීයි — ගෙඩියකින් රු. ${p} ලාභයි`,
      lossRiskBadge: (l) => `අවදානමක් — නිෂ්පාදන පිරිවැයට වඩා රු. ${l} අඩුවෙන් විකුණයි`,
      emptyHeroHint: 'ඔබේ පළමු වියදම හෝ අස්වැන්න ඇතුළත් කර ගෙඩියක නිෂ්පාදන පිරිවැය බලන්න.',
      kpiAvgCosp: 'සාමාන්‍ය නිෂ්පාදන පිරිවැය',
      kpiAvgPrice: 'සාමාන්‍ය ලැබුණු ගෙඩි මිල',
      kpiNetProfit: 'ශුද්ධ ලාභය',
      kpiNetLoss: 'ශුද්ධ පාඩුව',
      kpiMonthlyIncome: 'සාමාන්‍ය මාසික පවුල් ආදායම',
      elapsedMonthsLabel: (m, isManual) =>
        isManual ? `මාස ${m} කට (තෝරාගත්)` : `මාස ${m} කට (ස්වයංක්‍රීය)`,
      elapsedAuto: 'ස්වයංක්‍රීය',
      elapsedMonthsSelect: 'ගත වූ මාස ගණන',
      quickAddExpense: '+ වියදමක් ඇතුළත් කරන්න',
      quickAddHarvest: '+ අස්වැන්න / විකුණුම ඇතුළත් කරන්න',
      progressTitle: 'වාර්ෂික අස්වැන්න ප්‍රගතිය',
      cyclesCompleted: (c) => `වට ${c} / 6 සම්පූර්ණයි`,
      nutsHarvested: 'නෙළූ මුළු ගෙඩි',
      nutsSold: 'විකුණූ මුළු ගෙඩි',
      nutsSpoilt: 'නරක් වූ / ඉවත දැමූ ගෙඩි',
      nutsFamily: 'පවුලට / හිතවතුන්ට තැබූ ගෙඩි',
      totalExpenses: 'මුළු වියදම',
      totalSales: 'මුළු විකුණුම් ආදායම',
      nutsUnit: 'ගෙඩි',
      perNutUnit: 'ගෙඩියකට',
      loadSampleHint: 'පුහුණු දත්ත (නියැදි දත්ත) ගිණුම පිටුවෙන් පූරණය කළ හැක.',
      trendTitle: 'වට 6 තුළ නිෂ්පාදන පිරිවැය වෙනස්වීම',
      trendSubtitle: 'අස්වැන්න වට අනුව ගෙඩියක නිෂ්පාදන පිරිවැය (රු.)',
      trendEmpty: 'වට අනුව පිරිවැය රේඛීය ප්‍රස්තාරය බැලීමට අවම වශයෙන් අස්වැන්න වට 1 ක් ඇතුළත් කරන්න.',
      trendAvgSellingLine: 'සාමාන්‍ය විකුණුම් මිල',
      trendCostPerNutLegend: 'ගෙඩියක පිරිවැය (COSP)',
      trendCycleExpenses: 'වටයේ වියදම',
      trendHarvestedNuts: 'නෙළූ ගෙඩි',
      trendDownMsg: (prev, curr, diff) =>
        `වටය ${prev} ට වඩා වටය ${curr} හි ගෙඩියක පිරිවැය රු. ${diff} කින් අඩු වී ඇත`,
      trendUpMsg: (prev, curr, diff) =>
        `වටය ${prev} ට වඩා වටය ${curr} හි ගෙඩියක පිරිවැය රු. ${diff} කින් වැඩි වී ඇත`,
      trendSteadyMsg: (c) => `වටය ${c} හි නිෂ්පාදන පිරිවැය සටහන් කර ඇත`,
      idCardTitle: 'ගොවි හඳුනාගැනීමේ විස්තර',
      idCardSubtitle: 'සාධාරණ පොල් මිලක් සාකච්ඡා කිරීම සඳහා ඔබේ අනන්‍යතාවය',
      idEditBtn: 'වෙනස් කරන්න',
      idDoneBtn: 'සුරකින්න',
      idFarmerName: 'ගොවියාගේ නම',
      idFarmerId: 'ගොවි හැඳුනුම් අංකය (Farmer ID)',
      idContactMobile: 'දුරකථන අංකය',
      idSpoName: 'ගොවි සංවිධානයේ නම',
      idNotSet: 'ඇතුළත් කර නැත',
    },
    expenses: {
      title: 'වියදම් සටහන් කිරීම',
      subtitle: 'පහසු පියවර 3 කින් මාසික වියදම් ඇතුළත් කරන්න',
      scanReceiptBtn: '📷 බිල්පතේ ඡායාරූපයක් ගන්න',
      scanningReceipt: 'බිල්පත කියවමින් පවතී...',
      scanSuccess: 'බිල්පතේ විස්තර පිරවී ඇත — පරීක්ෂා කර සුරකින්න!',
      scanOfflineError: 'බිල්පත් ඡායාරූප කියවීමට අන්තර්ජාල සබඳතාව අවශ්‍ය වේ. කරුණාකර අතින් ඇතුළත් කරන්න.',
      scanErrorPrefix: 'බිල්පත කියවීම අසාර්ථකයි: ',
      step1Title: '1. දිනය සහ අස්වැන්න වටය තෝරන්න',
      step2Title: '2. වියදම් වර්ගය තෝරන්න (කාණ්ඩ 16)',
      step3Title: '3. මුදල (රු.) සහ සටහන ඇතුළත් කරන්න',
      dateLabel: 'දිනය',
      cycleLabel: 'අස්වැන්න වටය',
      cycleOption: (c) => `වටය ${c}`,
      amountLabel: 'වියදම් මුදල (රු.)',
      amountPlaceholder: '0.00',
      customCategoryLabel: 'වෙනත් වියදම් විස්තරය',
      customCategoryPlaceholder: 'උදා: ජල බිල්පත / උපකරණ අලුත්වැඩියාව',
      noteLabel: 'අමතර සටහන (අවශ්‍ය නම් පමණි)',
      notePlaceholder: 'උදා: කම්කරු 2 දෙනෙක්',
      saveExpense: 'වියදම සුරකින්න',
      updateExpense: 'වියදම යාවත්කාලීන කරන්න',
      cancelEdit: 'අවලංගු කරන්න',
      editingBanner: 'තෝරාගත් වියදම සංස්කරණය කරමින් පවතී',
      historyTitle: 'සටහන් කළ වියදම්',
      viewTimeline: 'මාසික ලැයිස්තුව',
      viewCycleSummary: 'වට අනුව සාරාංශය',
      noExpensesYet: 'තවමත් වියදම් ඇතුළත් කර නොමැත',
      noExpensesHint: 'ඉහත පියවර 3 භාවිතයෙන් ඔබේ පළමු වියදම සටහන් කරන්න.',
      totalForCycle: 'වටයේ මුළු වියදම',
      noExpensesInCycle: 'මෙම වටය සඳහා වියදම් නොමැත',
      editBtn: 'සංස්කරණය',
      deleteBtn: 'මකන්න',
      validationAmount: 'කරුණාකර 0 ට වැඩි වියදම් මුදලක් ඇතුළත් කරන්න.',
      validationOtherText: 'කරුණාකර "වෙනත්" වියදම් විස්තරය සඳහන් කරන්න.',
      savedToast: 'වියදම සාර්ථකව සුරැකිණි!',
    },
    harvest: {
      title: 'අස්වැන්න සහ විකුණුම් (වට 6)',
      subtitle: 'දින 45–60 කට වරක් නෙළන වාර්ෂික වට 6 සටහන් කරන්න',
      cycleCardTitle: (c) => `වටය ${c}`,
      notLogged: 'තවම සටහන් කර නැත',
      tapToRecord: 'ඇතුළත් කිරීමට ඔබන්න',
      cropMonth: 'භෝග මාසය',
      selectMonth: 'මාසය තෝරන්න',
      harvestedNuts: 'නෙළූ පොල් ගෙඩි ගණන',
      soldNuts: 'විකුණූ පොල් ගෙඩි ගණන',
      spoiltNuts: 'නරක් වූ / ඉවත දැමූ ගෙඩි ගණන',
      familyConsumptionNuts: 'පවුලේ පරිභෝජනයට / අසල්වැසියන්ට, හිතවතුන්ට හා ඥාතීන්ට තැබූ ගෙඩි',
      spoiltShort: 'නරක් වූ / ඉවත දැමූ',
      familyShort: 'පවුලට / හිතවතුන්ට',
      nutBreakdownTitle: 'අස්වැන්න බෙදී යාමේ සාරාංශය',
      accountedNuts: 'සටහන් කළ එකතුව (විකුණූ + නරක් වූ + පවුලට)',
      remainingUnaccounted: 'තවත් ඉතිරි / සටහන් නොකළ ගෙඩි',
      overAccountedHint: 'සටහන් කළ ගෙඩි එකතුව නෙළූ මුළු ගෙඩි ගණනට වඩා වැඩිය — කරුණාකර පරීක්ෂා කරන්න.',
      pricePerNut: 'ගෙඩියක් සඳහා මිල - රු.',
      buyerType: 'ගැනුම්කරු වර්ගය (අවශ්‍ය නම්)',
      buyerFairtrade: 'Fairtrade සැකසුම්කරු',
      buyerLocal: 'දේශීය වෙළෙන්දා',
      buyerOther: 'වෙනත්',
      totalCycleIncome: 'මුළු විකුණුම් ආදායම',
      saveCycle: 'අස්වැන්න සුරකින්න',
      clearCycle: 'මෙම වටයේ දත්ත ඉවත් කරන්න',
      converterBtn: '🥥 කිලෝ ↔ ගෙඩි පරිවර්තකය',
      converterTitle: 'කිලෝ ↔ ගෙඩි පරිවර්තකය',
      converterSubtitle: 'කිලෝග්‍රෑම් බර අනුව පොල් ගෙඩි ගණන පහසුවෙන් ගණනය කරන්න',
      kgLabel: 'මුළු බර (කිලෝග්‍රෑම් - kg)',
      avgWeightLabel: 'සාමාන්‍ය කොපු ගැලවූ ගෙඩියක බර (ග්‍රෑම් - g)',
      nutsResultLabel: 'ගණනය කළ ගෙඩි ගණන',
      applyToFieldLabel: 'මෙම ගණන යෙදිය යුත්තේ:',
      applyToHarvested: 'නෙළූ ගෙඩි ගණනට',
      applyToSold: 'විකුණූ ගෙඩි ගණනට',
      useThisNumber: 'මෙම අගය යොදන්න',
      validationMonth: 'කරුණාකර භෝග මාසය තෝරන්න.',
      validationNuts: 'කරුණාකර නෙළූ හෝ විකුණූ ගෙඩි ගණන ඇතුළත් කරන්න.',
    },
    profile: {
      title: 'ගොවි ගිණුම සහ වාර්තා',
      subtitle: 'වසරකට වරක් ඔබේ ගොවි සහ SPO විස්තර සටහන් කරන්න',
      spoName: 'SPO ආයතනයේ නම (SPO)',
      locationCluster: 'ස්ථානය / පොකුර',
      farmerName: 'ගොවියාගේ නම',
      farmerId: 'ගොවි හැඳුනුම් අංකය (Farmer ID)',
      contactMobile: 'දුරකථන අංකය (Mobile)',
      year: 'වර්ෂය',
      floId: 'FLO ID අංකය',
      memberNumber: 'සාමාජික අංකය',
      landSizeAcres: 'පොල් ඉඩම් ප්‍රමාණය (අක්කර)',
      bearingTrees: 'ගෙඩි දරන ගස් ගණන',
      autoSavedNote: 'සියලුම දත්ත අන්තර්ජාලය නොමැතිව වුවද දුරකථනයේ ස්වයංක්‍රීයව සුරැකේ.',
      exportSectionTitle: 'SPO වාර්තා සහ බෙදාගැනීම',
      downloadCsv: 'Excel / CSV වාර්තාව බාගන්න',
      printSummary: 'මුද්‍රණය / WhatsApp සාරාංශය',
      summaryModalTitle: 'COSP වාර්ෂික / අර්ධ-වාර්ෂික සාරාංශය',
      copyWhatsapp: 'WhatsApp සඳහා පිටපත් කරන්න',
      copiedWhatsapp: 'පිටපත් කරන ලදී!',
      printNow: 'මුද්‍රණය කරන්න (Print)',
      trainingDataTitle: 'පුහුණු සැසි සහ දත්ත කළමනාකරණය',
      loadSampleBtn: 'නියැදි දත්ත පූරණය කරන්න',
      sampleLoadedMsg: 'නියැදි දත්ත සාර්ථකව පූරණය විය!',
      clearAllBtn: 'සියලු දත්ත හිස් කරන්න',
      clearConfirmTitle: 'සියලුම දත්ත මකා දමන්නද?',
      clearConfirmBody: 'ඔබ විසින් ඇතුළත් කළ සියලුම වියදම්, අස්වැන්න සහ ගොවි විස්තර ස්ථිරවම ඉවත් වනු ඇත.',
      clearConfirmYes: 'ඔව්, දත්ත හිස් කරන්න',
      cancel: 'අවලංගු කරන්න',
      clearedMsg: 'සියලු දත්ත ඉවත් කරන ලදී.',
    },
  },
  en: {
    appName: 'Coconut COSP',
    appShortSubtitle: 'පොල් ගිණුම් පොත',
    nav: {
      home: 'Home',
      expenses: 'Expenses',
      harvest: 'Harvest',
      profile: 'Profile',
    },
    offlineBanner: 'Offline Mode — Data is saved on this device',
    installApp: 'Install App',
    installIos: 'Install on iOS',
    installIosTitle: 'Install on iPhone / iPad',
    installIosStep1: '1. Tap the Share button in Safari toolbar.',
    installIosStep2: '2. Scroll down and tap "Add to Home Screen".',
    close: 'Close',
    home: {
      heroTitle: 'My Coconut Farm Status',
      myCosp: 'My COSP per Nut',
      avgSellingPrice: 'Avg Selling Price',
      profitableBadge: (p) => `Profitable — Rs. ${p} profit per nut`,
      lossRiskBadge: (l) => `At Risk — Selling Rs. ${l} below production cost`,
      emptyHeroHint: 'Log your first expense or harvest cycle to calculate your Cost of Production per coconut.',
      kpiAvgCosp: 'Avg COSP / Nut',
      kpiAvgPrice: 'Avg Price / Nut',
      kpiNetProfit: 'Net Profit',
      kpiNetLoss: 'Net Loss',
      kpiMonthlyIncome: 'Avg Monthly Family Income',
      elapsedMonthsLabel: (m, isManual) =>
        isManual ? `Over ${m} months (manual)` : `Over ${m} months (auto)`,
      elapsedAuto: 'Auto',
      elapsedMonthsSelect: 'Elapsed Months',
      quickAddExpense: '+ Add Expense',
      quickAddHarvest: '+ Add Harvest & Sale',
      progressTitle: 'Annual Harvest Progress',
      cyclesCompleted: (c) => `${c} / 6 Cycles Logged`,
      nutsHarvested: 'Total Harvested',
      nutsSold: 'Total Sold',
      nutsSpoilt: 'Spoilt / Rejected',
      nutsFamily: 'Family / Shared',
      totalExpenses: 'Total Expenses',
      totalSales: 'Grand Sales Income',
      nutsUnit: 'nuts',
      perNutUnit: 'per nut',
      loadSampleHint: 'You can load training sample data from the Profile tab.',
      trendTitle: 'Cost of Production Trend (6 Cycles)',
      trendSubtitle: 'Cost per harvested coconut (Rs.) across plucking cycles',
      trendEmpty: 'Record at least 1 harvest cycle to see your Cost of Production per Nut trend line.',
      trendAvgSellingLine: 'Avg Selling Price',
      trendCostPerNutLegend: 'Cost per Nut (COSP)',
      trendCycleExpenses: 'Cycle Expense',
      trendHarvestedNuts: 'Harvested Nuts',
      trendDownMsg: (prev, curr, diff) =>
        `Cost per nut decreased by Rs. ${diff} in Cycle ${curr} vs Cycle ${prev}`,
      trendUpMsg: (prev, curr, diff) =>
        `Cost per nut increased by Rs. ${diff} in Cycle ${curr} vs Cycle ${prev}`,
      trendSteadyMsg: (c) => `Cycle ${c} production cost plotted`,
      idCardTitle: 'Farmer Identification',
      idCardSubtitle: 'Details for fair coconut price negotiation',
      idEditBtn: 'Edit',
      idDoneBtn: 'Done',
      idFarmerName: 'Farmer Name',
      idFarmerId: 'Farmer ID',
      idContactMobile: 'Contact Mobile Number',
      idSpoName: 'SPO Name',
      idNotSet: 'Not set',
    },
    expenses: {
      title: 'Monthly Expenses',
      subtitle: 'Log farm costs in 3 simple steps',
      scanReceiptBtn: '📷 Take Photo of Receipt / Bill',
      scanningReceipt: 'Reading receipt with AI...',
      scanSuccess: 'Receipt details filled — please review and save!',
      scanOfflineError: 'Internet connection is needed to scan receipts. Please enter manually.',
      scanErrorPrefix: 'Could not read receipt: ',
      step1Title: '1. Select Date & Harvest Cycle',
      step2Title: '2. Pick Expense Category (16 COSP Categories)',
      step3Title: '3. Enter Amount (LKR) & Note',
      dateLabel: 'Date',
      cycleLabel: 'Harvest Cycle',
      cycleOption: (c) => `Cycle ${c}`,
      amountLabel: 'Amount (Rs.)',
      amountPlaceholder: '0.00',
      customCategoryLabel: 'Custom Expense Description',
      customCategoryPlaceholder: 'e.g., Water pump repair',
      noteLabel: 'Optional Note',
      notePlaceholder: 'e.g., 2 workers for 1 day',
      saveExpense: 'Save Expense',
      updateExpense: 'Update Expense',
      cancelEdit: 'Cancel',
      editingBanner: 'Editing selected expense entry',
      historyTitle: 'Expense History',
      viewTimeline: 'Monthly Timeline',
      viewCycleSummary: 'Cycle Breakdown',
      noExpensesYet: 'No expenses logged yet',
      noExpensesHint: 'Use the 3-step card above to record your first farm expense.',
      totalForCycle: 'Cycle Total',
      noExpensesInCycle: 'No expenses recorded in this cycle',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      validationAmount: 'Please enter an amount greater than 0.',
      validationOtherText: 'Please type a description for "Other".',
      savedToast: 'Expense saved!',
    },
    harvest: {
      title: 'Harvest & Sales (6 Cycles)',
      subtitle: 'Track your 6 annual 45–60 day plucking cycles',
      cycleCardTitle: (c) => `Cycle ${c}`,
      notLogged: 'Not logged yet',
      tapToRecord: 'Tap to record',
      cropMonth: 'Crop Month',
      selectMonth: 'Select month',
      harvestedNuts: 'Harvested Nuts',
      soldNuts: 'Sold Nuts',
      spoiltNuts: 'Spoilt / Rejected Nuts',
      familyConsumptionNuts: 'Retained for Family / Shared (Neighbours, Friends & Relatives)',
      spoiltShort: 'Spoilt / Rejected',
      familyShort: 'Family & Shared',
      nutBreakdownTitle: 'Nut Disposition Summary',
      accountedNuts: 'Accounted Total (Sold + Spoilt + Family/Shared)',
      remainingUnaccounted: 'Remaining / Unallocated',
      overAccountedHint: 'Accounted total exceeds harvested nuts — please verify.',
      pricePerNut: 'Price per Nut (Rs.)',
      buyerType: 'Buyer Type (Optional)',
      buyerFairtrade: 'Fairtrade Processor',
      buyerLocal: 'Local Collector',
      buyerOther: 'Other',
      totalCycleIncome: 'Cycle Sales Income',
      saveCycle: 'Save Harvest Cycle',
      clearCycle: 'Clear Cycle Data',
      converterBtn: '🥥 kg ↔ Nuts Converter',
      converterTitle: 'Weight-to-Nut Converter',
      converterSubtitle: 'Convert dehusked coconut weight (kg) to nut count',
      kgLabel: 'Total Weight (kg)',
      avgWeightLabel: 'Avg Dehusked Nut Weight (grams)',
      nutsResultLabel: 'Calculated Nut Count',
      applyToFieldLabel: 'Copy value into:',
      applyToHarvested: 'Harvested Nuts',
      applyToSold: 'Sold Nuts',
      useThisNumber: 'Use this number',
      validationMonth: 'Please select a Crop Month.',
      validationNuts: 'Please enter harvested or sold nuts.',
    },
    profile: {
      title: 'Profile & SPO Export',
      subtitle: 'Store your Fairtrade & Organic farm details once per year',
      spoName: 'SPO Name',
      locationCluster: 'Location / Cluster',
      farmerName: 'Farmer Name',
      farmerId: 'Farmer ID',
      contactMobile: 'Contact Mobile Number',
      year: 'Year',
      floId: 'FLO ID',
      memberNumber: 'Member Number',
      landSizeAcres: 'Coconut Land Size (Acres)',
      bearingTrees: 'Number of Bearing Trees',
      autoSavedNote: 'All records auto-save locally to your phone and work offline.',
      exportSectionTitle: 'Export & SPO Reporting',
      downloadCsv: 'Download Excel / CSV Report',
      printSummary: 'Printable / WhatsApp Summary',
      summaryModalTitle: 'Coconut COSP Summary Card',
      copyWhatsapp: 'Copy WhatsApp Summary',
      copiedWhatsapp: 'Copied to clipboard!',
      printNow: 'Print Report',
      trainingDataTitle: 'Training & Data Management',
      loadSampleBtn: 'Load Sample Data',
      sampleLoadedMsg: 'Sample training dataset loaded!',
      clearAllBtn: 'Clear All Data',
      clearConfirmTitle: 'Clear all farm records?',
      clearConfirmBody: 'This will permanently delete all expenses, harvest cycles, and profile details saved on this device.',
      clearConfirmYes: 'Yes, Clear All Data',
      cancel: 'Cancel',
      clearedMsg: 'All records cleared.',
    },
  },
};
