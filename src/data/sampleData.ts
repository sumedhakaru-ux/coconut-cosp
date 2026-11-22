import type { CospAppState, CycleNumber, HarvestCycleEntry } from '../types/cosp';

export function createEmptyHarvests(): Record<CycleNumber, HarvestCycleEntry> {
  return {
    1: { cycle: 1, cropMonth: null, harvestedNuts: 0, soldNuts: 0, spoiltNuts: 0, familyConsumptionNuts: 0, pricePerNut: 0, buyerType: 'fairtrade' },
    2: { cycle: 2, cropMonth: null, harvestedNuts: 0, soldNuts: 0, spoiltNuts: 0, familyConsumptionNuts: 0, pricePerNut: 0, buyerType: 'fairtrade' },
    3: { cycle: 3, cropMonth: null, harvestedNuts: 0, soldNuts: 0, spoiltNuts: 0, familyConsumptionNuts: 0, pricePerNut: 0, buyerType: 'fairtrade' },
    4: { cycle: 4, cropMonth: null, harvestedNuts: 0, soldNuts: 0, spoiltNuts: 0, familyConsumptionNuts: 0, pricePerNut: 0, buyerType: 'fairtrade' },
    5: { cycle: 5, cropMonth: null, harvestedNuts: 0, soldNuts: 0, spoiltNuts: 0, familyConsumptionNuts: 0, pricePerNut: 0, buyerType: 'fairtrade' },
    6: { cycle: 6, cropMonth: null, harvestedNuts: 0, soldNuts: 0, spoiltNuts: 0, familyConsumptionNuts: 0, pricePerNut: 0, buyerType: 'fairtrade' },
  };
}

export function createEmptyState(year = new Date().getFullYear()): CospAppState {
  return {
    language: 'si',
    profile: {
      spoName: '',
      locationCluster: '',
      farmerName: '',
      farmerId: '',
      contactMobile: '',
      year,
      floId: '',
      memberNumber: '',
      landSizeAcres: '',
      bearingTrees: '',
    },
    expenses: [],
    harvests: createEmptyHarvests(),
    elapsedMonthsOverride: null,
  };
}

