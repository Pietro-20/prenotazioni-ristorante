export interface AdminUser {
    id: number;
    name: string;
    role: string;
}

export interface User {
    id: number;
    name: string;
    role: string;
}

export enum ReservationStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Seated = 'Seated',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export type Occasion = 'Compleanno' | 'Cena Romantica' | 'Anniversario' | 'Lavoro' | 'Altro';
export type AreaPreference = 'Sala Principale' | 'Terrazza Panoramica' | 'Privé Esclusivo';

export interface Reservation {
    id: string;
    name: string;
    date: string;
    time: string;
    guests: number; // Standardizing on 'guests' as used in AdminPage and initial data
    phone: string;
    email?: string;
    occasion: Occasion;
    area: AreaPreference;
    status: ReservationStatus;
    notes?: string;
    depositAmount: number;
}
