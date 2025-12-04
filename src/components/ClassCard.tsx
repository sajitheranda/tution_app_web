"use client";
import { ClassType } from '@/types/class';
import { useAuth } from '@/context/AuthContext';

interface ClassCardProps {
  classItem: ClassType;
  onEdit?: (classItem: ClassType) => void;
  onViewDetails?: (classItem: ClassType) => void;
}

export default function ClassCard({ classItem, onEdit, onViewDetails }: ClassCardProps) {
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

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(classItem);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (onEdit) {
      onEdit(classItem);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
              {getTypeIcon(classItem.type)} {classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1)}
            </span>
          </div>
          {isOwner && onEdit && (
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
              title="Edit class"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Class Info */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{classItem.subject}</h3>
        <p className="text-gray-600 mb-3">{classItem.grade}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>

        {/* Teacher Info */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="w-5">👨‍🏫</span>
          <span>By {classItem.teacherName}</span>
        </div>

        {/* Price */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="w-5">💰</span>
          <span className="font-semibold text-green-600">{classItem.price}</span>
        </div>

        {/* Schedule Preview */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Schedule:</h4>
          <div className="space-y-2">
            {classItem.times.slice(0, 2).map((time, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">{time.day}</span>
                  <br />
                  <span>{time.startTime} - {time.endTime}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  time.location === 'Online' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {time.location}
                </span>
              </div>
            ))}
            {classItem.times.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{classItem.times.length - 2} more time slots
              </p>
            )}
          </div>
        </div>

        {/* Class Specific Info */}
        <div className="border-t pt-3 mt-3">
          {classItem.type === 'individual' && (
            <div className="text-sm text-blue-600 font-medium">
              {classItem.availableSlots} slots available
            </div>
          )}
          {classItem.type === 'group' && (
            <div className="text-sm text-green-600 font-medium">
              {classItem.currentStudents}/{classItem.maxStudents} students
            </div>
          )}
          {classItem.type === 'mass' && (
            <div className="text-sm text-purple-600 font-medium">
              {classItem.currentStudents}/{classItem.maxStudents} students
            </div>
          )}
        </div>

        {/* Click hint */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">Click to view full details</p>
        </div>
      </div>
    </div>
  );
}