import React, { useEffect, useState } from 'react';
import { Calendar, Trash, ArrowUpCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { Pickup, Waste } from '../../types';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [upcomingPickups, setUpcomingPickups] = useState<Pickup[]>([]);
  const [wasteStats, setWasteStats] = useState<{
    rotten: { totalWeight: number; count: number },
    reusable: { totalWeight: number; count: number }
  }>({
    rotten: { totalWeight: 0, count: 0 },
    reusable: { totalWeight: 0, count: 0 }
  });
  const [recentWaste, setRecentWaste] = useState<Waste[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        // Fetch upcoming pickups
        const pickupsRes = await axios.get('/api/pickups/upcoming/list');
        setUpcomingPickups(pickupsRes.data);
        
        // Fetch waste statistics
        const statsRes = await axios.get('/api/waste/stats/total');
        const statsData = statsRes.data;
        
        const rottenData = statsData.find((item: any) => item._id === 'rotten') || { totalWeight: 0, count: 0 };
        const reusableData = statsData.find((item: any) => item._id === 'reusable') || { totalWeight: 0, count: 0 };
        
        setWasteStats({
          rotten: { totalWeight: rottenData.totalWeight, count: rottenData.count },
          reusable: { totalWeight: reusableData.totalWeight, count: reusableData.count }
        });
        
        // Fetch recent waste entries
        const wasteRes = await axios.get('/api/waste');
        setRecentWaste(wasteRes.data.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [authState.user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Waste</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {(wasteStats.rotten.totalWeight + wasteStats.reusable.totalWeight).toFixed(2)} kg
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 mr-4">
                <Trash className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rotten Waste</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {wasteStats.rotten.totalWeight.toFixed(2)} kg
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-4">
                <ArrowUpCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Reusable Waste</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {wasteStats.reusable.totalWeight.toFixed(2)} kg
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 mr-4">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming Pickups</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {upcomingPickups.length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Waste */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Waste Entries</h2>
            </div>
            <div className="p-4">
              {recentWaste.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No waste entries yet
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentWaste.map((waste) => (
                    <li key={waste._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          waste.type === 'rotten' 
                            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        }`}>
                          <Trash className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {waste.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {waste.weight} kg - {waste.type === 'rotten' ? 'Rotten' : 'Reusable'} waste
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(waste.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Upcoming Pickups */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Pickups</h2>
            </div>
            <div className="p-4">
              {upcomingPickups.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No upcoming pickups
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingPickups.map((pickup) => (
                    <li key={pickup._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            Scheduled Pickup
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(pickup.scheduledDate), 'MMM dd, yyyy')} - {pickup.timeSlot}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total: {pickup.totalWeight} kg
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pickup.status === 'scheduled' 
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' 
                            : pickup.status === 'in-progress'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {/* Capacity Warning */}
        {(wasteStats.rotten.totalWeight + wasteStats.reusable.totalWeight) > 100 && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 transition-colors duration-300">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Your waste capacity is reaching its limit. Consider scheduling a pickup soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;