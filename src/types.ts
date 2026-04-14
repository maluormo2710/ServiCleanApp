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
    subtotal: string;
    tax: string;
  };
}
