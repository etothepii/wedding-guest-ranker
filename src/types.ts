export interface Guest {
    id: string;
    name: string;
    plusOne: {
        hasPlusOne: boolean;
        isKnown: boolean;
        name?: string;
        linkedGuestId?: string;
    };
    rating: number;
    matches: number;
}

export type GuestStore = {
    guests: Guest[];
    addGuest: (guest: Omit<Guest, 'id' | 'rating' | 'matches'>) => void;
    updateRating: (winnerId: string, loserId: string, isTie: boolean) => void;
};
