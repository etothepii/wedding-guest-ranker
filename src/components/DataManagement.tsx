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
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
                Data Management
            </h3>
            <div className="flex gap-4">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
                <div className="relative">
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
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                    >
                        <Upload className="w-4 h-4" />
                        Import CSV
                    </label>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
                Export your data to backup or edit in a spreadsheet. Importing will overwrite current data.
            </p>
        </div>
    );
};
