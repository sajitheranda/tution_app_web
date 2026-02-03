"use client";
import { ClassType } from '@/types/class';
import { useAuth } from '@/context/AuthContext';

interface ClassDetailsModalProps {
  classItem: ClassType;
  onClose: () => void;
  onEdit?: (classItem: ClassType) => void;
}

export default function ClassDetailsModal({ classItem, onClose, onEdit }: ClassDetailsModalProps) {
  const { user } = useAuth();
  const isOwner = user && classItem.teacherEmail === user.email;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      case 'mass': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return '👤';
      case 'group': return '👥';
      case 'mass': return '🏫';
      default: return '📚';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(classItem.type)}`}>
                {getTypeIcon(classItem.type)} {classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1)} Class
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{classItem.subject}</h2>
              <p className="text-xl text-gray-600 mt-1">{classItem.grade}</p>
            </div>
            <div className="flex gap-2">
              {isOwner && onEdit && (
                <button
                  onClick={() => onEdit(classItem)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Class
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Image Banner */}
          {classItem.image && (
            <div className="mb-8 rounded-xl overflow-hidden h-64 md:h-80 w-full">
              <img
                src={classItem.image}
                alt={classItem.subject}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Class</h3>
                <p className="text-gray-700 leading-relaxed">{classItem.description}</p>
              </div>

              {/* Teacher Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Teacher Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Name:</span>
                    <span className="font-medium">{classItem.teacherName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Email:</span>
                    <span className="font-medium">{classItem.teacherEmail}</span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Class Schedule</h3>
                <div className="space-y-3">
                  {classItem.times.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-gray-900">{time.day}</div>
                        <div className="text-gray-600">
                          {time.startTime} - {time.endTime}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${time.location === 'Online'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {time.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="space-y-6">
              {/* Price & Enrollment */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{classItem.price}</div>
                    <div className="text-sm text-gray-600">Per session</div>
                  </div>

                  <div className="text-center pt-3 border-t border-blue-200">
                    <div className="text-sm text-gray-600">Contact Number</div>
                    <div className="text-xl font-bold text-gray-900">{classItem.phoneNumber}</div>
                  </div>

                  {classItem.type === 'individual' && (
                    <div className="text-center pt-3">
                      <div className="text-sm text-gray-600">Available Slots</div>
                      <div className="text-2xl font-bold text-blue-600">{classItem.availableSlots}</div>
                    </div>
                  )}

                  {(classItem.type === 'group' || classItem.type === 'mass') && (
                    <div className="text-center pt-3">
                      <div className="text-sm text-gray-600">Enrollment</div>
                      <div className="text-2xl font-bold text-green-600">
                        {classItem.currentStudents}/{classItem.maxStudents}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((classItem.currentStudents / classItem.maxStudents) * 100)}% filled
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Class Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Class Type</div>
                    <div className="font-medium capitalize">{classItem.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Subject</div>
                    <div className="font-medium">{classItem.subject}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Grade Level</div>
                    <div className="font-medium">{classItem.grade}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Sessions</div>
                    <div className="font-medium">{classItem.times.length} time slots</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Created</div>
                    <div className="font-medium">{formatDate(classItem.createdAt)}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}