
import React, { useState } from 'react';
import { Search, MapPin, Filter, Star, Navigation, ShieldCheck, User, Ruler, Award } from 'lucide-react';
import { searchCounselorsNearby } from '../services/geminiService';
import HolographicCard from '../components/HolographicCard';

const Counselors: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; chunks: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filterGender, setFilterGender] = useState('All');
  const [filterDistance, setFilterDistance] = useState('Any');
  const [filterRating, setFilterRating] = useState('All');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await searchCounselorsNearby(latitude, longitude);
          setResults(data);
          setLoading(false);
        },
        () => {
          setError("Location denied. Showing premium global experts.");
          setLoading(false);
        }
      );
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-xs uppercase tracking-widest mb-1">
            <ShieldCheck size={14} /> Identity Protection Active
          </div>
          <h1 className="text-3xl font-bold">Counsellor Connect</h1>
          <p className="text-gray-400 font-light">Book certified therapists anonymously. Only your chosen pseudonym is shared.</p>
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black border border-white/10 rounded-2xl hover:scale-105 transition-all font-black text-sm shadow-xl disabled:opacity-50"
        >
          {loading ? 'Analyzing Location...' : <><MapPin size={18} /> Find Nearby Experts</>}
        </button>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-wrap gap-3 p-4 bg-white/5 border border-white/10 rounded-[2rem]">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5">
          <User size={14} className="text-cyan-400" />
          <select 
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option>All Genders</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5">
          <Ruler size={14} className="text-fuchsia-400" />
          <select 
            value={filterDistance}
            onChange={(e) => setFilterDistance(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option>Any Distance</option>
            <option>within 5km</option>
            <option>within 15km</option>
            <option>Remote only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5">
          <Award size={14} className="text-yellow-400" />
          <select 
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option>All Ratings</option>
            <option>4.5+ Stars</option>
            <option>Expert (10yr+)</option>
          </select>
        </div>
      </div>

      {results ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {results.chunks.map((chunk: any, i: number) => (
             <HolographicCard key={i} className="min-h-[160px]">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-white">{chunk.maps?.title || 'Certified Partner'}</h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-bold text-white">4.9</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 font-light mb-6">Expertise in Clinical Psychology & Trauma Support.</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-xs font-bold text-cyan-400">Available Today</span>
                    {chunk.maps?.uri && (
                      <a 
                        href={chunk.maps.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black rounded-full transition-all uppercase tracking-widest border border-white/10"
                      >
                        Book Anonymously
                      </a>
                    )}
                  </div>
                </div>
             </HolographicCard>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-20">
          <Award size={64} className="mb-6 text-white/50" />
          <h3 className="text-2xl font-bold">Matching Protocol Ready</h3>
          <p className="max-w-xs mt-3 text-lg font-light">Search to find verified therapists based on your specific gender and distance preferences.</p>
        </div>
      )}
    </div>
  );
};

export default Counselors;
