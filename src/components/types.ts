// src/components/types.ts

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  people: number;
}

export type ReservationInput = Omit<Reservation, "id">;

