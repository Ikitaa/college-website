export type UserRole = "admin" | "teacher" | "student";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";

  // Teacher
  department?:
    | string
    | {
        _id: string;
        name: string;
      };

  designation?: string;
  qualification?: string;
  phone?: string;
  bio?: string;

  // Student
  faculty?: string;
  semester?: number;
  rollNumber?: string;

  avatarUrl?: string;
  isActive?: boolean;
}


export interface SiteSettings {
  _id?: string; // optional because default settings won't have a database id

  collegeName: string;
  shortName: string;
  tagline: string;

  logoUrl?: string;
  bannerImageUrl?: string;

  aboutText?: string;
  establishedYear?: number;

  address: string;
  phone: string;
  email: string;

  mapEmbedUrl?: string;

  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export type NoticeCategory = "general" | "exam" | "admission" | "event" | "urgent";

export interface Notice {
  _id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  attachmentUrl?: string;
  isPinned: boolean;
  publishedBy: { _id: string; name: string; role: UserRole } | string;
  publishDate: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Course {
  _id: string;

  title: string;
  code: string;
  faculty: string;

  description: string;

  durationYears: number;
  totalSemesters: number;
  totalCredits: number;

  eligibility: string;

  admissionFee: number;
  semesterFee: number;
  yearlyFee: number;
  totalFee: number;
  examFee: string;

  scholarship: string;
  careerOpportunities: string;

  curriculumUrl: string;

  medium: string;
  intake: string;

  seats: number;

  coordinator: string;

  isActive: boolean;
}

export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  eventDate?: string;
  category: string;
  createdAt: string;
}

export type AdmissionStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface Admission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  courseAppliedFor: string;
  previousSchool: string;
  previousGpa?: string;
  documentsUrl?: string;
  status: AdmissionStatus;
  remarks?: string;
  createdAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}