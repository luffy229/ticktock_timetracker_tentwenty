export interface TimesheetEntry {
  id: string;
  weekNumber: number;
  startDate: Date;
  totalHours: number;
  status: 'completed' | 'incomplete' | 'missing';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
