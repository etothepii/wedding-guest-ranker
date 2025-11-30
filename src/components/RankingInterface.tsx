import React, { useState, useEffect } from 'react';
import type { Guest, RatingCategory } from '../types';
import { User, Users, RefreshCw, ChevronDown } from 'lucide-react';

interface RankingInterfaceProps {
    guests: Guest[];
    onVote: (winnerId: string, loserId: string, isTie: boolean, category: RatingCategory) => void;
}

const CATEGORIES: { id: RatingCategory; label: string }[] = [
    { id: 'groom_like', label: 'Groom Like' },
    { id: 'groom_obligation', label: 'Groom Obligation' },
    { id: 'bride_like', label: 'Bride Like' },
    { id: 'bride_obligation', label: 'Bride Obligation' },
];

export const RankingInterface: React.FC<RankingInterfaceProps> = ({ guests, onVote }) => {
    const [pair, setPair] = useState<[Guest, Guest] | null>(null);
    const [category, setCategory] = useState<RatingCategory>('groom_like');

    const pickRandomPair = () => {
        if (guests.length < 2) return;

        let idx1 = Math.floor(Math.random() * guests.length);
        let idx2 = Math.floor(Math.random() * guests.length);

        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * guests.length);
        }

        setPair([guests[idx1], guests[idx2]]);
    };

    useEffect(() => {
        if (!pair && guests.length >= 2) {
            pickRandomPair();
        }
    }, [guests.length]);

    const handleVote = (winnerIndex: number | 'tie') => {
        if (!pair) return;

        const [guest1, guest2] = pair;

        if (winnerIndex === 'tie') {
            onVote(guest1.id, guest2.id, true, category);
        } else if (winnerIndex === 0) {
            onVote(guest1.id, guest2.id, false, category);
        } else {
            onVote(guest2.id, guest1.id, false, category);
        }

        pickRandomPair();
    };

    if (guests.length < 2) {
        return (
            <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">Not Enough Guests</h3>
                <p className="text-gray-500 mt-2">Add at least two guests to start ranking.</p>
            </div>
        );
    }

    if (!pair) return null;

    const [left, right] = pair;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Who is more preferred?</h2>

                <div className="inline-block relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as RatingCategory)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                <p className="text-gray-500 mt-4">Click on the guest you prefer for <span className="font-semibold text-gray-700">{CATEGORIES.find(c => c.id === category)?.label}</span></p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
                {/* Left Option */}
                <button
                    onClick={() => handleVote(0)}
                    className="flex-1 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group border-2 border-transparent hover:border-indigo-500 text-left"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-600 transition-colors">
                            <User className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-mono text-gray-400">Rating: {left.ratings[category]}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{left.name}</h3>
                    {left.plusOne.hasPlusOne && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>+ {left.plusOne.isKnown
                                ? (left.plusOne.linkedGuestId
                                    ? guests.find(g => g.id === left.plusOne.linkedGuestId)?.name
                                    : left.plusOne.name)
                                : 'Unknown Guest'}</span>
                        </div>
                    )}
                </button>

                {/* VS Badge */}
                <div className="flex items-center justify-center md:w-16">
                    <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-lg z-10">
                        VS
                    </div>
                </div>

                {/* Right Option */}
                <button
                    onClick={() => handleVote(1)}
                    className="flex-1 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group border-2 border-transparent hover:border-rose-500 text-left"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-rose-100 rounded-full group-hover:bg-rose-600 transition-colors">
                            <User className="w-8 h-8 text-rose-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-mono text-gray-400">Rating: {right.ratings[category]}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{right.name}</h3>
                    {right.plusOne.hasPlusOne && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>+ {right.plusOne.isKnown
                                ? (right.plusOne.linkedGuestId
                                    ? guests.find(g => g.id === right.plusOne.linkedGuestId)?.name
                                    : right.plusOne.name)
                                : 'Unknown Guest'}</span>
                        </div>
                    )}
                </button>
            </div>

            <div className="mt-12 flex justify-center gap-4">
                <button
                    onClick={() => handleVote('tie')}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                    It's a Tie
                </button>
                <button
                    onClick={pickRandomPair}
                    className="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Skip Pair
                </button>
            </div>
        </div>
    );
};
