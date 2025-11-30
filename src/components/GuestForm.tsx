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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-indigo-600" />
                Add Guest
            </h2>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter guest name"
                    required
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="hasPlusOne"
                        checked={hasPlusOne}
                        onChange={(e) => setHasPlusOne(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="hasPlusOne" className="text-gray-700 font-medium cursor-pointer select-none">
                        Has Plus One?
                    </label>
                </div>

                {hasPlusOne && (
                    <div className="pl-8 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!isKnown}
                                    onChange={() => setIsKnown(false)}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-600">Unknown</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={isKnown}
                                    onChange={() => setIsKnown(true)}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-600">Known Person</span>
                            </label>
                        </div>

                        {!isKnown && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Plus One Name (Optional)</label>
                                <input
                                    type="text"
                                    value={plusOneName}
                                    onChange={(e) => setPlusOneName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    placeholder="Enter partner's name if known, or leave blank"
                                />
                            </div>
                        )}

                        {isKnown && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Select Existing Guest</label>
                                    <select
                                        value={linkedGuestId}
                                        onChange={(e) => {
                                            setLinkedGuestId(e.target.value);
                                            if (e.target.value) setPlusOneName('');
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
                                        <p className="text-sm text-amber-600 mt-1">
                                            No other guests available to link. Please add them first.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Add to List
            </button>
        </form>
    );
};
