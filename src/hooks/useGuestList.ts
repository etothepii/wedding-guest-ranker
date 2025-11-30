import { useState, useEffect } from 'react';
import type { Guest } from '../types';

const STORAGE_KEY = 'wedding-guest-list';

export const useGuestList = () => {
    const [guests, setGuests] = useState<Guest[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    }, [guests]);

    const addGuest = (guestData: Omit<Guest, 'id' | 'rating' | 'matches'>) => {
        const newGuest: Guest = {
            ...guestData,
            id: crypto.randomUUID(),
            rating: 1200,
            matches: 0,
        };
        setGuests((prev) => [...prev, newGuest]);
    };

    const updateRating = (winnerId: string, loserId: string, isTie: boolean) => {
        setGuests((prev) => {
            const newGuests = [...prev];
            const winnerIndex = newGuests.findIndex((g) => g.id === winnerId);
            const loserIndex = newGuests.findIndex((g) => g.id === loserId);

            if (winnerIndex === -1 || loserIndex === -1) return prev;

            const winner = newGuests[winnerIndex];
            const loser = newGuests[loserIndex];

            const K = 32;
            const expectedWinner = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
            const expectedLoser = 1 / (1 + 10 ** ((winner.rating - loser.rating) / 400));

            const actualWinner = isTie ? 0.5 : 1;
            const actualLoser = isTie ? 0.5 : 0;

            winner.rating = Math.round(winner.rating + K * (actualWinner - expectedWinner));
            loser.rating = Math.round(loser.rating + K * (actualLoser - expectedLoser));

            winner.matches += 1;
            loser.matches += 1;

            return newGuests;
        });
    };

    return { guests, addGuest, updateRating };
};
