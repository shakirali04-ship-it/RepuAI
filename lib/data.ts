export const LOCATIONS = [
  { id: 'banjara', name: 'Banjara Hills', city: 'Hyderabad' },
  { id: 'jubilee', name: 'Jubilee Hills', city: 'Hyderabad' },
  { id: 'secunderabad', name: 'Secunderabad', city: 'Hyderabad' },
  { id: 'kukatpally', name: 'Kukatpally', city: 'Hyderabad' },
  { id: 'warangal', name: 'Warangal', city: 'Warangal' },
];

export const BUSINESS_UNITS = [
  { id: 'arena', name: 'Arena Sales', color: '#1E6FE8', bg: 'rgba(30,111,232,0.12)', icon: '🚗' },
  { id: 'nexa', name: 'Nexa Sales', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', icon: '✨' },
  { id: 'service', name: 'Service', color: '#F97316', bg: 'rgba(249,115,22,0.12)', icon: '🔧' },
  { id: 'truevalue', name: 'True Value', color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: '♻️' },
];

export const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

export const POSITIVE_CATEGORIES = [
  { id: 'sales_experience', label: 'Sales Experience', bUs: ['arena', 'nexa'] },
  { id: 'car_display', label: 'Car Display / Showroom', bUs: ['arena', 'nexa'] },
  { id: 'delivery_quality', label: 'Delivery Quality', bUs: ['arena', 'nexa', 'truevalue'] },
  { id: 'advisor_behavior', label: 'Advisor Helpfulness', bUs: ['arena', 'nexa', 'service', 'truevalue'] },
  { id: 'service_quality', label: 'Service / Repair Quality', bUs: ['service'] },
  { id: 'turnaround_time', label: 'Quick Turnaround', bUs: ['service'] },
  { id: 'pricing_value', label: 'Fair Pricing / Value', bUs: ['arena', 'nexa', 'service', 'truevalue'] },
  { id: 'follow_up', label: 'After-sales Follow-up', bUs: ['arena', 'nexa', 'service'] },
];

export const NEGATIVE_CATEGORIES = [
  { id: 'parking', label: 'Parking Issues', bUs: ['arena', 'nexa', 'service', 'truevalue'] },
  { id: 'cleanliness', label: 'Cleanliness', bUs: ['arena', 'nexa', 'service', 'truevalue'] },
  { id: 'receptionist', label: 'Reception / Greeting', bUs: ['arena', 'nexa', 'service', 'truevalue'] },
  { id: 'waiting_time', label: 'Long Waiting Time', bUs: ['service', 'arena', 'nexa'] },
  { id: 'billing', label: 'Billing Transparency', bUs: ['service', 'arena', 'nexa', 'truevalue'] },
  { id: 'fake_promises', label: 'Unfulfilled Promises', bUs: ['arena', 'nexa'] },
  { id: 'delivery_delay', label: 'Delivery Delays', bUs: ['arena', 'nexa', 'truevalue'] },
  { id: 'repeat_repair', label: 'Repeat Repairs', bUs: ['service'] },
];

function rng(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

export interface MonthData {
  month: string;
  totalReviews: number;
  avgRating: number;
  positive: number;
  negative: number;
  positiveBreakdown: Record<string, number>;
  negativeBreakdown: Record<string, number>;
}

export interface LocationBUData {
  locationId: string;
  buId: string;
  months: MonthData[];
  advisors: AdvisorData[];
}

export interface AdvisorData {
  name: string;
  role: string;
  buId: string;
  locationId: string;
  mentions: number;
  positivePct: number;
  negativePct: number;
  tags: string[];
  trend: number;
  escalated: boolean;
}

function generateMonthData(locIdx: number, buIdx: number, monthIdx: number): MonthData {
  const seed = locIdx * 1000 + buIdx * 100 + monthIdx * 10;
  const total = rng(seed + 1, 40, 180);
  const positivePct = rng(seed + 2, 45, 85);
  const positive = Math.round(total * positivePct / 100);
  const negative = total - positive;
  const posCats = POSITIVE_CATEGORIES.filter(c => c.bUs.includes(BUSINESS_UNITS[buIdx].id));
  const negCats = NEGATIVE_CATEGORIES.filter(c => c.bUs.includes(BUSINESS_UNITS[buIdx].id));
  const posBreakdown: Record<string, number> = {};
  let rem = positive;
  posCats.forEach((c, i) => {
    const v = i === posCats.length - 1 ? rem : rng(seed + 10 + i, 1, Math.max(1, Math.floor(rem / (posCats.length - i))));
    posBreakdown[c.id] = Math.min(v, rem); rem = Math.max(0, rem - posBreakdown[c.id]);
  });
  const negBreakdown: Record<string, number> = {};
  let remN = negative;
  negCats.forEach((c, i) => {
    const v = i === negCats.length - 1 ? remN : rng(seed + 20 + i, 1, Math.max(1, Math.floor(remN / (negCats.length - i))));
    negBreakdown[c.id] = Math.min(v, remN); remN = Math.max(0, remN - negBreakdown[c.id]);
  });
  return { month: MONTHS[monthIdx], totalReviews: total, avgRating: parseFloat((rng(seed + 3, 30, 50) / 10).toFixed(1)), positive, negative, positiveBreakdown: posBreakdown, negativeBreakdown: negBreakdown };
}

const ADVISOR_NAMES: Record<string, string[]> = {
  arena: ['Arjun Joshi', 'Priya Sharma', 'Kiran Reddy', 'Suresh Babu', 'Divya Nair'],
  nexa: ['Rahul Kapoor', 'Ananya Mehta', 'Vijay Kumar', 'Sneha Patel', 'Aakash Singh'],
  service: ['Suresh Kumar', 'Ravi Lakshman', 'Meena Devi', 'Prasad T', 'Gopal Rao'],
  truevalue: ['Ramesh Ch', 'Lakshmi V', 'Naresh M', 'Sunita B', 'Vinod R'],
};
const POS_TAGS = ['Honest', 'Patient', 'Helpful', 'On-time', 'Clear explanation', 'No pressure'];
const NEG_TAGS = ['Dismissive', 'Billing dispute', 'Delayed', 'Fake promises', 'Rude'];

function generateAdvisors(locIdx: number, buIdx: number): AdvisorData[] {
  const bu = BUSINESS_UNITS[buIdx];
  return (ADVISOR_NAMES[bu.id] || []).map((name, i) => {
    const seed = locIdx * 500 + buIdx * 50 + i * 7;
    const posPct = rng(seed + 1, 18, 95);
    const mentions = rng(seed + 2, 5, 38);
    const trend = rng(seed + 3, -15, 20);
    const tags = posPct > 70
      ? [POS_TAGS[rng(seed + 4, 0, POS_TAGS.length - 1)], POS_TAGS[rng(seed + 5, 0, POS_TAGS.length - 1)]]
      : [NEG_TAGS[rng(seed + 4, 0, NEG_TAGS.length - 1)]];
    return { name, role: bu.name, buId: bu.id, locationId: LOCATIONS[locIdx].id, mentions, positivePct: posPct, negativePct: 100 - posPct, tags: [...new Set(tags)], trend, escalated: posPct < 35 && mentions > 5 };
  });
}

export const ALL_DATA: LocationBUData[] = [];
LOCATIONS.forEach((loc, locIdx) => {
  BUSINESS_UNITS.forEach((bu, buIdx) => {
    ALL_DATA.push({ locationId: loc.id, buId: bu.id, months: MONTHS.map((_, mIdx) => generateMonthData(locIdx, buIdx, mIdx)), advisors: generateAdvisors(locIdx, buIdx) });
  });
});

export function getFilteredData(locationId: string, buId: string) {
  return ALL_DATA.filter(d => (locationId === 'all' || d.locationId === locationId) && (buId === 'all' || d.buId === buId));
}

export function aggregateMonths(data: LocationBUData[]): MonthData[] {
  return MONTHS.map((month, mIdx) => {
    const all = data.map(d => d.months[mIdx]);
    const totalReviews = all.reduce((s, m) => s + m.totalReviews, 0);
    const positive = all.reduce((s, m) => s + m.positive, 0);
    const negative = all.reduce((s, m) => s + m.negative, 0);
    const avgRating = all.length ? parseFloat((all.reduce((s, m) => s + m.avgRating, 0) / all.length).toFixed(1)) : 0;
    const positiveBreakdown: Record<string, number> = {};
    const negativeBreakdown: Record<string, number> = {};
    POSITIVE_CATEGORIES.forEach(c => { positiveBreakdown[c.id] = all.reduce((s, m) => s + (m.positiveBreakdown[c.id] || 0), 0); });
    NEGATIVE_CATEGORIES.forEach(c => { negativeBreakdown[c.id] = all.reduce((s, m) => s + (m.negativeBreakdown[c.id] || 0), 0); });
    return { month, totalReviews, positive, negative, avgRating, positiveBreakdown, negativeBreakdown };
  });
}

export function getAllAdvisors(locationId: string, buId: string): AdvisorData[] {
  return getFilteredData(locationId, buId).flatMap(d => d.advisors);
}

export function getOverallStats() {
  const all = aggregateMonths(ALL_DATA);
  const current = all[all.length - 1];
  const prev = all[all.length - 2];
  const totalReviews = ALL_DATA.reduce((s, d) => s + d.months.reduce((ss, m) => ss + m.totalReviews, 0), 0);
  const allAdvisors = ALL_DATA.flatMap(d => d.advisors);
  const escalated = allAdvisors.filter(a => a.escalated).length;
  return { current, prev, totalReviews, escalated, allAdvisors };
}
