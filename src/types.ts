export type RatingCategory = 'groom_like' | 'groom_obligation' | 'bride_like' | 'bride_obligation';

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
};
