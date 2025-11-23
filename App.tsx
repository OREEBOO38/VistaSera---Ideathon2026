import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Sparkles, 
  FileText, 
  Leaf, 
  UserCircle,
  Menu,
  X,
  Plus,
  LogOut,
  MapPin,
  Building2,
  Recycle,
  ArrowRight,
  Calendar,
  Tag,
  Check,
  Download,
  Edit,
  Verified,
  Save,
  Loader2,
  DollarSign,
  Cloud,
  Smartphone,
  Bell,
  Search,
  Filter,
  Trash2,
  CheckCheck,
  Inbox
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { Listing, ListingType, MaterialType, User, VerificationStatus, Manifest, Notification } from './types';
import { MOCK_LISTINGS, MOCK_MANIFESTS } from './constants';
import { Impact } from './components/Impact';
import { Matchmaking } from './components/Matchmaking';
import { generateImpactAnalysis } from './services/geminiService';

// --- Types & Enums ---
enum View {
  DASHBOARD = 'dashboard',
  MARKETPLACE = 'marketplace',
  MATCHMAKING = 'matchmaking',
  MANIFESTS = 'manifests',
  IMPACT = 'impact',
  PROFILE = 'profile'
}

const COMMON_INDUSTRIES = [
  "Textiles",
  "Manufacturing",
  "Food & Beverage",
  "Food Processing",
  "Recycling",
  "Construction",
  "Chemicals",
  "Automotive",
  "Electronics",
  "Agriculture"
];

// --- Logo Component ---
const VistaSeraLogo: React.FC<{ className?: string, iconSize?: string, textSize?: string }> = ({ 
  className = "", 
  iconSize = "w-8 h-8", 
  textSize = "text-2xl" 
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className={`${iconSize} text-emerald-600`}>
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Bulb Outline */}
        <path d="M30 65 C 10 45 10 15 50 15 C 90 15 90 45 70 65 L 65 80 L 35 80 L 30 65 Z" />
        {/* Base */}
        <line x1="35" y1="80" x2="65" y2="80" />
        <line x1="40" y1="90" x2="60" y2="90" strokeWidth="8" />
        
        {/* Improved Leaf/Sprout Design */}
        <path d="M50 75 L 50 45" strokeWidth="6" /> {/* Stem */}
        <path d="M50 55 C 35 55 25 45 25 30 C 25 30 40 35 50 45" strokeWidth="6" /> {/* Left Leaf */}
        <path d="M50 50 C 65 50 75 40 75 25 C 75 25 60 30 50 40" strokeWidth="6" /> {/* Right Leaf */}
      </svg>
    </div>
    <span className={`${textSize} font-bold text-emerald-950 tracking-tight`}>VistaSera</span>
  </div>
);

// --- Components defined internally for cohesion given the XML constraint ---

const InfoModal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 p-1">
                    <X className="w-5 h-5"/>
                </button>
            </div>
            <div className="text-slate-600 text-sm space-y-4 leading-relaxed">
                {children}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
                <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
                    Understood
                </button>
            </div>
        </div>
    </div>
);

const AuthScreen: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [activeModal, setActiveModal] = useState<'terms' | 'pledge' | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Light background pattern */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10">
        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <VistaSeraLogo iconSize="w-16 h-16" textSize="text-4xl" />
            <p className="text-slate-500 mt-3 font-medium">From waste to opportunity.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(email); }}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" 
                placeholder="you@company.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg shadow-emerald-200 mt-2">
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsSignup(!isSignup)} className="text-sm text-emerald-600 hover:text-emerald-800 font-medium hover:underline">
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
          By continuing, you agree to our 
          <button 
            onClick={() => setActiveModal('terms')} 
            className="text-emerald-600 hover:underline hover:text-emerald-800 mx-1 font-medium focus:outline-none"
          >
             Terms of Service
          </button> 
          & 
          <button 
            onClick={() => setActiveModal('pledge')} 
            className="text-emerald-600 hover:underline hover:text-emerald-800 mx-1 font-medium focus:outline-none"
          >
             Circular Economy Pledge
          </button>.
        </div>
      </div>

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <InfoModal title="Terms of Service" onClose={() => setActiveModal(null)}>
            <p className="font-semibold text-slate-800">1. Introduction</p>
            <p>Welcome to VistaSera. By accessing our platform, you agree to these terms. VistaSera connects businesses to facilitate industrial symbiosis.</p>
            
            <p className="font-semibold text-slate-800">2. Eligibility</p>
            <p>You must be a verified business entity to create listings. You represent that all information provided about your materials is accurate and truthful.</p>
            
            <p className="font-semibold text-slate-800">3. Material Liability</p>
            <p>VistaSera acts as a facilitator. We are not responsible for the quality, safety, or legality of the materials exchanged. It is the responsibility of the transacting parties to ensure compliance with local waste management regulations.</p>
            
            <p className="font-semibold text-slate-800">4. Prohibited Materials</p>
            <p>Hazardous, radioactive, or illegal waste streams are strictly prohibited on the platform.</p>
        </InfoModal>
      )}

      {/* Circular Economy Pledge Modal */}
      {activeModal === 'pledge' && (
        <InfoModal title="Circular Economy Pledge" onClose={() => setActiveModal(null)}>
            <div className="flex items-center gap-3 mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <Leaf className="text-emerald-600 w-8 h-8 flex-shrink-0" />
                <p className="text-emerald-800 font-medium italic">"I commit to turning waste into opportunity."</p>
            </div>
            
            <p>By joining VistaSera, you pledge to uphold the following principles:</p>
            
            <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-slate-800">Prioritize Diversion:</strong> I will seek to reuse or recycle materials before considering landfill disposal.</li>
                <li><strong className="text-slate-800">Transparency:</strong> I will provide accurate descriptions of my material streams to build trust within the ecosystem.</li>
                <li><strong className="text-slate-800">Collaboration:</strong> I will engage fairly with partners to close the loop on resource cycles.</li>
                <li><strong className="text-slate-800">Sustainability:</strong> I strive to measure and reduce my carbon footprint through active participation in the circular economy.</li>
            </ul>
        </InfoModal>
      )}
    </div>
  );
};

