export interface ClassTime {
  day: string;
  startTime: string;
  endTime: string;
  location: string; // Add location to each time slot
}

export interface BaseClass {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  subject: string;
  grade: string;
  description: string;
  // Remove the main location field since it's now per time slot
  times: ClassTime[];
  price: string;
  phoneNumber: string;
  image?: string;
  createdAt: Date;
}

export interface IndividualClass extends BaseClass {
  type: 'individual';
  availableSlots: number;
}

export interface GroupClass extends BaseClass {
  type: 'group';
  maxStudents: number;
  currentStudents: number;
}

export interface MassClass extends BaseClass {
  type: 'mass';
  maxStudents: number;
  currentStudents: number;
  // Remove isOnline since "Online" is now a location option
}

export type ClassType = IndividualClass | GroupClass | MassClass;

export interface ClassFormData {
  type: 'individual' | 'group' | 'mass';
  subject: string;
  grade: string;
  description: string;
  // Remove location from here since it's now in ClassTime
  times: ClassTime[];
  price: string;
  phoneNumber: string;
  image?: string;
  maxStudents?: number;
  availableSlots?: number;
  // Remove isOnline
}