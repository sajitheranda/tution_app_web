"use client";
import { useState } from 'react';
import { ClassFormData, ClassTime } from '@/types/class';
import { subjects, grades, locations } from '@/data/dummyData';
import { useAuth } from '@/context/AuthContext';

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  initialData?: ClassFormData;
}

export default function ClassForm({ onSubmit, onCancel, initialData }: ClassFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ClassFormData>(initialData || {
    type: 'individual',
    subject: '',
    grade: '',
    description: '',
    times: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', location: '' }],
    price: '',
    phoneNumber: '',
    image: '',
    maxStudents: 10,
    availableSlots: 1,
  });

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, { day: 'Monday', startTime: '09:00', endTime: '10:00', location: '' }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, field: keyof ClassTime, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((time, i) =>
        i === index ? { ...time, [field]: value } : time
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {initialData ? 'Edit Class' : 'Add New Class'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Type</label>
              <div className="grid grid-cols-3 gap-4">
                {(['individual', 'group', 'mass'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.type === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    <div className="text-2xl mb-2">
                      {type === 'individual' && '👤'}
                      {type === 'group' && '👥'}
                      {type === 'mass' && '🏫'}
                    </div>
                    <div className="font-medium capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your class, teaching methods, topics covered..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., LKR 1500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 0771234567"
              />
            </div>



            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img
                    src={formData.image}
                    alt="Class preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Class Specific Fields */}

            {(formData.type === 'group' || formData.type === 'mass') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Time Slots with Location */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Schedule & Locations</label>
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Time Slot
                </button>
              </div>

              <div className="space-y-4">
                {formData.times.map((time, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <select
                        value={time.day}
                        onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Day</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={time.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                      <input
                        type="time"
                        value={time.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                      <select
                        value={time.location}
                        onChange={(e) => updateTimeSlot(index, 'location', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {formData.times.length > 1 && (
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <span>✕</span>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {initialData ? 'Update Class' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
}