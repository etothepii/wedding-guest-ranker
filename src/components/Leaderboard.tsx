import React, { useState } from 'react';
import type { Guest, RatingCategory } from '../types';
import { Trophy, Medal, Users, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface LeaderboardProps {
    guests: Guest[];
}

const CATEGORIES: { id: RatingCategory; label: string }[] = [
    { id: 'groom', label: 'Groom' },
    { id: 'bride', label: 'Bride' },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ guests }) => {
    const [category, setCategory] = useState<RatingCategory>('groom');
    const [guestLimit, setGuestLimit] = useState<number | ''>('');

    const sortedGuests = [...guests].sort((a, b) => b.ratings[category] - a.ratings[category]);

    // Calculate highlighted guests
    const highlightedGuestIds = new Set<string>();
    let currentCount = 0;
    const limit = typeof guestLimit === 'number' ? guestLimit : 0;

    if (limit > 0) {
        for (const guest of sortedGuests) {
            // If this guest is already highlighted (e.g., as a linked plus-one of a higher-ranked guest), skip
            if (highlightedGuestIds.has(guest.id)) continue;

            const guestSize = guest.plusOne.hasPlusOne ? 2 : 1;

            if (currentCount + guestSize <= limit) {
                highlightedGuestIds.add(guest.id);
                if (guest.plusOne.linkedGuestId) {
                    highlightedGuestIds.add(guest.plusOne.linkedGuestId);
                }
                currentCount += guestSize;
            } else if (guestSize === 2 && currentCount + 1 <= limit) {
                // Skip this guest as they need 2 spots but only 1 is left
                continue;
            } else if (guestSize === 1 && currentCount + 1 <= limit) {
                highlightedGuestIds.add(guest.id);
                currentCount += 1;
            }

            if (currentCount >= limit) break;
        }
    }

    if (guests.length === 0) {
        return (
            <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No Guests Yet</h3>
                <p className="text-slate-500 mt-2">Add guests to see the leaderboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        Guest Rankings
                        <div className="text-xs font-normal text-slate-400 mt-0.5">
                            {Math.floor(guests.reduce((acc, g) => acc + (g.matches[category] || 0), 0) / 2)} comparisons
                        </div>
                    </div>
                </h2>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold text-slate-500 uppercase">Limit</span>
                        <input
                            type="number"
                            min="1"
                            placeholder="All"
                            value={guestLimit}
                            onChange={(e) => setGuestLimit(e.target.value ? parseInt(e.target.value) : '')}
                            className="w-12 text-sm font-bold text-slate-800 outline-none bg-transparent text-right"
                        />
                    </div>

                    <div className="inline-block relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as RatingCategory)}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-5 pr-12 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold cursor-pointer text-sm"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {limit > 0 && (
                <div className="mb-4 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100 flex justify-between items-center">
                    <span>Highlighting top {limit} spots</span>
                    <span className="font-bold">{currentCount} / {limit} filled</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="w-12 text-center">Rank</div>
                    <div>Guest</div>
                    <div className="text-right">Score</div>
                </div>
                {sortedGuests.map((guest, index) => {
                    const isHighlighted = limit > 0 && highlightedGuestIds.has(guest.id);

                    return (
                        <div
                            key={guest.id}
                            className={clsx(
                                'grid grid-cols-[auto_1fr_auto] gap-4 items-center p-5 border-b border-slate-100 last:border-0 transition-all group relative',
                                isHighlighted ? 'bg-indigo-50/30' : 'hover:bg-slate-50',
                                index < 3 && !isHighlighted ? 'bg-gradient-to-r from-slate-50/50 to-transparent' : ''
                            )}
                        >
                            {isHighlighted && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                            )}

                            <div className="w-12 flex-shrink-0 flex justify-center">
                                {index === 0 ? (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-yellow-400 blur-sm opacity-20 rounded-full"></div>
                                        <Medal className="w-8 h-8 text-yellow-500 relative z-10" />
                                    </div>
                                ) : index === 1 ? (
                                    <Medal className="w-7 h-7 text-slate-400" />
                                ) : index === 2 ? (
                                    <Medal className="w-6 h-6 text-amber-700" />
                                ) : (
                                    <span className={clsx(
                                        "font-mono font-bold text-lg",
                                        isHighlighted ? "text-indigo-600" : "text-slate-400"
                                    )}>#{index + 1}</span>
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className={clsx(
                                        "font-bold truncate",
                                        index === 0 ? "text-lg text-slate-900" : "text-slate-700",
                                        isHighlighted && index !== 0 && "text-indigo-900"
                                    )}>{guest.name}</h3>
                                    {guest.plusOne.hasPlusOne && (
                                        <span className={clsx(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border",
                                            isHighlighted
                                                ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                                                : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                        )}>
                                            <Users className="w-3 h-3" />
                                            +1
                                        </span>
                                    )}
                                </div>
                                {guest.plusOne.hasPlusOne && guest.plusOne.isKnown && (
                                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        w/ {guest.plusOne.linkedGuestId
                                            ? <span className="font-medium text-slate-600">{guests.find(g => g.id === guest.plusOne.linkedGuestId)?.name}</span>
                                            : guest.plusOne.name}
                                    </p>
                                )}
                            </div>

                            <div className="text-right">
                                <div className={clsx(
                                    "font-mono font-bold",
                                    index === 0 ? "text-2xl text-indigo-600" : "text-lg text-slate-700",
                                    isHighlighted && index !== 0 && "text-indigo-600"
                                )}>{guest.ratings[category]}</div>
                                <div className="text-xs text-slate-400 font-medium">{guest.matches[category]} matches</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
