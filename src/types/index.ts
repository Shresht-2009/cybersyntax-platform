export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "MENTOR" | "STUDENT";
  image?: string | null;
  emailVerified: boolean;
}

export interface MentorData {
  id: string;
  userId: string;
  bio?: string | null;
  totalFunds: number;
}

export interface StudentData {
  id: string;
  userId: string;
  program?: string | null;
  resume?: string | null;
  resumeType?: "PDF" | "IMAGE" | "TEXT" | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
  mentor?: { user: { name: string } };
}

export interface ApplicationData {
  id: string;
  program?: string | null;
  resume?: string | null;
  resumeType?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  student: {
    id: string;
    user: { name: string; email: string };
  };
}

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  dueDate?: Date | null;
  fileUrl?: string | null;
  createdAt: Date;
  submissions?: SubmissionData[];
}

export interface SubmissionData {
  id: string;
  content?: string | null;
  fileUrl?: string | null;
  status: "SUBMITTED" | "GRADED";
  grade?: number | null;
  feedback?: string | null;
  submittedAt: Date;
  student: { user: { name: string } };
}

export interface ConversationData {
  id: string;
  mentorId: string;
  studentId: string;
  messages?: MessageData[];
  mentor: { id: string; name: string; image?: string | null };
  student: { id: string; name: string; image?: string | null };
}

export interface MessageData {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt?: Date | null;
}

export interface TransactionData {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: Date;
}

export interface CourseData {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  lessons?: LessonData[];
  quizzes?: QuizData[];
}

export interface LessonData {
  id: string;
  title: string;
  type: string;
  content?: string | null;
  videoUrl?: string | null;
  order: number;
}

export interface QuizData {
  id: string;
  title: string;
  timeLimit?: number | null;
  shuffleQuestions: boolean;
  questions?: QuestionData[];
}

export interface QuestionData {
  id: string;
  text: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  options: string[];
  correctAnswer: string;
  points: number;
}
