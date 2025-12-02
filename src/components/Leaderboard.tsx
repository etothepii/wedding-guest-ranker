import React, { useState } from 'react';
import type { Guest } from '../types';
import { Trophy, Medal, Users } from 'lucide-react';
import clsx from 'clsx';

interface LeaderboardProps {
    guests: Guest[];
}



export const Leaderboard: React.FC<LeaderboardProps> = ({ guests }) => {
    const [sliderValue, setSliderValue] = useState<number>(50); // 0 = 100% Groom, 100 = 100% Bride
    const [guestLimit, setGuestLimit] = useState<number | ''>('');

    const handleSliderChange = (newValue: number) => {
        // Snap to 50% if within +/- 5
        if (newValue >= 45 && newValue <= 55) {
            setSliderValue(50);
        } else {
            setSliderValue(newValue);
        }
    };

    const calculateWeightedScore = (guest: Guest) => {
        const groomWeight = (100 - sliderValue) / 100;
        const brideWeight = sliderValue / 100;
        return (guest.ratings.groom * groomWeight) + (guest.ratings.bride * brideWeight);
    };

    const sortedGuests = [...guests].sort((a, b) => calculateWeightedScore(b) - calculateWeightedScore(a));

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
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Trophy className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            Guest Rankings
                            <div className="text-xs font-normal text-slate-400 mt-0.5">
                                {Math.floor(guests.reduce((acc, g) => acc + (g.matches.groom + g.matches.bride), 0) / 2)} total comparisons
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
                    </div>
                </div>

                {/* Weighted Slider Control */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center w-20">
                            <span className="text-xs font-bold text-slate-400 uppercase mb-1">Groom</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={100 - sliderValue}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val >= 0 && val <= 100) {
                                            handleSliderChange(100 - val);
                                        }
                                    }}
                                    className="w-16 text-center font-mono font-bold text-indigo-600 bg-indigo-50 rounded-lg py-1 border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                <span className="absolute right-2 top-1.5 text-xs text-indigo-300">%</span>
                            </div>
                        </div>

                        <div className="flex-1 relative h-12 flex items-center">
                            <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 opacity-50"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            {/* Snap point marker */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-slate-300 rounded-full z-0" />

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                                className="w-full absolute z-10 opacity-0 cursor-pointer h-full"
                            />

                            {/* Custom Thumb Representation */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full shadow-md pointer-events-none transition-all duration-75 flex items-center justify-center"
                                style={{ left: `calc(${sliderValue}% - 12px)` }}
                            >
                                <div className="w-2 h-2 rounded-full bg-slate-400" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-20">
                            <span className="text-xs font-bold text-slate-400 uppercase mb-1">Bride</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={sliderValue}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val >= 0 && val <= 100) {
                                            handleSliderChange(val);
                                        }
                                    }}
                                    className="w-16 text-center font-mono font-bold text-rose-600 bg-rose-50 rounded-lg py-1 border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                                />
                                <span className="absolute right-2 top-1.5 text-xs text-rose-300">%</span>
                            </div>
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
                                )}>{calculateWeightedScore(guest).toFixed(0)}</div>
                                <div className="text-xs text-slate-400 font-medium">
                                    {guest.matches.groom + guest.matches.bride} matches
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
