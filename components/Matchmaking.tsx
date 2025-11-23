import React, { useState } from 'react';
import { Sparkles, ArrowRight, MapPin, CheckCircle, Loader2, Search, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { Listing, MatchResult, ListingType, MaterialType } from '../types';
import { findAIConnectMatches } from '../services/geminiService';

interface MatchmakingProps {
  userListings: Listing[];
  allListings: Listing[];
}

export const Matchmaking: React.FC<MatchmakingProps> = ({ userListings, allListings }) => {
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const [formState, setFormState] = useState({
    type: ListingType.OFFER,
    material: '',
    quantity: '',
    location: 'Gurugram, HR',
    profile: 'A small-to-medium enterprise in the textile industry, specializing in cotton garments.'
  });

  const handleFindMatches = async () => {
    if (!formState.material) return;
    
    setLoading(true);
    setHasSearched(true);
    setMatches([]);

    const tempListing: Listing = {
        id: 'temp-search',
        userId: 'me',
        companyName: 'My Company',
        type: formState.type,
        material: formState.material as any,
        quantity: Number(formState.quantity) || 0,
        unit: 'kg',
        pricePerUnit: 0,
        location: formState.location,
        description: formState.profile,
        datePosted: new Date().toISOString()
    };

    const results = await findAIConnectMatches(tempListing, allListings);
    setMatches(results);
    setLoading(false);
  };

  const getMatchedListingDetails = (matchId: string) => {
    return allListings.find(l => l.id === matchId);
  };

  return (
    <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Form */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 h-fit">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Sparkles className="text-emerald-600 w-5 h-5" /> AI-Powered Match Finder
            </h2>
            <p className="text-slate-500 text-sm">Fill in your details to find optimal partners.</p>
          </div>

          <div className="space-y-5">
             {/* Radio Group */}
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">I have a material that is...</label>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formState.type === ListingType.OFFER ? 'border-emerald-600' : 'border-slate-300'}`}>
                            {formState.type === ListingType.OFFER && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                        </div>
                        <input 
                            type="radio" 
                            className="hidden" 
                            checked={formState.type === ListingType.OFFER}
                            onChange={() => setFormState({...formState, type: ListingType.OFFER})} 
                        />
                        <span className="text-slate-700 text-sm">Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formState.type === ListingType.REQUEST ? 'border-emerald-600' : 'border-slate-300'}`}>
                             {formState.type === ListingType.REQUEST && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                        </div>
                        <input 
                            type="radio" 
                            className="hidden" 
                            checked={formState.type === ListingType.REQUEST}
                            onChange={() => setFormState({...formState, type: ListingType.REQUEST})} 
                        />
                        <span className="text-slate-700 text-sm">Needed</span>
                    </label>
                </div>
             </div>

             {/* Inputs with bg-white */}
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material Type</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g., Plastic, Organic Waste, Metal"
                    value={formState.material}
                    onChange={e => setFormState({...formState, material: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (kg)</label>
                    <input 
                        type="number" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="100"
                        value={formState.quantity}
                        onChange={e => setFormState({...formState, quantity: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Gurugram, HR"
                        value={formState.location}
                        onChange={e => setFormState({...formState, location: e.target.value})}
                    />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Profile</label>
                <textarea 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                    value={formState.profile}
                    onChange={e => setFormState({...formState, profile: e.target.value})}
                />
             </div>

             <button 
                onClick={handleFindMatches}
                disabled={loading || !formState.material}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
             >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Find Matches
             </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col h-full min-h-[400px]">
            {!hasSearched ? (
                <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <Sparkles className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="font-medium">Your Matches Will Appear Here</p>
                    <p className="text-sm">Fill out the form to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle className="text-emerald-600 w-5 h-5" /> Top Matches Found
                    </h3>
                    
                    {matches.length === 0 && !loading ? (
                        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center">
                            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                            <h4 className="font-bold text-slate-800">No direct matches found</h4>
                            <p className="text-slate-500 text-sm mt-1">Try broadening your search criteria or location.</p>
                        </div>
                    ) : (
                        matches.map((match, idx) => {
                            const listing = getMatchedListingDetails(match.listingId);
                            if (!listing) return null;
                            return (
                                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                                                {match.score}% Match
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {listing.companyName}
                                            </span>
                                        </div>
                                        <ArrowRight className="text-slate-300 w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-1">{listing.material}</h4>
                                    <p className="text-sm text-slate-600 mb-3">{match.reason}</p>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Potential Benefit</p>
                                        <p className="text-sm text-emerald-700 font-medium">{match.potentialSavings}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};