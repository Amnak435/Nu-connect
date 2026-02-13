/**
 * NUConnect Centralized Type Definitions
 * Authored by Amna Khurram
 */

export interface User {
    id: string;
    email: string;
    name: string;
    registrationNo: string;
    department: string;
    batch: string;
    section: string;
    semester: string;
    role: 'student' | 'admin';
}

export interface AcademicDocument {
    id: string;
    created_at: string;
    title: string;
    description?: string;
    category: 'datesheet' | 'syllabus' | 'handbook' | 'lecture' | 'timetable';
    sub_category?: string;
    semester: string;
    batch: string;
    section: string;
    subject?: string;
    instructor?: string;
    file_url: string;
    file_type: string;
}

export interface AttendanceRecord {
    course: string;
    attended: number;
    total: number;
    percentage: number;
}

export interface ClassSlot {
    time: string;
    subject: string;
    type: 'Lecture' | 'Lab';
    teacher?: string;
    venue?: string;
}

export interface Announcement {
    id: string;
    title: string;
    message: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    posted_by: string;
    created_at: string;
}
