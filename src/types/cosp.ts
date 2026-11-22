export type Language = 'si' | 'en';

export type TabKey = 'home' | 'expenses' | 'harvest' | 'profile';

export type CycleNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type BuyerType = 'fairtrade' | 'local' | 'other';

export type ExpenseGroupId =
  | 'harvest_transport'
  | 'field_fertilizer'
  | 'protection_soil'
  | 'labor_other';

export type ExpenseCategoryId =
  | 'plucking'
  | 'dehusking'
  | 'collecting_piling'
  | 'transport'
  | 'land_clearing'
  | 'seedlings_transport'
  | 'pit_drainage'
  | 'infilling_vacancies'
  | 'weeding'
  | 'fertilizer'
  | 'soil_moisture'
  | 'fencing_maintenance'
  | 'wildlife_protection'
  | 'pest_disease_control'
  | 'family_labor'
  | 'other';

export interface ExpenseCategoryDef {
  id: ExpenseCategoryId;
  groupId: ExpenseGroupId;
  si: string;
  en: string;
  iconName: string;
}

export interface ExpenseGroupDef {
  id: ExpenseGroupId;
  si: string;
  en: string;
}

export interface FarmerProfile {
  spoName: string;
  locationCluster: string;
  farmerName: string;
  farmerId: string;
  contactMobile: string;
  year: number;
  floId: string;
  memberNumber: string;
  landSizeAcres: string;
  bearingTrees: string;
}

export interface ExpenseEntry {
  id: string;
  date: string; // YYYY-MM-DD
  cycle: CycleNumber;
  categoryId: ExpenseCategoryId;
  amount: number;
  note: string;
  customCategoryNote?: string;
  createdAt: number;
}

export interface HarvestCycleEntry {
  cycle: CycleNumber;
  cropMonth: number | null; // 1..12 or null if not logged
  harvestedNuts: number;
  soldNuts: number;
  spoiltNuts: number;
  familyConsumptionNuts: number;
  pricePerNut: number;
  buyerType: BuyerType;
}

export interface CospAppState {
  language: Language;
  profile: FarmerProfile;
  expenses: ExpenseEntry[];
  harvests: Record<CycleNumber, HarvestCycleEntry>;
  elapsedMonthsOverride: number | null;
}

export interface CospSummary {
  totalHarvestedNuts: number;
  totalSoldNuts: number;
  totalSpoiltNuts: number;
  totalFamilyConsumptionNuts: number;
  grandSalesIncome: number;
  grandExpense: number;
  avgCospPerNut: number;
  avgSellingPricePerNut: number;
  netProfit: number;
  isProfitable: boolean;
  marginPerNut: number;
  autoElapsedMonths: number;
  effectiveElapsedMonths: number;
  avgMonthlyFamilyIncome: number;
  completedCyclesCount: number;
}

export interface ReceiptScanResult {
  amount: number;
  date: string;
  categoryId: ExpenseCategoryId;
  note: string;
}
