import React from 'react';
import type { Guest } from '../types';
import { Trophy, Medal, Users } from 'lucide-react';
import clsx from 'clsx';

interface LeaderboardProps {
    guests: Guest[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ guests }) => {
    const sortedGuests = [...guests].sort((a, b) => b.rating - a.rating);

    if (guests.length === 0) {
        return (
            <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No Guests Yet</h3>
                <p className="text-gray-500 mt-2">Add guests to see the leaderboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Guest Rankings
            </h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {sortedGuests.map((guest, index) => (
                    <div
                        key={guest.id}
                        className={clsx(
                            'flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors',
                            index < 3 ? 'bg-gradient-to-r from-white to-transparent' : ''
                        )}
                    >
                        <div className="w-12 flex-shrink-0 flex justify-center">
                            {index === 0 ? (
                                <Medal className="w-6 h-6 text-yellow-500" />
                            ) : index === 1 ? (
                                <Medal className="w-6 h-6 text-gray-400" />
                            ) : index === 2 ? (
                                <Medal className="w-6 h-6 text-amber-600" />
                            ) : (
                                <span className="text-gray-400 font-mono font-medium">#{index + 1}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                                {guest.plusOne.hasPlusOne && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                        <Users className="w-3 h-3" />
                                        +1
                                    </span>
                                )}
                            </div>
                            {guest.plusOne.hasPlusOne && guest.plusOne.isKnown && (
                                <p className="text-sm text-gray-500">
                                    w/ {guest.plusOne.linkedGuestId
                                        ? guests.find(g => g.id === guest.plusOne.linkedGuestId)?.name
                                        : guest.plusOne.name}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="font-mono font-bold text-indigo-600">{guest.rating}</div>
                            <div className="text-xs text-gray-400">{guest.matches} matches</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
