export interface EventInfo {
  name: string;
  date: string; // ISO string
  location: string;
  address: string;
  description: string;
}

export interface Guest {
  name: string;
  confirmed: boolean;
  message?: string;
}
