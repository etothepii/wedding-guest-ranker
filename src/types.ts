export type RatingCategory = 'groom' | 'bride';

export interface Guest {
    id: string;
    name: string;
    plusOne: {
        hasPlusOne: boolean;
        isKnown: boolean;
        name?: string;
        linkedGuestId?: string;
    };
    ratings: Record<RatingCategory, number>;
    matches: Record<RatingCategory, number>;
}

export type GuestStore = {
    guests: Guest[];
    addGuest: (guest: Omit<Guest, 'id' | 'ratings' | 'matches'>) => void;
    updateRating: (winnerId: string, loserId: string, isTie: boolean, category: RatingCategory) => void;
    importGuests: (guests: Guest[]) => void;
    editGuest: (id: string, updates: Partial<Guest>) => void;
};
