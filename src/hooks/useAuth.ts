import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types/timesheet';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('timetracker_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo authentication
    if (email === 'demo@timetracker.com' && password === 'demo123') {
      const demoUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'demo@timetracker.com',
        avatar: ''
      };
      
      setUser(demoUser);
      localStorage.setItem('timetracker_user', JSON.stringify(demoUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('timetracker_user');
    localStorage.removeItem('timetracker_timesheets');
  };

  return {
    user,
    login,
    logout,
    isLoading
  };
};