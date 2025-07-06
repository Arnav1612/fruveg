import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { Trash2, PlusCircle, XCircle, Info } from 'lucide-react';

interface WasteForm {
  type: 'rotten' | 'reusable';
  description: string;
  weight: number;
  items: { name: string; quantity: number; weight: number }[];
  notes: string;
}

const AddWaste: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<WasteForm>({
    defaultValues: {
      type: 'reusable',
      description: '',
      weight: 0,
      items: [{ name: '', quantity: 1, weight: 0 }],
      notes: ''
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });
  
  const watchItems = watch('items');
  const totalWeight = watchItems.reduce((sum, item) => sum + (parseFloat(item.weight.toString()) || 0), 0);
  
  const onSubmit = async (data: WasteForm) => {
    try {
      setSubmitting(true);
      // Update the total weight based on items
      data.weight = totalWeight;
      
      await axios.post('/api/waste', data);
      navigate('/waste', { state: { success: 'Waste added successfully!' } });
    } catch (error) {
      console.error('Failed to add waste:', error);
      alert('Failed to add waste. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Trash2 className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Waste</h1>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Waste Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Waste Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="reusable"
                      {...register('type', { required: 'Type is required' })}
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Reusable</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="rotten"
                      {...register('type', { required: 'Type is required' })}
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rotten</span>
                  </label>
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="description"
                    placeholder="Brief description of waste"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
              
              {/* Waste Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Waste Items
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: '', quantity: 1, weight: 0 })}
                    className="inline-flex items-center px-2 py-1 border border-transparent rounded text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 focus:outline-none"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-wrap -mx-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="px-2 w-full sm:w-1/2 mb-2 sm:mb-0">
                        <label htmlFor={`items.${index}.name`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Item Name
                        </label>
                        <input
                          type="text"
                          id={`items.${index}.name`}
                          className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                          {...register(`items.${index}.name` as const, { required: 'Name is required' })}
                        />
                        {errors.items?.[index]?.name && (
                          <p className="mt-1 text-xs text-red-600">{errors.items[index].name?.message}</p>
                        )}
                      </div>
                      
                      <div className="px-2 w-1/2 sm:w-1/4">
                        <label htmlFor={`items.${index}.quantity`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id={`items.${index}.quantity`}
                          min="1"
                          className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                          {...register(`items.${index}.quantity` as const, { 
                            required: 'Required',
                            min: { value: 1, message: 'Min 1' },
                            valueAsNumber: true
                          })}
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="mt-1 text-xs text-red-600">{errors.items[index].quantity?.message}</p>
                        )}
                      </div>
                      
                      <div className="px-2 w-1/2 sm:w-1/4">
                        <label htmlFor={`items.${index}.weight`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          id={`items.${index}.weight`}
                          step="0.01"
                          min="0.01"
                          className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                          {...register(`items.${index}.weight` as const, { 
                            required: 'Required',
                            min: { value: 0.01, message: 'Min 0.01' },
                            valueAsNumber: true
                          })}
                        />
                        {errors.items?.[index]?.weight && (
                          <p className="mt-1 text-xs text-red-600">{errors.items[index].weight?.message}</p>
                        )}
                      </div>
                      
                      <div className="px-2 w-full flex justify-end mt-2">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="inline-flex items-center text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Weight */}
                <div className="mt-3 flex items-center">
                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Total Weight: <span className="font-bold">{totalWeight.toFixed(2)} kg</span>
                  </span>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Additional Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Any additional details..."
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    {...register('notes')}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/waste')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Waste'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWaste;