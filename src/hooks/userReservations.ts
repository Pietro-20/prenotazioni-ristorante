import { useState, useEffect, useCallback } from 'react';
import { Reservation, ReservationStatus } from '../types';

const STORAGE_KEY = 'restaurant_reservations_v3';

const getInitialReservations = (): Reservation[] => {
  try {
    const storedReservations = window.localStorage.getItem(STORAGE_KEY);
    if (storedReservations) {
      return JSON.parse(storedReservations);
    }
    // Seed with richer initial data
    const initialReservations: Reservation[] = [
      { 
        id: '1', 
        name: 'Mario Rossi', 
        guests: 2, 
        date: new Date().toISOString().split('T')[0], 
        time: '20:00', 
        phone: '3331234567', 
        status: ReservationStatus.Confirmed,
        occasion: 'Cena Romantica',
        area: 'Sala Principale',
        notes: 'Tavolo vicino alla finestra',
        depositAmount: 20
      },
      { 
        id: '2', 
        name: 'Giulia Bianchi', 
        guests: 4, 
        date: new Date().toISOString().split('T')[0], 
        time: '21:00', 
        phone: '3477654321', 
        status: ReservationStatus.Pending,
        occasion: 'Compleanno',
        area: 'Terrazza Panoramica',
        notes: 'Intolleranza al glutine per 1 ospite',
        depositAmount: 40
      },
      { 
        id: '3', 
        name: 'Luca Verdi', 
        guests: 6, 
        date: '2024-08-16', 
        time: '19:30', 
        phone: '3289876543', 
        status: ReservationStatus.Seated,
        occasion: 'Lavoro',
        area: 'Privé Esclusivo',
        depositAmount: 60
      },
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReservations));
    return initialReservations;
  } catch (error) {
    console.error('Error handling localStorage', error);
    return [];
  }
};


export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>(getInitialReservations);
  
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [reservations]);
  
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CANCEL_RESERVATION') {
        const { id } = event.data;
        setReservations(prev =>
          prev.map(res =>
            res.id === id ? { ...res, status: ReservationStatus.Cancelled } : res
          )
        );
      }
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);


  const addReservation = useCallback((reservation: Omit<Reservation, 'id' | 'status'>): string => {
    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const newReservation: Reservation = {
      ...reservation,
      id: newId,
      status: ReservationStatus.Pending,
    };
    setReservations(prev => [newReservation, ...prev]);
    return newId;
  }, []);

  const updateReservation = useCallback((updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(res => res.id === updatedReservation.id ? updatedReservation : res)
    );
  }, []);

  const deleteReservation = useCallback((id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  }, []);

  return { reservations, addReservation, updateReservation, deleteReservation };
};
