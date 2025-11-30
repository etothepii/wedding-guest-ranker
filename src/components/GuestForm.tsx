import React, { useState } from 'react';
import { Plus, User } from 'lucide-react';
import type { Guest } from '../types';

interface GuestFormProps {
    guests: Guest[];
    onAddGuest: (guest: Omit<Guest, 'id' | 'ratings' | 'matches'>) => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({ guests, onAddGuest }) => {
    const [name, setName] = useState('');
    const [hasPlusOne, setHasPlusOne] = useState(false);
    const [isKnown, setIsKnown] = useState(false);
    const [plusOneName, setPlusOneName] = useState('');
    const [linkedGuestId, setLinkedGuestId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // If known plus one, must have linkedGuestId
        if (hasPlusOne && isKnown && !linkedGuestId) return;

        onAddGuest({
            name: name.trim(),
            plusOne: {
                hasPlusOne,
                isKnown: hasPlusOne ? isKnown : false,
                name: hasPlusOne && !isKnown ? plusOneName.trim() : undefined,
                linkedGuestId: hasPlusOne && isKnown ? linkedGuestId : undefined,
            },
        });

        setName('');
        setHasPlusOne(false);
        setIsKnown(false);
        setPlusOneName('');
        setLinkedGuestId('');
    };

    const availableGuests = guests.filter(g => g.name !== name);

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto space-y-8">
            <div className="border-b border-slate-100 pb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    Add New Guest
                </h2>
                <p className="text-slate-500 mt-1 text-sm ml-12">
                    Add a single guest or a couple to your list.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Guest Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                        placeholder="e.g. John Doe"
                        required
                    />
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="hasPlusOne"
                            checked={hasPlusOne}
                            onChange={(e) => setHasPlusOne(e.target.checked)}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                        />
                        <label htmlFor="hasPlusOne" className="text-slate-700 font-medium cursor-pointer select-none">
                            Has Plus One?
                        </label>
                    </div>

                    {hasPlusOne && (
                        <div className="pl-8 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            checked={!isKnown}
                                            onChange={() => setIsKnown(false)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:border-[6px] transition-all bg-white"></div>
                                    </div>
                                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Unknown</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            checked={isKnown}
                                            onChange={() => setIsKnown(true)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:border-[6px] transition-all bg-white"></div>
                                    </div>
                                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Known Person</span>
                                </label>
                            </div>

                            {!isKnown && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Plus One Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={plusOneName}
                                        onChange={(e) => setPlusOneName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Enter partner's name if known"
                                    />
                                </div>
                            )}

                            {isKnown && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Select Existing Guest</label>
                                        <select
                                            value={linkedGuestId}
                                            onChange={(e) => {
                                                setLinkedGuestId(e.target.value);
                                                if (e.target.value) setPlusOneName('');
                                            }}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700"
                                            required={isKnown}
                                        >
                                            <option value="">-- Select a guest --</option>
                                            {availableGuests.map(guest => (
                                                <option key={guest.id} value={guest.id}>
                                                    {guest.name}
                                                </option>
                                            ))}
                                        </select>
                                        {availableGuests.length === 0 && (
                                            <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                No other guests available to link. Please add them first.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Add to List
            </button>
        </form>
    );
};
