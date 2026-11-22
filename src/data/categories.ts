import type {
  CycleNumber,
  ExpenseCategoryDef,
  ExpenseCategoryId,
  ExpenseGroupDef,
} from '../types/cosp';

export const EXPENSE_GROUPS: ExpenseGroupDef[] = [
  {
    id: 'harvest_transport',
    si: 'අස්වැන්න සහ ප්‍රවාහනය',
    en: 'Harvest & Transport',
  },
  {
    id: 'field_fertilizer',
    si: 'ඉඩම් සහ පොහොර',
    en: 'Field Care & Fertilizer',
  },
  {
    id: 'protection_soil',
    si: 'ආරක්ෂාව සහ සංරක්ෂණය',
    en: 'Protection & Soil',
  },
  {
    id: 'labor_other',
    si: 'ශ්‍රමය සහ වෙනත්',
    en: 'Labor & Other',
  },
];

export const EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
  // Group 1: Harvest & Transport
  {
    id: 'plucking',
    groupId: 'harvest_transport',
    si: 'පොල් කැඩීම',
    en: 'Plucking',
    iconName: 'TreePalm',
  },
  {
    id: 'dehusking',
    groupId: 'harvest_transport',
    si: 'පොල් ලෙලි ගැසීම',
    en: 'Dehusking',
    iconName: 'Axe',
  },
  {
    id: 'collecting_piling',
    groupId: 'harvest_transport',
    si: 'පොල් ගෙඩි එකතු කිරීම / ගොඩ ගැසීම',
    en: 'Collecting / Piling',
    iconName: 'Layers',
  },
  {
    id: 'transport',
    groupId: 'harvest_transport',
    si: 'ප්‍රවාහනය',
    en: 'Transport',
    iconName: 'Truck',
  },

  // Group 2: Field Care & Fertilizer
  {
    id: 'land_clearing',
    groupId: 'field_fertilizer',
    si: 'ඉඩම පිරිසිදු කිරීම',
    en: 'Land clearing',
    iconName: 'Scissors',
  },
  {
    id: 'seedlings_transport',
    groupId: 'field_fertilizer',
    si: 'පැළ මිලදී ගැනීම සහ ප්‍රවාහනය',
    en: 'Seedlings & transport',
    iconName: 'Sprout',
  },
  {
    id: 'pit_drainage',
    groupId: 'field_fertilizer',
    si: 'වළ කැණීම, ජලාපවහන කැපීම/පිරිසිදු කිරීම',
    en: 'Pit digging & drainage',
    iconName: 'Shovel',
  },
  {
    id: 'infilling_vacancies',
    groupId: 'field_fertilizer',
    si: 'පොල් ඉඩමේ හිස් ස්ථාන පිරවීම',
    en: 'Infilling vacancies',
    iconName: 'Trees',
  },
  {
    id: 'weeding',
    groupId: 'field_fertilizer',
    si: 'වල් නෙළීම / වල් පැළෑටි කළමනාකරණය',
    en: 'Weeding',
    iconName: 'Leaf',
  },
  {
    id: 'fertilizer',
    groupId: 'field_fertilizer',
    si: 'පොහොර මිලදී ගැනීම / සකස් කිරීම / යෙදීම',
    en: 'Fertilizer',
    iconName: 'PackagePlus',
  },

  // Group 3: Protection & Soil
  {
    id: 'soil_moisture',
    groupId: 'protection_soil',
    si: 'පස තෙතමනය සංරක්ෂණය කිරීම',
    en: 'Soil moisture conservation',
    iconName: 'Droplets',
  },
  {
    id: 'fencing_maintenance',
    groupId: 'protection_soil',
    si: 'වැට / වැට නඩත්තුව',
    en: 'Fencing & maintenance',
    iconName: 'Fence',
  },
  {
    id: 'wildlife_protection',
    groupId: 'protection_soil',
    si: 'වන සතුන්ගෙන් ආරක්ෂා කිරීම',
    en: 'Wildlife protection',
    iconName: 'ShieldAlert',
  },
  {
    id: 'pest_disease_control',
    groupId: 'protection_soil',
    si: 'පළිබෝධ සහ රෝග පාලනය',
    en: 'Pest & disease control',
    iconName: 'BugOff',
  },

  // Group 4: Labor & Other
  {
    id: 'family_labor',
    groupId: 'labor_other',
    si: 'ගොවියා / පවුලේ කම්කරුවන්',
    en: 'Farmer / family labor',
    iconName: 'Users',
  },
  {
    id: 'other',
    groupId: 'labor_other',
    si: 'වෙනත්',
    en: 'Other',
    iconName: 'FileText',
  },
];

export const CATEGORY_MAP: Record<ExpenseCategoryId, ExpenseCategoryDef> = EXPENSE_CATEGORIES.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<ExpenseCategoryId, ExpenseCategoryDef>
);

export const MONTHS: { number: number; si: string; en: string }[] = [
  { number: 1, si: 'ජනවාරි', en: 'January' },
  { number: 2, si: 'පෙබරවාරි', en: 'February' },
  { number: 3, si: 'මාර්තු', en: 'March' },
  { number: 4, si: 'අප්‍රේල්', en: 'April' },
  { number: 5, si: 'මැයි', en: 'May' },
  { number: 6, si: 'ජූනි', en: 'June' },
  { number: 7, si: 'ජූලි', en: 'July' },
  { number: 8, si: 'අගෝස්තු', en: 'August' },
  { number: 9, si: 'සැප්තැම්බර්', en: 'September' },
  { number: 10, si: 'ඔක්තෝබර්', en: 'October' },
  { number: 11, si: 'නොවැම්බර්', en: 'November' },
  { number: 12, si: 'දෙසැම්බර්', en: 'December' },
];

export const CYCLES: CycleNumber[] = [1, 2, 3, 4, 5, 6];

export function mapDateToCycle(dateStr: string): CycleNumber {
  const parts = dateStr.split('-');
  const month = parts.length >= 2 ? Number(parts[1]) : new Date().getMonth() + 1;
  if (!Number.isFinite(month) || month < 1 || month > 12) return 1;
  const cycle = Math.ceil(month / 2);
  return Math.min(6, Math.max(1, cycle)) as CycleNumber;
}
