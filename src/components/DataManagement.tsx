import React, { useRef } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';
import type { Guest } from '../types';

interface DataManagementProps {
    guests: Guest[];
    onImport: (guests: Guest[]) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ guests, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const headers = [
            'id', 'name',
            'plusOne_hasPlusOne', 'plusOne_isKnown', 'plusOne_name', 'plusOne_linkedGuestId',
            'rating_groom', 'rating_bride',
            'matches_groom', 'matches_bride'
        ];

        const csvContent = [
            headers.join(','),
            ...guests.map(guest => {
                return [
                    guest.id,
                    `"${guest.name.replace(/"/g, '""')}"`,
                    guest.plusOne.hasPlusOne,
                    guest.plusOne.isKnown,
                    `"${(guest.plusOne.name || '').replace(/"/g, '""')}"`,
                    guest.plusOne.linkedGuestId || '',
                    guest.ratings.groom,
                    guest.ratings.bride,
                    guest.matches.groom,
                    guest.matches.bride
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `wedding_guests_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const lines = content.split('\n');
                const headers = lines[0].split(',');

                // Basic validation
                if (!headers.includes('id') || !headers.includes('name')) {
                    alert('Invalid CSV format: Missing required columns');
                    return;
                }

                const newGuests: Guest[] = [];

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    // Handle quoted strings properly (simple regex approach)
                    const values: string[] = [];
                    let inQuote = false;
                    let currentValue = '';

                    for (let j = 0; j < line.length; j++) {
                        const char = line[j];
                        if (char === '"') {
                            if (j + 1 < line.length && line[j + 1] === '"') {
                                currentValue += '"';
                                j++;
                            } else {
                                inQuote = !inQuote;
                            }
                        } else if (char === ',' && !inQuote) {
                            values.push(currentValue);
                            currentValue = '';
                        } else {
                            currentValue += char;
                        }
                    }
                    values.push(currentValue);

                    // Map values to object based on fixed index (assuming standard export format)
                    // A more robust parser would map based on header index, but this suffices for our own export

                    if (values.length < 10) continue; // Skip malformed lines

                    newGuests.push({
                        id: values[0],
                        name: values[1],
                        plusOne: {
                            hasPlusOne: values[2] === 'true',
                            isKnown: values[3] === 'true',
                            name: values[4] || undefined,
                            linkedGuestId: values[5] || undefined,
                        },
                        ratings: {
                            groom: parseInt(values[6]) || 1200,
                            bride: parseInt(values[7]) || 1200,
                        },
                        matches: {
                            groom: parseInt(values[8]) || 0,
                            bride: parseInt(values[9]) || 0,
                        }
                    });
                }

                if (confirm(`Importing ${newGuests.length} guests will replace your current list. Are you sure?`)) {
                    onImport(newGuests);
                    alert('Import successful!');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to parse CSV file.');
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                        Data Management
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Export your data to backup or edit in a spreadsheet.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleExport}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-semibold border border-indigo-100"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
                <div className="relative flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".csv"
                        className="hidden"
                        id="csv-upload"
                    />
                    <label
                        htmlFor="csv-upload"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold cursor-pointer shadow-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Import CSV
                    </label>
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
                Warning: Importing will overwrite your current guest list.
            </p>
        </div>
    );
};
