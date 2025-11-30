import { useState, useEffect } from 'react';
import type { Guest, RatingCategory } from '../types';

const STORAGE_KEY = 'wedding-guest-list-v2'; // Changed key to avoid conflicts with old data structure

export const useGuestList = () => {
    const [guests, setGuests] = useState<Guest[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    }, [guests]);

    const addGuest = (guestData: Omit<Guest, 'id' | 'ratings' | 'matches'>) => {
        const newGuest: Guest = {
            ...guestData,
            id: crypto.randomUUID(),
            ratings: {
                groom_like: 1200,
                groom_obligation: 1200,
                bride_like: 1200,
                bride_obligation: 1200,
            },
            matches: {
                groom_like: 0,
                groom_obligation: 0,
                bride_like: 0,
                bride_obligation: 0,
            },
        };
        setGuests((prev) => [...prev, newGuest]);
    };

    const updateRating = (winnerId: string, loserId: string, isTie: boolean, category: RatingCategory) => {
        setGuests((prev) => {
            const newGuests = [...prev];
            const winnerIndex = newGuests.findIndex((g) => g.id === winnerId);
            const loserIndex = newGuests.findIndex((g) => g.id === loserId);

            if (winnerIndex === -1 || loserIndex === -1) return prev;

            const winner = newGuests[winnerIndex];
            const loser = newGuests[loserIndex];

            const K = 32;
            const winnerRating = winner.ratings[category];
            const loserRating = loser.ratings[category];

            const expectedWinner = 1 / (1 + 10 ** ((loserRating - winnerRating) / 400));
            const expectedLoser = 1 / (1 + 10 ** ((winnerRating - loserRating) / 400));

            const actualWinner = isTie ? 0.5 : 1;
            const actualLoser = isTie ? 0.5 : 0;

            // Create new objects to maintain immutability (though we are mutating the clone above, 
            // strictly speaking we should be careful, but for this simple app deep cloning might be overkill 
            // if we are just careful. However, let's be safe with the nested objects).
            // Actually, since we cloned the array, we can mutate the objects inside if we are sure they are new references 
            // or if we don't care about shallow comparison of individual items elsewhere. 
            // But `[...prev]` only shallow copies the array. The items are shared.
            // So we MUST shallow copy the items we modify.

            newGuests[winnerIndex] = {
                ...winner,
                ratings: { ...winner.ratings },
                matches: { ...winner.matches }
            };
            newGuests[loserIndex] = {
                ...loser,
                ratings: { ...loser.ratings },
                matches: { ...loser.matches }
            };

            newGuests[winnerIndex].ratings[category] = Math.round(winnerRating + K * (actualWinner - expectedWinner));
            newGuests[loserIndex].ratings[category] = Math.round(loserRating + K * (actualLoser - expectedLoser));

            newGuests[winnerIndex].matches[category] += 1;
            newGuests[loserIndex].matches[category] += 1;

            return newGuests;
        });
    };

    const importGuests = (newGuests: Guest[]) => {
        setGuests(newGuests);
    };

    return { guests, addGuest, updateRating, importGuests };
};
