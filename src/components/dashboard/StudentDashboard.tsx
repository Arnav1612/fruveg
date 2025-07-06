import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Applied', value: 15 },
  { name: 'Shortlisted', value: 8 },
  { name: 'Interviews', value: 5 },
  { name: 'Selected', value: 2 },
];

export function StudentDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Applications</h3>
          <p className="text-3xl font-bold text-indigo-600">15</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Interviews</h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Offers</h3>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4">
                <p className="font-semibold">Tech Company {i + 1}</p>
                <p className="text-sm text-gray-600">Software Engineer</p>
                <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Company {i + 1}</p>
                  <p className="text-sm text-gray-600">Position {i + 1}</p>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}