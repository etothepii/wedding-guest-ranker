import { useState } from 'react';
import { Heart, Trophy, UserPlus } from 'lucide-react';
import { GuestForm } from './components/GuestForm';
import { RankingInterface } from './components/RankingInterface';
import { Leaderboard } from './components/Leaderboard';
import { useGuestList } from './hooks/useGuestList';
import { DataManagement } from './components/DataManagement';
import { GuestList } from './components/GuestList';
import clsx from 'clsx';

function App() {
  const { guests, addGuest, updateRating, importGuests, editGuest } = useGuestList();
  const [activeTab, setActiveTab] = useState<'add' | 'rank' | 'leaderboard'>('add');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Wedding Guest Ranker
              </span>
            </h1>
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {guests.length} Guests
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <nav className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('add')}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm',
                activeTab === 'add'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <UserPlus className="w-4 h-4" />
              Add Guest
            </button>
            <button
              onClick={() => setActiveTab('rank')}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm',
                activeTab === 'rank'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Heart className="w-4 h-4" />
              Rank Pairs
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm',
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
          </div>
        </nav>

        <div className="transition-all duration-300">
          {activeTab === 'add' && (
            <div className="space-y-8">
              <DataManagement guests={guests} onImport={importGuests} />
              <GuestForm guests={guests} onAddGuest={addGuest} />
              <GuestList guests={guests} onEditGuest={editGuest} />
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
