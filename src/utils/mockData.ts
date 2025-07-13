import { TimesheetEntry } from '@/types/timesheet';

export const generateMockTimesheets = (): TimesheetEntry[] => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (startDate.getDay() * 4)); // Go back 4 weeks
  
  const mockEntries: TimesheetEntry[] = [];
  
  for (let i = 0; i < 5; i++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (i * 7));
    
    const weekNumber = i + 1;
    const hours = [40, 35, 0, 38, 25]; // Different hour amounts to test status logic
    
    mockEntries.push({
      id: `timesheet-${i + 1}`,
      weekNumber,
      startDate: weekStart,
      totalHours: hours[i],
      status: getStatusFromHours(hours[i]),
      description: i === 2 ? '' : `Week ${weekNumber} timesheet`,
      createdAt: new Date(weekStart.getTime() - 86400000), // Day before week start
      updatedAt: new Date(),
    });
  }
  
  return mockEntries.reverse(); // Show most recent first
};

export const getStatusFromHours = (hours: number): TimesheetEntry['status'] => {
  if (hours === 0) return 'missing';
  if (hours >= 40) return 'completed';
  return 'incomplete';
};

export const getWeekNumber = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

export const saveTimesheetsToStorage = (timesheets: TimesheetEntry[]) => {
  const serialized = timesheets.map(entry => ({
    ...entry,
    startDate: entry.startDate.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));
  localStorage.setItem('timetracker_timesheets', JSON.stringify(serialized));
};

export const loadTimesheetsFromStorage = (): TimesheetEntry[] => {
  const stored = localStorage.getItem('timetracker_timesheets');
  if (!stored) {
    return generateMockTimesheets();
  }
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((entry: any) => ({
      ...entry,
      startDate: new Date(entry.startDate),
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));
  } catch {
    return generateMockTimesheets();
  }
};