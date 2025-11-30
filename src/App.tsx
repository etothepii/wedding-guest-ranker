import { useState } from 'react';
import { Heart, Trophy, UserPlus } from 'lucide-react';
import { GuestForm } from './components/GuestForm';
import { RankingInterface } from './components/RankingInterface';
import { Leaderboard } from './components/Leaderboard';
import { useGuestList } from './hooks/useGuestList';
import { DataManagement } from './components/DataManagement';
import clsx from 'clsx';

function App() {
  const { guests, addGuest, updateRating, importGuests } = useGuestList();
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

              {/* Temporary list to verify addition */}
              {/* Temporary list to verify addition */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  Current Guest List
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {guests.length}
                  </span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {guests.map((guest) => (
                    <div key={guest.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-900">{guest.name}</span>
                        <div className="text-[10px] font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 group-hover:border-indigo-100 transition-colors">
                          ID: {guest.id.slice(0, 4)}
                        </div>
                      </div>

                      {guest.plusOne.hasPlusOne && (
                        <div className="text-sm text-slate-500 flex items-center gap-1.5 mb-3">
                          <UserPlus className="w-3 h-3" />
                          {guest.plusOne.isKnown
                            ? (guest.plusOne.linkedGuestId
                              ? <span className="text-indigo-600 font-medium">{guests.find(g => g.id === guest.plusOne.linkedGuestId)?.name}</span>
                              : guest.plusOne.name)
                            : 'Unknown Guest'}
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
                    </div>
                  ))}
                  {guests.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                      <p>No guests added yet.</p>
                    </div>
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
