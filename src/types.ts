export type ActiveSection = 'home' | 'menu' | 'reservations' | 'bookings';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'wine';
  image: string;
  tag?: string;
  details?: {
    allergens: string[];
    pairing: string;
    origin?: string;
  };
}

export interface Reservation {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating: 'Main Dining Room' | "Chef's Counter" | 'Private Salon';
  specialRequests?: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
