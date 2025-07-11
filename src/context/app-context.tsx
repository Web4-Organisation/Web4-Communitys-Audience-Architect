'use client';

import * as React from 'react';
import type { User, Segment } from '@/types';
import sampleUsersData from '@/data/sample-users.json';

interface AppContextType {
  users: User[];
  segments: Segment[];
  isLoading: boolean;
  addSegment: (segment: Omit<Segment, 'id'>) => void;
  updateSegment: (segment: Segment) => void;
  deleteSegment: (segmentId: string) => void;
  importUsers: (newUsers: User[]) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const initialSegments: Segment[] = [
    {
        id: '1',
        name: 'Power Users',
        rules: [
            { id: 'rule1', field: 'postCount', operator: '>', value: 30 },
            { id: 'rule2', field: 'isPro', operator: '=', value: true }
        ],
    },
    {
        id: '2',
        name: 'New Yorkers',
        rules: [
            { id: 'rule3', field: 'location', operator: '=', value: 'New York' }
        ],
    },
    {
        id: '3',
        name: 'Inactive London Users',
        rules: [
            { id: 'rule4', field: 'location', operator: '=', value: 'London' },
            { id: 'rule5', field: 'lastSeen', operator: '<', value: '2024-05-19' }
        ],
    }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [segments, setSegments] = React.useState<Segment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Load initial data on mount
    setUsers(sampleUsersData as User[]);
    setSegments(initialSegments);
    setIsLoading(false);
  }, []);

  const addSegment = (segmentData: Omit<Segment, 'id'>) => {
    const newSegment: Segment = {
      ...segmentData,
      id: new Date().toISOString(),
    };
    setSegments(prev => [...prev, newSegment]);
  };

  const updateSegment = (updatedSegment: Segment) => {
    setSegments(prev => prev.map(s => s.id === updatedSegment.id ? updatedSegment : s));
  };
  
  const deleteSegment = (segmentId: string) => {
    setSegments(prev => prev.filter(s => s.id !== segmentId));
  };

  const importUsers = (newUsers: User[]) => {
    // A real app might merge or validate, but here we'll just replace
    setUsers(newUsers);
  };

  const value = {
    users,
    segments,
    isLoading,
    addSegment,
    updateSegment,
    deleteSegment,
    importUsers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
