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
    const sortedGuests = [...guests].sort((a, b) => b.ratings[category] - a.ratings[category]);

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
                    Guest Rankings
                </h2>

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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="w-12 text-center">Rank</div>
                    <div>Guest</div>
                    <div className="text-right">Score</div>
                </div>
                {sortedGuests.map((guest, index) => (
                    <div
                        key={guest.id}
                        className={clsx(
                            'grid grid-cols-[auto_1fr_auto] gap-4 items-center p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group',
                            index < 3 ? 'bg-gradient-to-r from-slate-50/50 to-transparent' : ''
                        )}
                    >
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
                                <span className="text-slate-400 font-mono font-bold text-lg">#{index + 1}</span>
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <h3 className={clsx(
                                    "font-bold truncate",
                                    index === 0 ? "text-lg text-slate-900" : "text-slate-700"
                                )}>{guest.name}</h3>
                                {guest.plusOne.hasPlusOne && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
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
                                index === 0 ? "text-2xl text-indigo-600" : "text-lg text-slate-700"
                            )}>{guest.ratings[category]}</div>
                            <div className="text-xs text-slate-400 font-medium">{guest.matches[category]} matches</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
