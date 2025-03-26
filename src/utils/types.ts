
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'executive';
}

export interface Executive {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  performance: number;
  status: 'online' | 'offline' | 'away';
  totalCalls: number;
  resolvedCalls: number;
  averageHandlingTime: number;
  satisfactionScore: number;
}

export interface Call {
  id: string;
  executiveId: string;
  customerId: string;
  customerName: string;
  timestamp: string;
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  topic: string;
  resolved: boolean;
  notes?: string;
}

export interface DashboardStats {
  totalCalls: number;
  resolvedCalls: number;
  averageHandlingTime: number;
  satisfactionScore: number;
  callsToday: number;
  onlineExecutives: number;
  pendingCalls: number;
  callsTrend: number[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface ExecutiveStats {
  executiveId: string;
  name: string;
  totalCalls: number;
  callsByMonth: number[];
  resolvedRate: number;
  averageHandlingTime: number;
  satisfactionTrend: number[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  performanceTrend: number[];
  topTopics: Array<{topic: string, count: number}>;
}
