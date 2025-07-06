import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Total', value: 50 },
  { name: 'Shortlisted', value: 20 },
  { name: 'Interviewed', value: 15 },
  { name: 'Selected', value: 5 },
];

export function RecruiterDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Recruiter Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-indigo-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">50</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Scheduled Interviews</h3>
          <p className="text-3xl font-bold text-blue-600">15</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications Overview</h2>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">John Doe {i + 1}</p>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4">
                <p className="font-semibold">Jane Smith {i + 1}</p>
                <p className="text-sm text-gray-600">Frontend Developer</p>
                <p className="text-sm text-gray-500">Tomorrow at 2:00 PM</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}