import React, { useState } from 'react';
import type { Guest } from '../types';
import { Edit2, Save, X } from 'lucide-react';
import clsx from 'clsx';

interface GuestListProps {
    guests: Guest[];
    onEditGuest: (id: string, updates: Partial<Guest>) => void;
}

export const GuestList: React.FC<GuestListProps> = ({ guests, onEditGuest }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Guest>>({});

    const startEditing = (guest: Guest) => {
        setEditingId(guest.id);
        setEditForm({
            name: guest.name,
            plusOne: { ...guest.plusOne },
            ratings: { ...guest.ratings }
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEditing = () => {
        if (editingId && editForm) {
            onEditGuest(editingId, editForm);
            setEditingId(null);
            setEditForm({});
        }
    };

    const handlePlusOneChange = (field: string, value: any) => {
        setEditForm(prev => ({
            ...prev,
            plusOne: {
                ...prev.plusOne!,
                [field]: value
            }
        }));
    };

    const handleRatingChange = (category: 'groom' | 'bride', value: string) => {
        const numValue = parseInt(value) || 0;
        setEditForm(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings!,
                [category]: numValue
            }
        }));
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                Current Guest List
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {guests.length}
                </span>
                <span className="ml-auto text-xs font-normal text-slate-400 italic">
                    Double-click a card to edit
                </span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
                {guests.map((guest) => (
                    <div
                        key={guest.id}
                        onDoubleClick={() => startEditing(guest)}
                        className={clsx(
                            "p-4 rounded-xl border transition-all cursor-pointer",
                            editingId === guest.id
                                ? "bg-indigo-50 border-indigo-200 shadow-md cursor-default"
                                : "bg-slate-50 border-slate-100 hover:border-indigo-200"
                        )}>
                        {editingId === guest.id ? (
                            <div className="space-y-4">
                                {/* Name Edit */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                                    />
                                </div>

                                {/* Plus One Edit */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`edit-hasPlusOne-${guest.id}`}
                                            checked={editForm.plusOne?.hasPlusOne}
                                            onChange={(e) => handlePlusOneChange('hasPlusOne', e.target.checked)}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-indigo-300"
                                        />
                                        <label htmlFor={`edit-hasPlusOne-${guest.id}`} className="text-sm font-medium text-slate-700">Has Plus One</label>
                                    </div>

                                    {editForm.plusOne?.hasPlusOne && (
                                        <div className="pl-6 space-y-2">
                                            <div className="flex gap-4 text-xs">
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={!editForm.plusOne?.isKnown}
                                                        onChange={() => handlePlusOneChange('isKnown', false)}
                                                        className="text-indigo-600"
                                                    />
                                                    Unknown
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={editForm.plusOne?.isKnown}
                                                        onChange={() => handlePlusOneChange('isKnown', true)}
                                                        className="text-indigo-600"
                                                    />
                                                    Known
                                                </label>
                                            </div>

                                            {editForm.plusOne?.isKnown ? (
                                                <select
                                                    value={editForm.plusOne?.linkedGuestId || ''}
                                                    onChange={(e) => handlePlusOneChange('linkedGuestId', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm"
                                                >
                                                    <option value="">Select Guest</option>
                                                    {guests.filter(g => g.id !== guest.id).map(g => (
                                                        <option key={g.id} value={g.id}>{g.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={editForm.plusOne?.name || ''}
                                                    onChange={(e) => handlePlusOneChange('name', e.target.value)}
                                                    placeholder="Plus One Name"
                                                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Ratings Edit */}
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-indigo-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Groom Rating</label>
                                        <input
                                            type="number"
                                            value={editForm.ratings?.groom}
                                            onChange={(e) => handleRatingChange('groom', e.target.value)}
                                            className="w-full px-2 py-1 bg-white border border-indigo-200 rounded text-sm font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Bride Rating</label>
                                        <input
                                            type="number"
                                            value={editForm.ratings?.bride}
                                            onChange={(e) => handleRatingChange('bride', e.target.value)}
                                            className="w-full px-2 py-1 bg-white border border-indigo-200 rounded text-sm font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={cancelEditing}
                                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Cancel"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={saveEditing}
                                        className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                                        title="Save"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-slate-900">{guest.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[10px] font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                                            ID: {guest.id.slice(0, 4)}
                                        </div>
                                    </div>
                                </div>

                                {guest.plusOne.hasPlusOne && (
                                    <div className="text-sm text-slate-500 flex items-center gap-1.5 mb-3">
                                        <UserPlus className="w-3 h-3" />
                                        {guest.plusOne.isKnown
                                            ? (guest.plusOne.linkedGuestId
                                                ? <span className="text-indigo-600 font-medium">{guests.find(g => g.id === guest.plusOne.linkedGuestId)?.name}</span>
                                                : guest.plusOne.name)
                                            : (guest.plusOne.name || 'Unknown Guest')}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Groom</span>
                                        <span className="text-sm font-mono font-medium text-indigo-600">{guest.ratings.groom}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bride</span>
                                        <span className="text-sm font-mono font-medium text-rose-500">{guest.ratings.bride}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {guests.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p>No guests added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for icon
const UserPlus = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);
