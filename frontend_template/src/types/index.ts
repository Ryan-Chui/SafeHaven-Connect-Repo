export interface Shelter {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  capacity: {
    current: number;
    maximum: number;
  };
  needs: {
    food: number; // 0-5 scale (0 = no need, 5 = critical need)
    water: number;
    medicalSupplies: number;
    blankets: number;
    clothing: number;
    other: string;
  };
  status: 'no-action' | 'acknowledged' | 'in-progress' | 'completed';
  otherInformation: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  type: 'shelter' | 'responder';
  shelterId?: string; // Only for shelter users
  location?: {
    latitude: number;
    longitude: number;
  }; // Only for responder users
  address?: string; // Only for responder users - optional address they entered
}

export interface AppState {
  shelters: Shelter[];
  users: User[];
  currentUser: User | null;
  currentSide: 'landing' | 'shelter' | 'responder';
}

export type NeedLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const NEED_LABELS: Record<NeedLevel, string> = {
  0: 'No Need',
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Critical'
};

export const STATUS_LABELS: Record<Shelter['status'], string> = {
  'no-action': 'No Action Taken',
  'acknowledged': 'Acknowledged',
  'in-progress': 'In Progress',
  'completed': 'Completed'
};