import { ClassType, IndividualClass, GroupClass, MassClass } from '@/types/class';

export const subjects = [
  'Mathematics', 'Science', 'English', 'Sinhala', 'Tamil', 
  'History', 'Geography', 'ICT', 'Physics', 'Chemistry', 
  'Biology', 'Accounting', 'Business Studies'
];

export const grades = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12', 'Grade 13', 'A/L', 'O/L'
];

export const locations = [
  'Colombo', 'Kandy', 'Gampaha', 'Kalutara', 'Galle',
  'Matara', 'Kurunegala', 'Anuradhapura', 'Jaffna', 'Online'
];

// Dummy classes data
export const dummyClasses: ClassType[] = [
  {
    id: '1',
    type: 'individual',
    teacherId: 'teacher1',
    teacherName: 'John Doe',
    teacherEmail: 'john@example.com',
    subject: 'Mathematics',
    grade: 'Grade 10',
    description: 'One-on-one mathematics classes focusing on algebra and geometry.',
    times: [
      { day: 'Monday', startTime: '14:00', endTime: '15:00', location: 'Colombo' },
      { day: 'Wednesday', startTime: '16:00', endTime: '17:00', location: 'Colombo' }
    ],
    price: 'LKR 1500',
    availableSlots: 3,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'group',
    teacherId: 'teacher2',
    teacherName: 'Sarah Smith',
    teacherEmail: 'sarah@example.com',
    subject: 'Science',
    grade: 'Grade 11',
    description: 'Small group science classes with practical experiments.',
    times: [
      { day: 'Tuesday', startTime: '15:00', endTime: '16:30', location: 'Kandy' },
      { day: 'Thursday', startTime: '15:00', endTime: '16:30', location: 'Kandy' }
    ],
    price: 'LKR 1000',
    maxStudents: 8,
    currentStudents: 5,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    type: 'mass',
    teacherId: 'teacher3',
    teacherName: 'David Wilson',
    teacherEmail: 'david@example.com',
    subject: 'Physics',
    grade: 'A/L',
    description: 'Comprehensive A/L physics preparation classes.',
    times: [
      { day: 'Saturday', startTime: '09:00', endTime: '12:00', location: 'Online' },
      { day: 'Sunday', startTime: '09:00', endTime: '12:00', location: 'Online' }
    ],
    price: 'LKR 800',
    maxStudents: 50,
    currentStudents: 25,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '4',
    type: 'individual',
    teacherId: 'teacher1',
    teacherName: 'John Doe',
    teacherEmail: 'john@example.com',
    subject: 'English',
    grade: 'Grade 8',
    description: 'English language and literature classes.',
    times: [
      { day: 'Monday', startTime: '10:00', endTime: '11:00', location: 'Gampaha' },
      { day: 'Friday', startTime: '14:00', endTime: '15:00', location: 'Online' } // Mixed locations
    ],
    price: 'LKR 1200',
    availableSlots: 2,
    createdAt: new Date('2024-01-20')
  }
];

// Search classes function
export const searchClasses = (query: string, filters: {
  subject?: string;
  grade?: string;
  location?: string;
  type?: string;
}) => {
  return dummyClasses.filter(classItem => {
    const matchesSearch = query === '' || 
      classItem.subject.toLowerCase().includes(query.toLowerCase()) ||
      classItem.grade.toLowerCase().includes(query.toLowerCase()) ||
      classItem.teacherName.toLowerCase().includes(query.toLowerCase()) ||
      classItem.description.toLowerCase().includes(query.toLowerCase());

    const matchesSubject = !filters.subject || classItem.subject === filters.subject;
    const matchesGrade = !filters.grade || classItem.grade === filters.grade;
    const matchesLocation = !filters.location || classItem.location === filters.location;
    const matchesType = !filters.type || classItem.type === filters.type;

    return matchesSearch && matchesSubject && matchesGrade && matchesLocation && matchesType;
  });
};

// Get classes by teacher
export const getClassesByTeacher = (teacherId: string) => {
  return dummyClasses.filter(classItem => classItem.teacherId === teacherId);
};