// Auth types
export interface User {
  _id: string;
  name: string;
  email: string;
  business: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  role: 'vendor' | 'admin';
  token?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Waste types
export interface WasteItem {
  name: string;
  quantity: number;
  weight: number;
}

export interface Waste {
  _id: string;
  vendor: string;
  type: 'rotten' | 'reusable';
  description: string;
  weight: number;
  items: WasteItem[];
  status: 'pending' | 'scheduled' | 'collected' | 'processed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Pickup types
export interface Pickup {
  _id: string;
  vendor: string;
  wasteItems: Waste[] | string[];
  scheduledDate: string;
  timeSlot: string;
  totalWeight: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  collectionNotes?: string;
  driverAssigned?: string;
  vehicleInfo?: string;
  createdAt: string;
  updatedAt: string;
}

// Theme type
export type Theme = 'light' | 'dark';