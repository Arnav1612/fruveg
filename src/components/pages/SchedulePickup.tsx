import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Calendar, Clock, Trash2, TruckIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Waste } from '../../types';

const timeSlots = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM'
];

interface FormData {
  scheduledDate: string;
  timeSlot: string;
  wasteItems: string[];
  collectionNotes: string;
}

const SchedulePickup: React.FC = () => {
  const [availableWaste, setAvailableWaste] = useState<Waste[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      timeSlot: timeSlots[0],
      wasteItems: [],
      collectionNotes: ''
    }
  });

  useEffect(() => {
    const fetchAvailableWaste = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/waste');
        // Filter only pending waste items
        const pendingWaste = data.filter((waste: Waste) => waste.status === 'pending');
        setAvailableWaste(pendingWaste);
      } catch (error) {
        console.error('Failed to fetch waste data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableWaste();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (data.wasteItems.length === 0) {
      alert('Please select at least one waste item for pickup');
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.post('/api/pickups', data);
      navigate('/dashboard', { state: { success: 'Pickup scheduled successfully!' } });
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
      alert('Failed to schedule pickup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total weight
  const selectedWasteItems = availableWaste.filter(waste => 
    control._formValues.wasteItems?.includes(waste._id)
  );
  const totalWeight = selectedWasteItems.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <TruckIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Schedule Waste Pickup</h1>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Pickup Date
                    </div>
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      id="scheduledDate"
                      min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      {...register('scheduledDate', { required: 'Date is required' })}
                    />
                    {errors.scheduledDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Time Slot Selection */}
                <div>
                  <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Time Slot
                    </div>
                  </label>
                  <div className="mt-1">
                    <select
                      id="timeSlot"
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      {...register('timeSlot', { required: 'Time slot is required' })}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.timeSlot && (
                      <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Waste Items Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Select Waste Items for Pickup
                    </div>
                  </label>
                  
                  {availableWaste.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No waste items available for pickup</p>
                      <button
                        type="button"
                        onClick={() => navigate('/waste/add')}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Add Waste Item
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-md p-2">
                      <Controller
                        name="wasteItems"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            {availableWaste.map((waste) => (
                              <div key={waste._id} className="flex items-start border-b border-gray-200 dark:border-gray-600 pb-2">
                                <input
                                  type="checkbox"
                                  id={waste._id}
                                  value={waste._id}
                                  checked={field.value.includes(waste._id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const value = e.target.value;
                                    if (checked) {
                                      field.onChange([...field.value, value]);
                                    } else {
                                      field.onChange(field.value.filter((id: string) => id !== value));
                                    }
                                  }}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <label htmlFor={waste._id} className="ml-3 block">
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {waste.description}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <span>{waste.weight} kg</span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-opacity-50 inline-block capitalize
                                      {waste.type === 'rotten' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}"
                                    >
                                      {waste.type}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {format(new Date(waste.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Total Weight */}
                  <div className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Weight: <span className="font-bold">{totalWeight.toFixed(2)} kg</span>
                  </div>
                </div>
                
                {/* Collection Notes */}
                <div>
                  <label htmlFor="collectionNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Additional Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="collectionNotes"
                      rows={3}
                      placeholder="Any special instructions for pickup..."
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      {...register('collectionNotes')}
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || availableWaste.length === 0}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Scheduling...' : 'Schedule Pickup'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePickup;