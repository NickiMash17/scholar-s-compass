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
  subtopics: string[];
  color: string;
}

// Topic images are imported separately in components that need them
export const TOPIC_IMAGE_MAP: Record<string, string> = {
  'programming-fundamentals': 'topic-programming-fundamentals',
  'csharp-oop': 'topic-csharp-oop',
  'data-structures': 'topic-data-structures',
  'web-fundamentals': 'topic-web-fundamentals',
  'frontend-frameworks': 'topic-frontend-frameworks',
  'sql-databases': 'topic-sql-databases',
  'aspnet-apis': 'topic-aspnet-apis',
  'testing': 'topic-testing',
  'git-version-control': 'topic-git-version-control',
  'design-patterns': 'topic-design-patterns',
  'devops-cicd': 'topic-devops-cicd',
  'system-design': 'topic-system-design',
  'cloud-computing': 'topic-cloud-computing',
  'career-prep': 'topic-career-prep',
};

export const TOPICS: Topic[] = [
  {
    id: 'programming-fundamentals',
    label: 'Programming Fundamentals',
    description: 'Start from zero — variables, loops, functions, logic, and computational thinking',
    subtopics: ['Variables & Types', 'Control Flow', 'Functions', 'Debugging Basics'],
    color: 'from-emerald-500/20 to-green-600/20',
  },
  {
    id: 'csharp-oop',
    label: 'C# & Object-Oriented Programming',
    description: 'Master classes, inheritance, polymorphism, and SOLID principles',
    subtopics: ['Classes & Objects', 'Inheritance', 'Interfaces', 'SOLID Principles'],
    color: 'from-purple-500/20 to-violet-600/20',
  },
  {
    id: 'data-structures',
    label: 'Data Structures & Algorithms',
    description: 'Arrays, trees, graphs, sorting, searching, and Big-O analysis',
    subtopics: ['Arrays & Lists', 'Trees & Graphs', 'Sorting', 'Big-O Analysis'],
    color: 'from-rose-500/20 to-pink-600/20',
  },
  {
    id: 'web-fundamentals',
    label: 'Web Development Fundamentals',
    description: 'HTML, CSS, JavaScript — build interactive websites from scratch',
    subtopics: ['HTML5 Semantics', 'CSS & Flexbox', 'JavaScript ES6+', 'DOM Manipulation'],
    color: 'from-cyan-500/20 to-teal-600/20',
  },
  {
    id: 'frontend-frameworks',
    label: 'Frontend Frameworks (React)',
    description: 'Component-based UI development with React, state management, and modern tooling',
    subtopics: ['React Components', 'Hooks & State', 'Routing', 'API Integration'],
    color: 'from-sky-500/20 to-blue-600/20',
  },
  {
    id: 'sql-databases',
    label: 'SQL & Database Design',
    description: 'Learn queries, joins, indexing, normalization, and database optimization',
    subtopics: ['SQL Queries', 'JOINs', 'Indexing', 'Normalization'],
    color: 'from-blue-500/20 to-cyan-600/20',
  },
  {
    id: 'aspnet-apis',
    label: 'Backend & REST APIs',
    description: 'Build RESTful services with authentication, middleware, and best practices',
    subtopics: ['REST Principles', 'Controllers', 'Authentication', 'Middleware'],
    color: 'from-green-500/20 to-emerald-600/20',
  },
  {
    id: 'testing',
    label: 'Software Testing & QA',
    description: 'Unit testing, integration testing, TDD, and quality assurance fundamentals',
    subtopics: ['Unit Tests', 'Mocking', 'TDD', 'Integration Tests'],
    color: 'from-orange-500/20 to-amber-600/20',
  },
  {
    id: 'git-version-control',
    label: 'Git & Version Control',
    description: 'Master Git workflows, branching strategies, collaboration, and CI integration',
    subtopics: ['Git Basics', 'Branching', 'Pull Requests', 'Merge Strategies'],
    color: 'from-red-500/20 to-orange-600/20',
  },
  {
    id: 'design-patterns',
    label: 'Design Patterns & Architecture',
    description: 'Master creational, structural, and behavioral patterns for clean code',
    subtopics: ['Singleton & Factory', 'Observer & Strategy', 'MVC & MVVM', 'Clean Architecture'],
    color: 'from-indigo-500/20 to-blue-600/20',
  },
  {
    id: 'devops-cicd',
    label: 'DevOps & CI/CD',
    description: 'Docker, containers, pipelines, deployment automation, and infrastructure',
    subtopics: ['Docker', 'CI/CD Pipelines', 'Cloud Deploy', 'Monitoring'],
    color: 'from-violet-500/20 to-purple-600/20',
  },
  {
    id: 'system-design',
    label: 'System Design & Scalability',
    description: 'Distributed systems, microservices, caching, load balancing, and architecture',
    subtopics: ['Scalability', 'Microservices', 'Caching', 'Load Balancing'],
    color: 'from-teal-500/20 to-cyan-600/20',
  },
  {
    id: 'cloud-computing',
    label: 'Cloud Computing (AWS/Azure)',
    description: 'Cloud services, serverless, storage, networking, and infrastructure as code',
    subtopics: ['Cloud Services', 'Serverless', 'Storage & CDN', 'IaC'],
    color: 'from-blue-500/20 to-indigo-600/20',
  },
  {
    id: 'career-prep',
    label: 'Career & Interview Preparation',
    description: 'Resume building, portfolio projects, technical interviews, and job search strategy',
    subtopics: ['Resume & Portfolio', 'Coding Interviews', 'System Design Q&A', 'Behavioral Prep'],
    color: 'from-amber-500/20 to-yellow-600/20',
  },
];
