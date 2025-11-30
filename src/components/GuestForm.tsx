import React, { useState } from 'react';
import { Plus, User } from 'lucide-react';
import type { Guest } from '../types';

interface GuestFormProps {
    guests: Guest[];
    onAddGuest: (guest: Omit<Guest, 'id' | 'rating' | 'matches'>) => void;
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

        onAddGuest({
            name: name.trim(),
            plusOne: {
                hasPlusOne,
                isKnown: hasPlusOne ? isKnown : false,
                name: hasPlusOne && isKnown && !linkedGuestId ? plusOneName.trim() : undefined,
                linkedGuestId: hasPlusOne && isKnown && linkedGuestId ? linkedGuestId : undefined,
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
                                    >
                                        <option value="">-- Select a guest (optional) --</option>
                                        {availableGuests.map(guest => (
                                            <option key={guest.id} value={guest.id}>
                                                {guest.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {!linkedGuestId && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Or Enter Name</label>
                                        <input
                                            type="text"
                                            value={plusOneName}
                                            onChange={(e) => setPlusOneName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            placeholder="Enter partner's name"
                                            required={!linkedGuestId}
                                        />
                                    </div>
                                )}
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
