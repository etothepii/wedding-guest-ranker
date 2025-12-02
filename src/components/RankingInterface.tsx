import React, { useState, useEffect, useCallback } from 'react';
import type { Guest, RatingCategory } from '../types';
import { User, Users, RefreshCw, ChevronDown } from 'lucide-react';

interface RankingInterfaceProps {
    guests: Guest[];
    onVote: (winnerId: string, loserId: string, isTie: boolean, category: RatingCategory) => void;
}

const CATEGORIES: { id: RatingCategory; label: string }[] = [
    { id: 'groom', label: 'Groom' },
    { id: 'bride', label: 'Bride' },
];

export const RankingInterface: React.FC<RankingInterfaceProps> = ({ guests, onVote }) => {
    const [pair, setPair] = useState<[Guest, Guest] | null>(null);
    const [category, setCategory] = useState<RatingCategory>('groom');

    const pickRandomPair = useCallback(() => {
        if (guests.length < 2) return;

        // Sort guests by match count for the current category
        const sortedGuests = [...guests].sort((a, b) => a.matches[category] - b.matches[category]);

        // Find the minimum number of matches
        // const minMatches = sortedGuests[0].matches[category];

        // Create a pool of candidates. 
        // We include guests who have the minimum matches, or slightly more to ensure variety.
        // If we only picked strict minimums, a new guest might get compared 10 times in a row.
        // We'll include guests within a small range (e.g., minMatches + 2) but prioritize the top of the list.

        // Strategy: Take the top chunk of guests (e.g., top 5 or 20%, whichever is larger)
        // This ensures we focus on the under-represented guests while keeping it random.
        const poolSize = Math.max(5, Math.ceil(guests.length * 0.2));
        const candidatePool = sortedGuests.slice(0, poolSize);

        // Pick two distinct random guests from the pool
        const idx1 = Math.floor(Math.random() * candidatePool.length);
        let idx2 = Math.floor(Math.random() * candidatePool.length);

        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * candidatePool.length);
        }

        // If the pool is smaller than 2 (shouldn't happen given the poolSize logic unless guests.length < 2),
        // fallback to full random is handled by the initial check, but let's be safe.
        if (candidatePool.length < 2) {
            // Fallback to simple random if something goes wrong
            const r1 = Math.floor(Math.random() * guests.length);
            let r2 = Math.floor(Math.random() * guests.length);
            while (r1 === r2) r2 = Math.floor(Math.random() * guests.length);
            const pair: [Guest, Guest] = [guests[r1], guests[r2]];
            pair.sort((a, b) => b.ratings[category] - a.ratings[category]);
            setPair(pair);
            return;
        }

        const pair: [Guest, Guest] = [candidatePool[idx1], candidatePool[idx2]];
        // Sort so higher rating is on the left (first element)
        pair.sort((a, b) => b.ratings[category] - a.ratings[category]);

        setPair(pair);
    }, [guests, category]);

    useEffect(() => {
        if (guests.length >= 2) {
            const timer = setTimeout(() => {
                pickRandomPair();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [guests.length, pickRandomPair]);

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
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Who is more preferred?</h2>
                <p className="text-slate-400 text-sm font-medium mb-6">
                    {Math.floor(guests.reduce((acc, g) => acc + (g.matches[category] || 0), 0) / 2)} matches so far
                </p>

                <div className="inline-block relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as RatingCategory)}
                        className="appearance-none bg-white border border-slate-200 text-slate-700 py-3 px-6 pr-12 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold cursor-pointer text-lg"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>

                <p className="text-slate-500 mt-4 font-medium">
                    Click on the guest you prefer as <span className="font-bold text-slate-800">{CATEGORIES.find(c => c.id === category)?.label}</span>
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center relative">
                {/* Left Option */}
                <button
                    onClick={() => handleVote(0)}
                    className="flex-1 bg-white p-10 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-200/50 hover:scale-[1.02] transition-all duration-300 group border-2 border-transparent hover:border-indigo-500 text-left relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <User className="w-32 h-32 text-indigo-600" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 transition-colors duration-300">
                                <User className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                                <span className="text-xl font-mono font-bold text-indigo-600">{left.ratings[category]}</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{left.name}</h3>
                        {left.plusOne.hasPlusOne && (
                            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100">
                                <Users className="w-4 h-4" />
                                <span className="font-medium text-sm">+ {left.plusOne.isKnown
                                    ? (left.plusOne.linkedGuestId
                                        ? guests.find(g => g.id === left.plusOne.linkedGuestId)?.name
                                        : left.plusOne.name)
                                    : 'Unknown Guest'}</span>
                            </div>
                        )}
                    </div>
                </button>

                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                    <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl border-4 border-slate-50">
                        VS
                    </div>
                </div>

                {/* Right Option */}
                <button
                    onClick={() => handleVote(1)}
                    className="flex-1 bg-white p-10 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-rose-200/50 hover:scale-[1.02] transition-all duration-300 group border-2 border-transparent hover:border-rose-500 text-left relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <User className="w-32 h-32 text-rose-600" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-rose-50 rounded-2xl group-hover:bg-rose-600 transition-colors duration-300">
                                <User className="w-8 h-8 text-rose-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                                <span className="text-xl font-mono font-bold text-rose-600">{right.ratings[category]}</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{right.name}</h3>
                        {right.plusOne.hasPlusOne && (
                            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100">
                                <Users className="w-4 h-4" />
                                <span className="font-medium text-sm">+ {right.plusOne.isKnown
                                    ? (right.plusOne.linkedGuestId
                                        ? guests.find(g => g.id === right.plusOne.linkedGuestId)?.name
                                        : right.plusOne.name)
                                    : 'Unknown Guest'}</span>
                            </div>
                        )}
                    </div>
                </button>
            </div>

            <div className="mt-16 flex justify-center gap-6">
                <button
                    onClick={() => handleVote('tie')}
                    className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    It's a Tie
                </button>
                <button
                    onClick={pickRandomPair}
                    className="px-10 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                    <RefreshCw className="w-5 h-5" />
                    Skip Pair
                </button>
            </div>
        </div>
    );
};
