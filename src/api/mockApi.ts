import { TimesheetEntry } from "@/types/timesheet";

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "demo@timetracker.com",
  avatar: "/api/placeholder/32/32"
};

// Mock timesheet data
const mockTimesheets: TimesheetEntry[] = [
  {
    id: "timesheet-1",
    weekNumber: 48,
    startDate: new Date('2024-11-25'),
    totalHours: 40,
    status: 'completed',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25')
  },
  {
    id: "timesheet-2", 
    weekNumber: 47,
    startDate: new Date('2024-11-18'),
    totalHours: 35,
    status: 'incomplete',
    createdAt: new Date('2024-11-18'),
    updatedAt: new Date('2024-11-18')
  },
  {
    id: "timesheet-3",
    weekNumber: 46,
    startDate: new Date('2024-11-11'),
    totalHours: 40,
    status: 'completed',
    createdAt: new Date('2024-11-11'),
    updatedAt: new Date('2024-11-11')
  },
  {
    id: "timesheet-4",
    weekNumber: 45,
    startDate: new Date('2024-11-04'),
    totalHours: 0,
    status: 'missing',
    createdAt: new Date('2024-11-04'),
    updatedAt: new Date('2024-11-04')
  },
  {
    id: "timesheet-5",
    weekNumber: 44,
    startDate: new Date('2024-10-28'),
    totalHours: 42,
    status: 'completed',
    createdAt: new Date('2024-10-28'),
    updatedAt: new Date('2024-10-28')
  }
];

// API Functions

export const authApi = {
  // Login user
  login: async (email: string, password: string) => {
    await delay(1000); // Simulate network delay
    
    if (email === "demo@timetracker.com" && password === "demo123") {
      return {
        success: true,
        user: mockUser,
        token: "mock-jwt-token"
      };
    }
    
    throw new Error("Invalid credentials");
  },

  // Get current user
  getCurrentUser: async () => {
    await delay(500);
    return mockUser;
  },

  // Logout user  
  logout: async () => {
    await delay(300);
    return { success: true };
  }
};

export const timesheetApi = {
  // Get all timesheets
  getTimesheets: async (): Promise<TimesheetEntry[]> => {
    await delay(800);
    return [...mockTimesheets].sort((a, b) => b.weekNumber - a.weekNumber);
  },

  // Get single timesheet by ID
  getTimesheet: async (id: string): Promise<TimesheetEntry | null> => {
    await delay(500);
    return mockTimesheets.find(t => t.id === id) || null;
  },

  // Create new timesheet
  createTimesheet: async (data: Omit<TimesheetEntry, 'id'>): Promise<TimesheetEntry> => {
    await delay(1000);
    
    const newTimesheet: TimesheetEntry = {
      ...data,
      id: `timesheet-${Date.now()}`
    };
    
    mockTimesheets.push(newTimesheet);
    return newTimesheet;
  },

  // Update existing timesheet
  updateTimesheet: async (id: string, data: Partial<TimesheetEntry>): Promise<TimesheetEntry> => {
    await delay(800);
    
    const index = mockTimesheets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error("Timesheet not found");
    }
    
    mockTimesheets[index] = { ...mockTimesheets[index], ...data };
    return mockTimesheets[index];
  },

  // Delete timesheet
  deleteTimesheet: async (id: string): Promise<void> => {
    await delay(600);
    
    const index = mockTimesheets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error("Timesheet not found");
    }
    
    mockTimesheets.splice(index, 1);
  }
};

export const taskApi = {
  // Get tasks for a specific timesheet
  getTasks: async (timesheetId: string) => {
    await delay(600);
    
    // Mock task data for demonstration
    return [
      {
        id: `task-${timesheetId}-1`,
        project: "homepage-dev",
        workType: "feature-development",
        description: "Homepage Development",
        hours: 8,
        date: new Date(),
        timesheetId
      },
      {
        id: `task-${timesheetId}-2`, 
        project: "mobile-app",
        workType: "bug-fixes",
        description: "Bug fixes and testing",
        hours: 2,
        date: new Date(),
        timesheetId
      }
    ];
  },

  // Create new task
  createTask: async (taskData: {
    project: string;
    workType: string;
    description: string;
    hours: number;
    timesheetId: string;
    date: Date;
  }) => {
    await delay(800);
    
    return {
      id: `task-${Date.now()}`,
      ...taskData
    };
  },

  // Update task
  updateTask: async (taskId: string, updates: any) => {
    await delay(500);
    
    // Mock update response
    return {
      id: taskId,
      ...updates
    };
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    await delay(400);
    return { success: true };
  }
};
