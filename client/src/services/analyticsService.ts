import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface VisitData {
  id?: string;
  timestamp: Timestamp;
  date: string; // YYYY-MM-DD format
  country: string;
  countryCode: string;
  ip: string;
  userAgent: string;
  page: string;
}

export interface CountryStats {
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  visits: VisitData[];
  totalVisits: number;
  countryStats: CountryStats[];
}

// Get user's IP and country information
export async function getVisitorInfo() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code
    };
  } catch (error) {
    console.error('Failed to get visitor info:', error);
    return {
      ip: 'unknown',
      country: 'Unknown',
      countryCode: 'XX'
    };
  }
}

// Record a visit
export async function recordVisit(page: string = '/') {
  try {
    const visitorInfo = await getVisitorInfo();
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const visitData: Omit<VisitData, 'id'> = {
      timestamp: Timestamp.fromDate(now),
      date: dateString,
      country: visitorInfo.country,
      countryCode: visitorInfo.countryCode,
      ip: visitorInfo.ip,
      userAgent: navigator.userAgent,
      page
    };

    await addDoc(collection(db, 'visits'), visitData);
  } catch (error) {
    console.error('Failed to record visit:', error);
  }
}

// Get analytics data for a specific date range
export async function getAnalyticsData(
  startDate: Date,
  endDate: Date
): Promise<AnalyticsData> {
  try {
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    const q = query(
      collection(db, 'visits'),
      where('date', '>=', startDateString),
      where('date', '<=', endDateString),
      orderBy('date'),
      orderBy('timestamp')
    );

    const querySnapshot = await getDocs(q);
    const visits: VisitData[] = [];

    querySnapshot.forEach((doc) => {
      visits.push({
        id: doc.id,
        ...doc.data()
      } as VisitData);
    });

    // Calculate country statistics
    const countryMap = new Map<string, { count: number; countryCode: string }>();
    
    visits.forEach(visit => {
      const existing = countryMap.get(visit.country) || { count: 0, countryCode: visit.countryCode };
      countryMap.set(visit.country, {
        count: existing.count + 1,
        countryCode: visit.countryCode
      });
    });

    const totalVisits = visits.length;
    const countryStats: CountryStats[] = Array.from(countryMap.entries())
      .map(([country, data]) => ({
        country,
        countryCode: data.countryCode,
        count: data.count,
        percentage: totalVisits > 0 ? (data.count / totalVisits) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      visits,
      totalVisits,
      countryStats
    };
  } catch (error) {
    console.error('Failed to get analytics data:', error);
    return {
      visits: [],
      totalVisits: 0,
      countryStats: []
    };
  }
}

// Helper function to get date ranges
export function getDateRange(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'daily':
      startDate.setDate(now.getDate() - 7); // Last 7 days
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 28); // Last 4 weeks
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 12); // Last 12 months
      break;
    case 'yearly':
      startDate.setFullYear(now.getFullYear() - 5); // Last 5 years
      break;
  }

  return { startDate, endDate: now };
}