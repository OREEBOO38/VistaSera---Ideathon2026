import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Leaf, DollarSign, Factory } from 'lucide-react';

const wasteData = [
  { name: 'Jan', plastic: 400, organic: 240, metal: 240 },
  { name: 'Feb', plastic: 300, organic: 139, metal: 221 },
  { name: 'Mar', plastic: 200, organic: 980, metal: 229 },
  { name: 'Apr', plastic: 278, organic: 390, metal: 200 },
  { name: 'May', plastic: 189, organic: 480, metal: 218 },
];

const savingsData = [
  { name: 'Jan', savings: 1200 },
  { name: 'Feb', savings: 2100 },
  { name: 'Mar', savings: 4500 },
  { name: 'Apr', savings: 4800 },
  { name: 'May', savings: 6000 },
];

export const Impact: React.FC<{ summary: string }> = ({ summary }) => {
  return (
    <div className="space-y-6 p-4 md:p-8 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Leaf className="text-emerald-600" /> Impact Dashboard
        </h2>
        <p className="text-slate-500">Visualizing your contribution to the circular economy.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="p-3 bg-emerald-100 rounded-full mb-2">
                <Leaf className="text-emerald-600 w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">12.5 tons</h3>
            <p className="text-sm text-slate-500">Total Waste Diverted</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="p-3 bg-blue-100 rounded-full mb-2">
                <DollarSign className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">₹4.2 Lakh</h3>
            <p className="text-sm text-slate-500">Net Cost Savings</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="p-3 bg-amber-100 rounded-full mb-2">
                <Factory className="text-amber-600 w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">850 kg</h3>
            <p className="text-sm text-slate-500">CO2 Emissions Avoided</p>
        </div>
      </div>

      {summary && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-800 mb-6">
          <h4 className="font-semibold flex items-center gap-2 mb-1">
             AI Impact Summary
          </h4>
          <p className="text-sm">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-[300px]">
          <h3 className="font-semibold text-slate-700 mb-4">Waste Diverted by Type (kg)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wasteData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="plastic" stackId="a" fill="#10b981" name="Plastic" />
              <Bar dataKey="organic" stackId="a" fill="#f59e0b" name="Organic" />
              <Bar dataKey="metal" stackId="a" fill="#6366f1" name="Metal" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-[300px]">
          <h3 className="font-semibold text-slate-700 mb-4">Cumulative Cost Savings (₹)</h3>
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="savings" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};