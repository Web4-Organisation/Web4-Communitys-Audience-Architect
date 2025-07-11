export interface User {
  id: number;
  name: string;
  email: string;
  // Using string for date to simplify JSON handling and rule evaluation
  lastSeen: string; 
  postCount: number;
  location: string;
  isPro: boolean;
  [key: string]: any; // Allow for dynamic properties
}

export type Operator = '>' | '<' | '=' | '!=' | 'contains' | 'not contains';

export interface Rule {
  id: string;
  field: keyof Omit<User, 'id' | 'email' | 'name'> | '';
  operator: Operator;
  value: string | number | boolean;
}

export interface Segment {
  id: string;
  name: string;
  rules: Rule[];
}
