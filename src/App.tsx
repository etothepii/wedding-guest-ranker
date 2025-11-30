import { useState } from 'react';
import { Heart, Trophy, UserPlus } from 'lucide-react';
import { GuestForm } from './components/GuestForm';
import { RankingInterface } from './components/RankingInterface';
import { Leaderboard } from './components/Leaderboard';
import { useGuestList } from './hooks/useGuestList';
import clsx from 'clsx';

function App() {
  const { guests, addGuest, updateRating } = useGuestList();
  const [activeTab, setActiveTab] = useState<'add' | 'rank' | 'leaderboard'>('add');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-3">
            <Heart className="text-rose-500 fill-rose-500" />
            Wedding Guest Ranker
            <Heart className="text-rose-500 fill-rose-500" />
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('add')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all',
              activeTab === 'add'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            )}
          >
            <UserPlus className="w-5 h-5" />
            Add Guest
          </button>
          <button
            onClick={() => setActiveTab('rank')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all',
              activeTab === 'rank'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            )}
          >
            <Heart className="w-5 h-5" />
            Rank Pairs
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all',
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            )}
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>

        <div className="transition-all duration-300">
          {activeTab === 'add' && (
            <div className="space-y-8">
              <GuestForm onAddGuest={addGuest} />

              {/* Temporary list to verify addition */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Guest List ({guests.length})</h3>
                <div className="grid gap-3">
                  {guests.map((guest) => (
                    <div key={guest.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">{guest.name}</span>
                        {guest.plusOne.hasPlusOne && (
                          <span className="text-sm text-gray-500 ml-2">
                            + {guest.plusOne.isKnown ? guest.plusOne.name : 'Unknown Guest'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-mono text-gray-400">Rating: {guest.rating}</span>
                    </div>
                  ))}
                  {guests.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No guests added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rank' && (
            <RankingInterface guests={guests} onVote={updateRating} />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard guests={guests} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
