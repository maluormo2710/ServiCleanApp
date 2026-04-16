export interface Address {
  id: string;
  name: string;
  fullAddress: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  name: string;
}

export interface Booking {
  id: number;
  date: string;
  time: string;
  type: string;
  worker: string;
  price: string;
  status: string;
  rated: boolean;
  details: {
    duration: string;
    address: string;
    tasks: string[];
    comments?: string;
    subtotal: string;
    tax: string;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  iconType: 'sparkles' | 'clock' | 'credit-card' | 'bell';
  color: string;
  unread: boolean;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  promos: boolean;
}
