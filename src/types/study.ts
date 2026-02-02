export interface Task {
  id: string;
  description: string;
  type: 'reading' | 'coding' | 'quiz' | 'project';
  completed: boolean;
  estimatedMinutes: number;
  resources?: string[];
}

export interface DayPlan {
  day: number;
  focus: string;
  tasks: Task[];
  practiceChallenge: string;
  successCriteria: string;
  estimatedTime: number;
}

export interface DiagnosticData {
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  quizAnswer: string;
  goal: 'exam' | 'project' | 'interview' | 'mastery';
  availableTime: number;
}

export interface GeneratedPlan {
  overview: string;
  targetLevel: 'beginner' | 'intermediate' | 'advanced';
  days: DayPlan[];
  weekProject: string;
}

export interface StudyProfile {
  id: string;
  topic: string;
  topicLabel: string;
  diagnosticData: DiagnosticData;
  generatedPlan: GeneratedPlan | null;
  progress: {
    completedTasks: string[];
    currentDay: number;
    streak: number;
    lastActive: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  label: string;
  description: string;
  icon: string;
  subtopics: string[];
  color: string;
}

export const TOPICS: Topic[] = [
  {
    id: 'csharp-oop',
    label: 'C# Object-Oriented Programming',
    description: 'Master classes, inheritance, polymorphism, and SOLID principles',
    icon: '🎯',
    subtopics: ['Classes & Objects', 'Inheritance', 'Interfaces', 'SOLID Principles'],
    color: 'from-purple-500/20 to-violet-600/20',
  },
  {
    id: 'sql-databases',
    label: 'SQL & Database Design',
    description: 'Learn queries, joins, indexing, and database optimization',
    icon: '🗄️',
    subtopics: ['SQL Queries', 'JOINs', 'Indexing', 'Normalization'],
    color: 'from-blue-500/20 to-cyan-600/20',
  },
  {
    id: 'aspnet-apis',
    label: 'ASP.NET Core Web APIs',
    description: 'Build RESTful services with authentication and best practices',
    icon: '🌐',
    subtopics: ['REST Principles', 'Controllers', 'Authentication', 'Middleware'],
    color: 'from-green-500/20 to-emerald-600/20',
  },
  {
    id: 'testing',
    label: 'Software Testing',
    description: 'Unit testing, integration testing, and TDD fundamentals',
    icon: '🧪',
    subtopics: ['Unit Tests', 'Mocking', 'TDD', 'Integration Tests'],
    color: 'from-orange-500/20 to-amber-600/20',
  },
  {
    id: 'data-structures',
    label: 'Data Structures & Algorithms',
    description: 'Arrays, trees, graphs, and algorithmic problem solving',
    icon: '🧠',
    subtopics: ['Arrays & Lists', 'Trees', 'Graphs', 'Sorting & Searching'],
    color: 'from-rose-500/20 to-pink-600/20',
  },
];