const OnboardingScreen: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
      companyName: '',
      industry: 'Textiles',
      location: '',
      size: 'Small (1-50)',
      description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
           <VistaSeraLogo iconSize="w-10 h-10" textSize="text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Business Profile</h2>
        <p className="text-slate-500 mb-8">Help us verify your identity and connect you with the right partners.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500" 
                        placeholder="Acme Industries" 
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry Type</label>
                    <select 
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500"
                        value={formData.industry}
                        onChange={e => setFormData({...formData, industry: e.target.value})}
                    >
                        {COMMON_INDUSTRIES.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500" 
                        placeholder="City, State" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Size</label>
                    <select 
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500"
                        value={formData.size}
                        onChange={e => setFormData({...formData, size: e.target.value})}
                    >
                        <option>Small (1-50)</option>
                        <option>Medium (51-250)</option>
                        <option>Large (250+)</option>
                    </select>
                </div>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Description & Waste Profile</label>
                 <textarea 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500 h-24" 
                    placeholder="Describe what you produce and what waste you generate..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 ></textarea>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors">
                Complete Setup
            </button>
        </form>
      </div>
    </div>
  );
};

const NotificationsDropdown: React.FC<{ 
    notifications: Notification[], 
    onClear: () => void, 
    onMarkAllRead: () => void,
    onClose: () => void
}> = ({ notifications, onClear, onMarkAllRead, onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div ref={dropdownRef} className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[400px] w-full md:w-80">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                <h4 className="font-bold text-slate-700 text-sm">Notifications</h4>
                <div className="flex gap-3">
                    <button onClick={onMarkAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium" disabled={notifications.every(n => n.read)}>
                        Mark all read
                    </button>
                    <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-500">
                        Clear
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                        <Inbox className="w-8 h-8 text-slate-300" />
                        <span className="text-sm">No notifications</span>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-emerald-50/30' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <p className={`font-bold text-sm ${!n.read ? 'text-emerald-900' : 'text-slate-800'}`}>{n.title}</p>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const DashboardView: React.FC<{ manifests: Manifest[], onViewManifests: () => void }> = ({ manifests, onViewManifests }) => {
  
  // Calculate dynamic stats
  const totalWaste = manifests.reduce((acc, m) => {
    // Crude parsing for MVP: extract numbers from "200 kg" string
    const val = parseFloat(m.quantity) || 0; 
    return acc + val;
  }, 0);

  const totalCarbon = manifests.reduce((acc, m) => acc + m.carbonSaved, 0);
  const totalSavings = Math.floor(totalWaste * 12); // Simulating calculation: ₹12 per kg avg savings

  const chartData = useMemo(() => {
    // Generate realistic cumulative data for the chart
    return [
      { name: 'Jan', value: Math.floor(totalWaste * 0.1), savings: Math.floor(totalSavings * 0.1) },
      { name: 'Feb', value: Math.floor(totalWaste * 0.25), savings: Math.floor(totalSavings * 0.25) },
      { name: 'Mar', value: Math.floor(totalWaste * 0.45), savings: Math.floor(totalSavings * 0.45) },
      { name: 'Apr', value: Math.floor(totalWaste * 0.7), savings: Math.floor(totalSavings * 0.7) },
      { name: 'May', value: Math.floor(totalWaste * 0.85), savings: Math.floor(totalSavings * 0.85) },
      { name: 'Jun', value: totalWaste, savings: totalSavings },
    ];
  }, [totalWaste, totalSavings]);

  return (
    <div className="p-4 md:p-8 pb-24 space-y-6">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Waste Diverted</p>
                    <h3 className="text-3xl font-bold text-emerald-600">{totalWaste.toLocaleString()} kg</h3>
                    <p className="text-xs text-slate-400 mt-1">Total since joining</p>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Economic Savings</p>
                    <h3 className="text-3xl font-bold text-blue-600">₹{totalSavings.toLocaleString()}</h3>
                    <p className="text-xs text-slate-400 mt-1">From disposal & material costs</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Carbon Reduction</p>
                    <h3 className="text-3xl font-bold text-emerald-600">{totalCarbon.toLocaleString()} kg <span className="text-lg text-slate-400">CO₂e</span></h3>
                    <p className="text-xs text-slate-400 mt-1">Estimated CO₂ equivalent saved</p>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg">
                    <Cloud className="w-5 h-5 text-emerald-600" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Recent Activity</h3>
                    <p className="text-slate-500 text-sm">Your latest material exchanges.</p>
                </div>
                <button 
                    onClick={onViewManifests}
                    className="text-sm border border-slate-200 px-3 py-1 rounded text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    View All
                </button>
            </div>
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Material</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {manifests.slice(0, 5).map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-medium text-slate-800">{item.material}</td>
                                <td className="px-6 py-4 text-slate-500">{item.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold 
                                        ${item.status === 'Completed' || item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                                          item.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : 
                                          'bg-blue-100 text-blue-700'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Monthly Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
             <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Monthly Performance</h3>
                <p className="text-slate-500 text-sm">Waste diverted and cost savings.</p>
             </div>
             <div className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                        />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#10b981'}} />
                        <Line type="monotone" dataKey="savings" stroke="#1e293b" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#1e293b'}} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};

const ManifestsView: React.FC<{ 
    manifests: Manifest[], 
    currentUserCompany?: string,
    onUpdateStatus: (id: string, status: any) => void
}> = ({ manifests, currentUserCompany, onUpdateStatus }) => {
  
  const downloadCSV = () => {
      const headers = ["Manifest ID", "Date", "Material", "Quantity", "Source", "Destination", "Status", "Carbon Saved"];
      const rows = manifests.map(m => [m.id, m.date, m.material, m.quantity, m.source, m.destination, m.status, m.carbonSaved.toString()]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "vistasera_manifests.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-emerald-600" /> Digital Manifests
          </h2>
          <p className="text-slate-500">Immutable audit trail of your circular transactions.</p>
        </div>
        <button 
            onClick={downloadCSV}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-[85vw] md:max-w-full mx-auto">
          <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4">Manifest ID</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Material</th>
                          <th className="px-6 py-4">Source / Destination</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Carbon Impact</th>
                          <th className="px-6 py-4">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {manifests.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-slate-500">{m.id}</td>
                              <td className="px-6 py-4">{m.date}</td>
                              <td className="px-6 py-4 font-medium text-slate-900">{m.quantity} {m.material}</td>
                              <td className="px-6 py-4 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0"></span>
                                  {m.destination === (currentUserCompany || 'My Company') ? `From: ${m.source}` : `To: ${m.destination}`}
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                      ${m.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 
                                        m.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                                        m.status === 'In Transit' ? 'bg-amber-100 text-amber-800' :
                                        'bg-slate-100 text-slate-800'}`}>
                                      {m.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-emerald-600 font-medium">-{m.carbonSaved} kg CO2</td>
                              <td className="px-6 py-4">
                                  {/* Logic: If I am the destination and it is pending/in-transit, I can verify it */}
                                  {m.destination === (currentUserCompany || 'My Company') && m.status !== 'Completed' && m.status !== 'Verified' && (
                                      <button 
                                        onClick={() => onUpdateStatus(m.id, 'Completed')}
                                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-colors"
                                      >
                                          <CheckCheck className="w-3 h-3" /> Verify Receipt
                                      </button>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

const EditProfileModal: React.FC<{
    user: User;
    onClose: () => void;
    onSave: (updatedData: Partial<User>) => void;
}> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: user.companyName || '',
        industry: user.industry || '',
        location: user.location || '',
        description: user.description || ''
    });

    const [customIndustry, setCustomIndustry] = useState('');
    const [isOtherIndustry, setIsOtherIndustry] = useState(false);

    // Check on init if the current industry is a custom one
    useEffect(() => {
        if (user.industry && !COMMON_INDUSTRIES.includes(user.industry)) {
            setIsOtherIndustry(true);
            setCustomIndustry(user.industry);
            setFormData(prev => ({ ...prev, industry: 'Other' }));
        }
    }, [user.industry]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            industry: isOtherIndustry ? customIndustry : formData.industry
        });
    };

    const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Other') {
            setIsOtherIndustry(true);
            setFormData({ ...formData, industry: 'Other' });
        } else {
            setIsOtherIndustry(false);
            setFormData({ ...formData, industry: val });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Edit Business Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                         <select 
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-emerald-500"
                            value={formData.industry}
                            onChange={handleIndustryChange}
                        >
                            {COMMON_INDUSTRIES.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {isOtherIndustry && (
                             <input 
                                type="text"
                                placeholder="Specify your industry"
                                required={isOtherIndustry}
                                value={customIndustry}
                                onChange={(e) => setCustomIndustry(e.target.value)}
                                className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none animate-in fade-in slide-in-from-top-2"
                             />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Description</label>
                        <textarea 
                            required 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none" 
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={onClose} className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">
                             Cancel
                         </button>
                         <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                             <Save className="w-4 h-4" /> Save Changes
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProfileView: React.FC<{ 
    user: User, 
    listings: Listing[], 
    onUpdateProfile: (u: Partial<User>) => void,
    onLogout: () => void 
}> = ({ user, listings, onUpdateProfile, onLogout }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = (data: Partial<User>) => {
        onUpdateProfile(data);
        setShowEditModal(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="p-4 md:p-8 pb-24 max-w-5xl mx-auto relative">
            {showSuccess && (
                <div className="fixed top-4 right-4 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    <Check className="w-5 h-5" />
                    <span className="font-bold">Profile Updated Successfully!</span>
                </div>
            )}

            <header className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Business Profile</h2>
                <button 
                    onClick={() => setShowEditModal(true)}
                    className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm"
                >
                    <Edit className="w-4 h-4" /> Edit Profile
                </button>
            </header>

            {/* Profile Card - Redesigned to eliminate overlap and match screenshot */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex-shrink-0 shadow-inner"></div>
                        
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-slate-900">{user.companyName}</h1>
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 w-fit">
                                    Verified Partner
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed max-w-3xl mb-6">
                                {user.description || "No description provided."}
                            </p>

                            {/* Meta Data Grid */}
                            <div className="flex flex-wrap gap-6 md:gap-12 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    <span className="font-semibold text-slate-800">Industry:</span> {user.industry || "N/A"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="font-semibold text-slate-800">Location:</span> {user.location || "N/A"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="font-semibold text-slate-800">Member Since:</span> {user.memberSince || "January 2023"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Listings Section */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Listings</h3>
                {listings.length === 0 ? (
                    <div className="text-slate-500 bg-slate-50 p-8 rounded-xl text-center border border-slate-200 border-dashed">
                        No listings found. Create one in the Marketplace!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {listings.map(listing => (
                            <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                                 <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                    {listing.imageUrl ? (
                                        <img src={listing.imageUrl} alt={listing.material} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ShoppingBag className="w-12 h-12" />
                                        </div>
                                    )}
                                    <span className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Verified</span>
                                 </div>
                                 <div className="p-5">
                                     <h4 className="text-lg font-bold text-slate-800 mb-1">{listing.material}</h4>
                                     <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                                        {user.companyName} <span className="text-slate-300">•</span> {listing.location}
                                     </p>
                                     <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                        {listing.description}
                                     </p>
                                     <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                         <span className="font-bold text-slate-900">{listing.quantity} {listing.unit}</span>
                                         <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1">
                                             Details <ArrowRight className="w-3 h-3" />
                                         </button>
                                     </div>
                                 </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Mobile Sign Out Button */}
            <button 
                onClick={onLogout}
                className="w-full md:hidden bg-red-50 text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100 mb-8"
            >
                <LogOut className="w-5 h-5" /> Sign Out
            </button>

            {showEditModal && (
                <EditProfileModal 
                    user={user} 
                    onClose={() => setShowEditModal(false)} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
}

// --- New: Detailed Listing View Modal ---
const ListingDetailModal: React.FC<{
    listing: Listing;
    onClose: () => void;
    onConnect: (listing: Listing) => void;
}> = ({ listing, onClose, onConnect }) => {
    const [connected, setConnected] = useState(false);

    const isOffer = listing.type === ListingType.OFFER;
    const actionText = isOffer ? "Request Material" : "Offer Material";
    
    const handleConnect = () => {
        setConnected(true);
        onConnect(listing);
        setTimeout(onClose, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                <div className="h-32 bg-slate-800 relative">
                     <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                     >
                         <X className="w-5 h-5" />
                     </button>
                     <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                        <div className="w-20 h-20 bg-white rounded-xl p-1 shadow-lg flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-slate-400" />
                        </div>
                     </div>
                </div>
                
                <div className="pt-12 px-8 pb-8">
                     <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900">{listing.material}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                    ${isOffer ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {isOffer ? 'Available' : 'Wanted'}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium flex items-center gap-1">
                                {listing.companyName}
                                {listing.industry && <span className="text-slate-300">•</span>}
                                {listing.industry && <span>{listing.industry}</span>}
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                             <p className="text-3xl font-bold text-emerald-600">
                                {listing.pricePerUnit === 0 ? 'Free' : `₹${listing.pricePerUnit}`}
                                <span className="text-sm font-normal text-slate-500 ml-1">/{listing.unit}</span>
                             </p>
                             <p className="text-sm text-slate-400">Posted {listing.datePosted}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Quantity</p>
                            <p className="text-lg font-bold text-slate-800">{listing.quantity} {listing.unit}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                            <p className="text-lg font-bold text-slate-800 truncate">{listing.location.split(',')[0]}</p>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Category</p>
                            <p className="text-lg font-bold text-slate-800 truncate">{Object.values(MaterialType).find(v => listing.material.includes(v)) || 'General'}</p>
                        </div>
                     </div>

                     <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {listing.description}
                            <br/><br/>
                            This material is available for immediate pickup. Verified manifest will be provided upon transaction completion.
                        </p>
                     </div>

                     <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                        <button 
                            onClick={handleConnect}
                            disabled={connected}
                            className={`px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg transition-all
                            ${connected ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800 hover:translate-y-[-1px]'}`}
                        >
                            {connected ? (
                                <>
                                    <Check className="w-5 h-5" /> Request Sent
                                </>
                            ) : (
                                <>
                                    {actionText} <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
}

// --- Refactored Create Listing Modal ---
const CreateListingModal: React.FC<{
    onClose: () => void;
    onCreate: (l: Listing) => void;
}> = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        type: 'OFFER',
        material: '',
        industry: '',
        quantity: '',
        unit: 'kg',
        location: '',
        description: ''
    });

    // States for "Other" functionality
    const [isOtherMaterial, setIsOtherMaterial] = useState(false);
    const [customMaterial, setCustomMaterial] = useState('');

    const [isOtherIndustry, setIsOtherIndustry] = useState(false);
    const [customIndustry, setCustomIndustry] = useState('');

    const [isOtherUnit, setIsOtherUnit] = useState(false);
    const [customUnit, setCustomUnit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newListing: Listing = {
            id: `l-${Date.now()}`,
            userId: 'me',
            companyName: 'My Company', // In real app, get from context
            type: formData.type === 'OFFER' ? ListingType.OFFER : ListingType.REQUEST,
            material: (isOtherMaterial ? customMaterial : formData.material) as any,
            industry: isOtherIndustry ? customIndustry : formData.industry,
            quantity: Number(formData.quantity),
            unit: (isOtherUnit ? customUnit : formData.unit) as any,
            pricePerUnit: 0, // Default to Negotiable
            location: formData.location,
            description: formData.description,
            datePosted: new Date().toISOString().split('T')[0],
            imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600' // Placeholder for user created
        };
        onCreate(newListing);
        onClose();
    };

    // Handler helpers
    const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'Other') {
            setIsOtherMaterial(true);
            setFormData(prev => ({...prev, material: 'Other'}));
        } else {
            setIsOtherMaterial(false);
            setFormData(prev => ({...prev, material: e.target.value}));
        }
    };

    const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'Other') {
            setIsOtherIndustry(true);
            setFormData(prev => ({...prev, industry: 'Other'}));
        } else {
            setIsOtherIndustry(false);
            setFormData(prev => ({...prev, industry: e.target.value}));
        }
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'Other') {
            setIsOtherUnit(true);
            setFormData(prev => ({...prev, unit: 'Other'}));
        } else {
            setIsOtherUnit(false);
            setFormData(prev => ({...prev, unit: e.target.value}));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 text-emerald-900">Create a New Listing</h3>
                    <p className="text-slate-500 text-sm mt-1">Fill in the details below to add your material to the marketplace.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Radio Group for Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">This material is...</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.type === 'OFFER' ? 'border-emerald-600' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                    {formData.type === 'OFFER' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                                </div>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    className="hidden" 
                                    checked={formData.type === 'OFFER'}
                                    onChange={() => setFormData({...formData, type: 'OFFER'})} 
                                />
                                <span className={`${formData.type === 'OFFER' ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>Available (Waste/By-product)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.type === 'REQUEST' ? 'border-emerald-600' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                    {formData.type === 'REQUEST' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                                </div>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    className="hidden" 
                                    checked={formData.type === 'REQUEST'}
                                    onChange={() => setFormData({...formData, type: 'REQUEST'})} 
                                />
                                <span className={`${formData.type === 'REQUEST' ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>Needed (Input Material)</span>
                            </label>
                        </div>
                    </div>

                    {/* Material Name (Dropdown + Other) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                        <select
                            required
                            value={formData.material}
                            onChange={handleMaterialChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            <option value="" disabled>Select Material</option>
                            {Object.values(MaterialType).map(m => <option key={m} value={m}>{m}</option>)}
                            <option value="Other">Other</option>
                        </select>
                        {isOtherMaterial && (
                             <input 
                                type="text"
                                placeholder="Specify material"
                                required={isOtherMaterial}
                                value={customMaterial}
                                onChange={(e) => setCustomMaterial(e.target.value)}
                                className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none animate-in fade-in slide-in-from-top-2"
                             />
                        )}
                    </div>

                    {/* Industry (Dropdown + Other) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Industry</label>
                         <select
                            required
                            value={formData.industry}
                            onChange={handleIndustryChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            <option value="" disabled>Select Industry</option>
                            {COMMON_INDUSTRIES.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {isOtherIndustry && (
                             <input 
                                type="text"
                                placeholder="Specify your industry"
                                required={isOtherIndustry}
                                value={customIndustry}
                                onChange={(e) => setCustomIndustry(e.target.value)}
                                className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none animate-in fade-in slide-in-from-top-2"
                             />
                        )}
                    </div>

                    {/* Quantity Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                             <input 
                                type="number" 
                                required 
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                                placeholder="100" 
                             />
                        </div>
                        <div className="col-span-1">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                             <select 
                                value={formData.unit}
                                onChange={handleUnitChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                             >
                                 <option value="kg">kg</option>
                                 <option value="tons">tons</option>
                                 <option value="liters">liters</option>
                                 <option value="units">units</option>
                                 <option value="Other">Other</option>
                             </select>
                             {isOtherUnit && (
                                <input 
                                    type="text"
                                    placeholder="Unit"
                                    required={isOtherUnit}
                                    value={customUnit}
                                    onChange={(e) => setCustomUnit(e.target.value)}
                                    className="w-full mt-1 px-2 py-1 text-sm rounded border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none animate-in fade-in slide-in-from-top-2"
                                />
                             )}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400" 
                            placeholder="e.g., Gurugram, HR" 
                        />
                    </div>

                     {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400 h-28 resize-none" 
                            placeholder="Provide details on the material's condition, packaging, and any other relevant information."
                        />
                    </div>

                    <div className="pt-2">
                         <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg">
                             Create Listing
                         </button>
                         <button type="button" onClick={onClose} className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 mt-2">
                             Cancel
                         </button>
                    </div>

                </form>
            </div>
        </div>
    );
};


const MarketplaceView: React.FC<{ 
    listings: Listing[], 
    onCreate: (l: Listing) => void,
    onConnect: (l: Listing) => void
}> = ({ listings, onCreate, onConnect }) => {
  const [activeTab, setActiveTab] = useState<ListingType>(ListingType.OFFER);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Filter logic
  const filteredListings = listings.filter(l => {
      const matchType = l.type === activeTab;
      const matchSearch = l.material.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter ? l.material === categoryFilter : true;
      
      return matchType && matchSearch && matchCategory;
  });

  return (
    <div className="p-4 md:p-8 pb-24">
       <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-emerald-600" /> Marketplace
          </h2>
          <p className="text-slate-500">Browse materials or post requests.</p>
        </div>
        <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md shadow-emerald-100 flex items-center gap-2 transition-all"
        >
            <Plus className="w-4 h-4" /> New Listing
        </button>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                  type="text"
                  placeholder="Search by material, location, or keyword..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <div className="w-full md:w-64 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
              >
                  <option value="">All Categories</option>
                  {Object.values(MaterialType).map(m => (
                      <option key={m} value={m}>{m}</option>
                  ))}
              </select>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-xl bg-slate-200 p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab(ListingType.OFFER)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === ListingType.OFFER 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Available Materials
        </button>
        <button
           onClick={() => setActiveTab(ListingType.REQUEST)}
           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === ListingType.REQUEST 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Material Requests
        </button>
      </div>

      {filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-600">No listings found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your filters or create a new listing.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col h-full group overflow-hidden">
                    {listing.imageUrl && (
                        <div className="h-40 w-full overflow-hidden relative">
                            <img src={listing.imageUrl} alt={listing.material} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm
                                    ${listing.type === ListingType.OFFER ? 'bg-emerald-50 text-white' : 'bg-blue-50 text-white'}`}>
                                    {listing.type === ListingType.OFFER ? 'For Sale' : 'Wanted'}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="p-5 flex-1">
                        {!listing.imageUrl && (
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide 
                                    ${listing.type === ListingType.OFFER ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {listing.type === ListingType.OFFER ? 'For Sale' : 'Wanted'}
                                </span>
                                <span className="text-slate-400 text-xs flex items-center gap-1">
                                    <Calendar className="w-3 h-3"/> {listing.datePosted}
                                </span>
                            </div>
                        )}
                        <h3 className="font-bold text-slate-800 text-lg mb-1 truncate" title={listing.material}>{listing.material}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[2.5em]">{listing.description}</p>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{listing.companyName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{listing.location.split(',')[0]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center">
                        <div className="font-mono font-semibold text-slate-700">
                            {listing.quantity} {listing.unit}
                        </div>
                        <button 
                            onClick={() => setViewingListing(listing)}
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Details <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {showCreateModal && (
          <CreateListingModal onClose={() => setShowCreateModal(false)} onCreate={onCreate} />
      )}

      {viewingListing && (
          <ListingDetailModal 
            listing={viewingListing} 
            onClose={() => setViewingListing(null)} 
            onConnect={onConnect}
          />
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  // Persistent State Initialization
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vs_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('vs_listings');
    return saved ? JSON.parse(saved) : MOCK_LISTINGS;
  });

  const [manifests, setManifests] = useState<Manifest[]>(() => {
    const saved = localStorage.getItem('vs_manifests');
    return saved ? JSON.parse(saved) : MOCK_MANIFESTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('vs_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [impactSummary, setImpactSummary] = useState<string>("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Persistence Effects ---
  useEffect(() => {
    if (user) localStorage.setItem('vs_user', JSON.stringify(user));
    else localStorage.removeItem('vs_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vs_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('vs_manifests', JSON.stringify(manifests));
  }, [manifests]);

  useEffect(() => {
    localStorage.setItem('vs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // --- Scroll to top ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // --- PWA Install Prompt Listener ---
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };

  // --- Initial load effect ---
  useEffect(() => {
      if (user && user.isProfileComplete) {
          generateImpactAnalysis(manifests).then(setImpactSummary);

          const hasUserListing = listings.some(l => l.userId === user.id || l.userId === 'me');
          if (!hasUserListing) {
               const myDefaultListing: Listing = {
                    id: 'my-1',
                    userId: user.id, 
                    companyName: user.companyName || 'GreenLeaf Organics',
                    industry: user.industry || 'Food & Beverage',
                    type: ListingType.OFFER,
                    material: MaterialType.PLASTIC,
                    quantity: 500,
                    unit: 'kg',
                    pricePerUnit: 0,
                    location: user.location || 'Gurugram, HR',
                    description: 'Clean, baled HDPE plastic from milk jug overruns. Available weekly. Seeking a long-term recycling partner.',
                    datePosted: '2023-10-30',
                    imageUrl: 'https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?auto=format&fit=crop&q=80&w=600'
               };
               setListings(prev => [myDefaultListing, ...prev]);
          }
      }
  }, [user, manifests.length]); 

  const handleLogin = (email: string) => {
    setUser({
      id: 'me',
      name: email.split('@')[0],
      email: email,
      isProfileComplete: false,
      industry: 'Textiles',
      location: 'Gurugram, India',
      description: '',
      memberSince: 'October 2023'
    });
  };

  const handleLogout = () => {
      setUser(null);
      setCurrentView(View.DASHBOARD);
  };

  const handleOnboardingComplete = (data: any) => {
    if (!user) return;
    setUser({
      ...user,
      companyName: data.companyName || 'GreenLeaf Organics',
      industry: data.industry,
      location: data.location,
      description: data.description,
      isProfileComplete: true,
      size: data.size
    });
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
      if (!user) return;
      setUser({
          ...user,
          ...updatedData
      });
      addNotification(`Profile Updated`, `Your business profile information has been saved.`);
  };

  const handleCreateListing = (l: Listing) => {
      setListings([l, ...listings]);
      addNotification(`New Listing Created`, `Your listing for ${l.quantity} ${l.unit} of ${l.material} is now live.`);
  };

  const handleConnect = (l: Listing) => {
      // Create a PENDING Manifest
      const newManifest: Manifest = {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          material: l.material,
          quantity: `${l.quantity} ${l.unit}`,
          source: l.type === ListingType.OFFER ? l.companyName : (user?.companyName || 'My Company'),
          destination: l.type === ListingType.OFFER ? (user?.companyName || 'My Company') : l.companyName,
          status: 'Pending',
          carbonSaved: 0 // Will be updated when verified
      };
      setManifests([newManifest, ...manifests]);
      addNotification(`Request Sent`, `You initiated a request for ${l.material}. Track it in Manifests.`);
  };

  // --- Notifications Handlers ---
  const addNotification = (title: string, message: string) => {
      const newNotif: Notification = {
          id: Date.now().toString(),
          title,
          message,
          date: new Date().toLocaleTimeString(),
          read: false,
          type: 'success'
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const handleClearNotifications = () => setNotifications([]);
  
  const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleUpdateManifestStatus = (id: string, newStatus: 'Completed' | 'Verified') => {
      setManifests(prev => prev.map(m => {
          if (m.id === id) {
              const carbon = Math.floor(Math.random() * 100) + 50; // Simulate carbon calc
              return { ...m, status: newStatus, carbonSaved: carbon };
          }
          return m;
      }));
      addNotification('Receipt Verified', `Manifest #${id} marked as completed. Carbon impact recorded.`);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (!user.isProfileComplete) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <DashboardView manifests={manifests} onViewManifests={() => setCurrentView(View.MANIFESTS)} />;
      case View.MARKETPLACE:
        return <MarketplaceView 
                  listings={listings} 
                  onCreate={handleCreateListing} 
                  onConnect={handleConnect}
                />;
      case View.MATCHMAKING:
        return <Matchmaking userListings={listings.filter(l => l.userId === user.id)} allListings={listings} />;
      case View.IMPACT:
        return <Impact summary={impactSummary} />;
      case View.MANIFESTS:
        return <ManifestsView 
                  manifests={manifests} 
                  currentUserCompany={user.companyName}
                  onUpdateStatus={handleUpdateManifestStatus}
                />;
      case View.PROFILE:
        return <ProfileView 
                  user={user} 
                  listings={listings.filter(l => l.userId === user.id)} 
                  onUpdateProfile={handleUpdateProfile} 
                  onLogout={handleLogout}
                />;
      default:
        return <div>View Not Found</div>;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setSidebarOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all ${
        currentView === view 
          ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${currentView === view ? 'text-emerald-600' : 'text-slate-400'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6">
           <VistaSeraLogo />
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.MARKETPLACE} icon={ShoppingBag} label="Marketplace" />
          <NavItem view={View.MATCHMAKING} icon={Sparkles} label="AI Matchmaking" />
          <NavItem view={View.MANIFESTS} icon={FileText} label="Manifests" />
          <NavItem view={View.IMPACT} icon={Leaf} label="Impact Report" />
          
          {deferredPrompt && (
             <div className="px-4 mt-6">
                <button 
                    onClick={handleInstallClick}
                    className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Smartphone className="w-4 h-4" /> Install App
                </button>
             </div>
          )}
        </nav>
        <div className="p-4 border-t border-slate-100">
             <NavItem view={View.PROFILE} icon={UserCircle} label="Profile" />
             <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all mt-1">
                 <LogOut className="w-5 h-5" />
                 <span>Sign Out</span>
             </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <VistaSeraLogo iconSize="w-8 h-8" textSize="text-lg" />
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
             >
                <Bell className="w-6 h-6" />
                {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
             </button>
             {deferredPrompt && (
                <button 
                    onClick={handleInstallClick}
                    className="text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1"
                >
                    <Smartphone className="w-3 h-3" /> Install
                </button>
            )}
          </div>
      </div>

      {/* Desktop Floating Notification Bell */}
      <div className="hidden md:block fixed top-6 right-8 z-50">
         <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="p-2.5 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 relative transition-transform hover:scale-105 active:scale-95"
         >
             <Bell className="w-5 h-5 text-slate-600" />
             {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
             )}
         </button>
         
         {/* Desktop Dropdown Positioning */}
         {showNotifications && (
            <div className="absolute right-0 top-14 w-80">
                 <NotificationsDropdown 
                    notifications={notifications}
                    onClear={handleClearNotifications}
                    onMarkAllRead={handleMarkAllRead}
                    onClose={() => setShowNotifications(false)}
                 />
            </div>
         )}
      </div>

      {/* Mobile Dropdown Positioning */}
      {showNotifications && (
         <>
            <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setShowNotifications(false)} />
            <div className="fixed top-16 right-2 left-2 z-50 md:hidden">
                 <NotificationsDropdown 
                    notifications={notifications}
                    onClear={handleClearNotifications}
                    onMarkAllRead={handleMarkAllRead}
                    onClose={() => setShowNotifications(false)}
                 />
            </div>
         </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 mt-16 md:mt-0 min-h-screen">
        {renderView()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-4 py-2 flex justify-between shadow-lg">
          {[
             { v: View.DASHBOARD, i: LayoutDashboard, l: "Home" },
             { v: View.MARKETPLACE, i: ShoppingBag, l: "Market" },
             { v: View.MATCHMAKING, i: Sparkles, l: "AI" },
             { v: View.MANIFESTS, i: FileText, l: "Docs" },
             { v: View.PROFILE, i: UserCircle, l: "Profile" },
          ].map((item) => (
              <button 
                key={item.v}
                onClick={() => setCurrentView(item.v)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${currentView === item.v ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                  <item.i className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">{item.l}</span>
              </button>
          ))}
      </div>
    </div>
  );
}