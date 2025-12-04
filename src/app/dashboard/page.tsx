"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClassType, ClassFormData } from "@/types/class";
import { getClassesByTeacher } from "@/data/dummyData";
import ClassCard from "@/components/ClassCard";
import ClassForm from "@/components/ClassForm";
import ClassSearch from "@/components/ClassSearch";
import ClassDetailsModal from "@/components/ClassDetailsModal";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-classes");
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassType | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [myClasses, setMyClasses] = useState<ClassType[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // In real app, this would be from Firebase
      const classes = getClassesByTeacher(user.uid);
      setMyClasses(classes);
    }
  }, [user]);

  const handleCreateClass = (formData: ClassFormData) => {
    // In real app, this would save to Firebase
    const newClass: ClassType = {
      id: Date.now().toString(),
      teacherId: user!.uid,
      teacherName: user!.displayName || 'Teacher',
      teacherEmail: user!.email!,
      ...formData,
      currentStudents: 0,
      createdAt: new Date()
    } as ClassType;

    setMyClasses(prev => [...prev, newClass]);
    setShowClassForm(false);
  };

  const handleEditClass = (formData: ClassFormData) => {
    if (!editingClass) return;

    // In real app, this would update in Firebase
    const updatedClass = {
      ...editingClass,
      ...formData
    };

    setMyClasses(prev => prev.map(c => c.id === editingClass.id ? updatedClass : c));
    setEditingClass(null);
  };

  const handleDeleteClass = (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setMyClasses(prev => prev.filter(c => c.id !== classId));
    }
  };

  const handleEditFromDetails = (classItem: ClassType) => {
    setSelectedClass(null); // Close details modal
    setEditingClass(classItem); // Open edit form
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">MyTutor</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.displayName || "Teacher"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.displayName?.split(' ')[0] || 'Teacher'}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your classes and teaching schedule</p>
          </div>
          <button
            onClick={() => setShowClassForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add New Class
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("my-classes")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "my-classes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                My Classes ({myClasses.length})
              </button>
              <button
                onClick={() => setActiveTab("browse")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "browse"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Browse & Search Classes
              </button>
            </nav>
          </div>

          <div className="p-0">
            {activeTab === "my-classes" && (
              <div className="p-6">
                {myClasses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                    <p className="text-gray-600 mb-6">Start by creating your first class</p>
                    <button
                      onClick={() => setShowClassForm(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Class
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myClasses.map(classItem => (
                      <div key={classItem.id} className="relative">
                        <ClassCard 
                          classItem={classItem} 
                          onEdit={setEditingClass}
                          onViewDetails={setSelectedClass}
                        />
                        <button
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="absolute top-4 right-16 p-2 text-red-600 hover:text-red-700 bg-white rounded-full shadow-sm"
                          title="Delete class"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "browse" && (
              <div>
                <ClassSearch />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Form Modal for Creating */}
      {showClassForm && (
        <ClassForm
          onSubmit={handleCreateClass}
          onCancel={() => setShowClassForm(false)}
        />
      )}

      {/* Class Form Modal for Editing */}
      {editingClass && (
        <ClassForm
          onSubmit={handleEditClass}
          onCancel={() => setEditingClass(null)}
          initialData={editingClass}
        />
      )}

      {/* Class Details Modal */}
      {selectedClass && (
        <ClassDetailsModal
          classItem={selectedClass}
          onClose={() => setSelectedClass(null)}
          onEdit={handleEditFromDetails}
        />
      )}
    </div>
  );
}