export function createSampleState(language: 'si' | 'en' = 'si'): CospAppState {
  const year = new Date().getFullYear();
  const harvests = createEmptyHarvests();
  harvests[1] = {
    cycle: 1,
    cropMonth: 3, // මාර්තු
    harvestedNuts: 1700,
    soldNuts: 1100,
    spoiltNuts: 150,
    familyConsumptionNuts: 450,
    pricePerNut: 91,
    buyerType: 'fairtrade',
  };
  harvests[2] = {
    cycle: 2,
    cropMonth: 6, // ජූනි
    harvestedNuts: 1650,
    soldNuts: 1200,
    spoiltNuts: 100,
    familyConsumptionNuts: 350,
    pricePerNut: 65,
    buyerType: 'fairtrade',
  };

  return {
    language,
    profile: {
      spoName: 'Wayamba Organic Coconut Producers SPO',
      locationCluster: 'Kuliyapitiya / Cluster 04',
      farmerName: 'K.M. Bandara',
      farmerId: 'F-2026-0142',
      contactMobile: '077 458 2190',
      year,
      floId: 'FLO-41298',
      memberNumber: 'WOC-0142',
      landSizeAcres: '3',
      bearingTrees: '150',
    },
    harvests,
    elapsedMonthsOverride: null,
    expenses: [
      // Cycle 1 (March)
      { id: 'sample-1-1', date: `${year}-03-04`, cycle: 1, categoryId: 'land_clearing', amount: 6000, note: 'වටය 1 - ඉඩම පිරිසිදු කිරීම', createdAt: 101 },
      { id: 'sample-1-2', date: `${year}-03-06`, cycle: 1, categoryId: 'pit_drainage', amount: 9000, note: 'කාණු පිරිසිදු කිරීම', createdAt: 102 },
      { id: 'sample-1-3', date: `${year}-03-09`, cycle: 1, categoryId: 'weeding', amount: 7500, note: 'වල් නෙළීම', createdAt: 103 },
      { id: 'sample-1-4', date: `${year}-03-11`, cycle: 1, categoryId: 'fertilizer', amount: 16000, note: 'කාබනික පොහොර යෙදීම', createdAt: 104 },
      { id: 'sample-1-5', date: `${year}-03-12`, cycle: 1, categoryId: 'soil_moisture', amount: 6000, note: 'පොල් ලෙලි දැමීම', createdAt: 105 },
      { id: 'sample-1-6', date: `${year}-03-14`, cycle: 1, categoryId: 'fencing_maintenance', amount: 8000, note: 'වැට අලුත්වැඩියාව', createdAt: 106 },
      { id: 'sample-1-7', date: `${year}-03-15`, cycle: 1, categoryId: 'wildlife_protection', amount: 3500, note: 'වන සතුන් පාලනය', createdAt: 107 },
      { id: 'sample-1-8', date: `${year}-03-20`, cycle: 1, categoryId: 'plucking', amount: 22500, note: 'ගස් නැගීම හා කැඩීම', createdAt: 108 },
      { id: 'sample-1-9', date: `${year}-03-21`, cycle: 1, categoryId: 'dehusking', amount: 3850, note: 'පොල් ලෙලි ගැසීම', createdAt: 109 },
      { id: 'sample-1-10', date: `${year}-03-21`, cycle: 1, categoryId: 'collecting_piling', amount: 8000, note: 'එකතු කිරීම', createdAt: 110 },
      { id: 'sample-1-11', date: `${year}-03-22`, cycle: 1, categoryId: 'transport', amount: 3000, note: 'ප්‍රවාහන ගාස්තු', createdAt: 111 },
      { id: 'sample-1-12', date: `${year}-03-22`, cycle: 1, categoryId: 'family_labor', amount: 15000, note: 'පවුලේ ශ්‍රමය', createdAt: 112 },

      // Cycle 2 (June)
      { id: 'sample-2-1', date: `${year}-06-05`, cycle: 2, categoryId: 'land_clearing', amount: 3000, note: 'වටය 2 - ඉඩම පිරිසිදු කිරීම', createdAt: 201 },
      { id: 'sample-2-2', date: `${year}-06-08`, cycle: 2, categoryId: 'soil_moisture', amount: 3000, note: 'තෙතමනය සංරක්ෂණය', createdAt: 202 },
      { id: 'sample-2-3', date: `${year}-06-10`, cycle: 2, categoryId: 'fencing_maintenance', amount: 2500, note: 'වැට නඩත්තුව', createdAt: 203 },
      { id: 'sample-2-4', date: `${year}-06-12`, cycle: 2, categoryId: 'wildlife_protection', amount: 3500, note: 'වන සතුන්ගෙන් ආරක්ෂාව', createdAt: 204 },
      { id: 'sample-2-5', date: `${year}-06-18`, cycle: 2, categoryId: 'plucking', amount: 24000, note: 'වටය 2 පොල් කැඩීම', createdAt: 205 },
      { id: 'sample-2-6', date: `${year}-06-19`, cycle: 2, categoryId: 'dehusking', amount: 4200, note: 'පොල් ලෙලි ගැසීම', createdAt: 206 },
      { id: 'sample-2-7', date: `${year}-06-19`, cycle: 2, categoryId: 'collecting_piling', amount: 8000, note: 'ගොඩ ගැසීම', createdAt: 207 },
      { id: 'sample-2-8', date: `${year}-06-20`, cycle: 2, categoryId: 'transport', amount: 3000, note: 'ප්‍රවාහනය', createdAt: 208 },
      { id: 'sample-2-9', date: `${year}-06-20`, cycle: 2, categoryId: 'family_labor', amount: 10000, note: 'පවුලේ ශ්‍රමය', createdAt: 209 },
    ],
  };
}
