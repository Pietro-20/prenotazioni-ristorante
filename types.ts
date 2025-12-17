export enum ReservationStatus {
  Pending = 'In Attesa',
  Confirmed = 'Confermata',
  Cancelled = 'Annullata',
  Seated = 'Al Tavolo',
  Completed = 'Conclusa'
}

export type Occasion = 'Cena Romantica' | 'Compleanno' | 'Anniversario' | 'Lavoro' | 'Casual' | 'Altro';
export type AreaPreference = 'Sala Principale' | 'Terrazza Panoramica' | 'Privé Esclusivo';

export interface Reservation {
  id: string;
  name: string;
  guests: number;
  date: string;
  time: string;
  phone: string;
  status: ReservationStatus;
  occasion: Occasion;
  area: AreaPreference;
  notes?: string; // Allergies or special requests
  depositAmount: number; // New field for the deposit
  reminderPreference?: 'none' | '1h' | '2h' | '3h';
}