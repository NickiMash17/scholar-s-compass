import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { GeneratedPlan, DayPlan, Task } from '@/types/study';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { HeroButton } from '@/components/ui/HeroButton';

const loadingMessages = [
  "Analyzing your profile...",
  "Crafting personalized curriculum...",
  "Optimizing learning path...",
  "Adding practice challenges...",
  "Finalizing your 7-day plan...",
];

// Generate a realistic mock study plan
const generateMockPlan = (topic: string, confidence: number, goal: string, time: number): GeneratedPlan => {
  const topicPlans: Record<string, { overview: string; focuses: string[]; tasks: string[][] }> = {
    'csharp-oop': {
      overview: "This 7-day intensive program takes you from OOP fundamentals to designing robust, maintainable C# applications. You'll master classes, inheritance, polymorphism, and SOLID principles through hands-on coding exercises.",
      focuses: [
        "Classes & Object Basics",
        "Properties, Methods & Constructors",
        "Inheritance & Base Classes",
        "Polymorphism & Interfaces",
        "Abstraction & Encapsulation",
        "SOLID Principles",
        "Design Patterns & Review"
      ],
      tasks: [
        ["Create a simple class with properties", "Implement constructors with parameters", "Practice object instantiation", "Build a basic inventory system"],
        ["Add methods to existing classes", "Implement property validation", "Create static vs instance members", "Build a calculator class"],
        ["Extend base classes with inheritance", "Override virtual methods", "Use base keyword effectively", "Create a vehicle hierarchy"],
        ["Define and implement interfaces", "Use polymorphism with collections", "Create pluggable components", "Build a payment system"],
        ["Apply encapsulation best practices", "Use abstract classes", "Implement access modifiers", "Refactor for clean code"],
        ["Apply Single Responsibility", "Implement Open/Closed principle", "Practice Dependency Inversion", "Refactor legacy code"],
        ["Implement Factory pattern", "Create Repository pattern", "Code review exercises", "Build complete project"]
      ]
    },
    'sql-databases': {
      overview: "Master SQL from basic queries to advanced optimization. This plan covers SELECT statements, JOINs, subqueries, indexing strategies, and database design principles for real-world applications.",
      focuses: [
        "SELECT & Filtering",
        "JOINs & Relationships",
        "Aggregations & Grouping",
        "Subqueries & CTEs",
        "Indexes & Performance",
        "Database Design",
        "Advanced Optimization"
      ],
      tasks: [
        ["Write basic SELECT queries", "Filter with WHERE clauses", "Sort with ORDER BY", "Use DISTINCT and LIMIT"],
        ["Practice INNER JOINs", "Implement LEFT/RIGHT JOINs", "Use multiple table joins", "Handle NULL values"],
        ["Use COUNT, SUM, AVG", "Group data with GROUP BY", "Filter groups with HAVING", "Combine aggregations"],
        ["Write correlated subqueries", "Create Common Table Expressions", "Use EXISTS and IN", "Optimize complex queries"],
        ["Create efficient indexes", "Analyze query execution plans", "Identify slow queries", "Apply indexing strategies"],
        ["Design normalized schemas", "Create entity relationships", "Implement constraints", "Build a complete schema"],
        ["Optimize JOIN performance", "Use query hints", "Review and refactor", "Complete assessment"]
      ]
    },
    'aspnet-apis': {
      overview: "Build production-ready REST APIs with ASP.NET Core. Learn controllers, routing, authentication, middleware, and best practices for scalable web services.",
      focuses: [
        "API Fundamentals",
        "Controllers & Routing",
        "Data & Entity Framework",
        "Authentication & JWT",
        "Middleware & Filters",
        "Error Handling & Logging",
        "Testing & Deployment"
      ],
      tasks: [
        ["Create new Web API project", "Understand project structure", "Configure services", "Test with Swagger"],
        ["Create RESTful controllers", "Implement action methods", "Configure attribute routing", "Handle query parameters"],
        ["Setup Entity Framework Core", "Create data models", "Implement repositories", "Handle database migrations"],
        ["Configure JWT authentication", "Implement login endpoint", "Protect API routes", "Handle refresh tokens"],
        ["Create custom middleware", "Implement action filters", "Add request validation", "Configure CORS"],
        ["Global exception handling", "Implement logging", "Create custom responses", "Monitor API health"],
        ["Write integration tests", "Configure CI/CD", "Deploy to cloud", "Document with OpenAPI"]
      ]
    },
    'testing': {
      overview: "Master software testing from unit tests to TDD. Learn xUnit/NUnit, mocking frameworks, integration testing, and how to write maintainable, reliable test suites.",
      focuses: [
        "Unit Testing Basics",
        "Test Organization",
        "Mocking Dependencies",
        "Test-Driven Development",
        "Integration Testing",
        "Advanced Patterns",
        "CI/CD Integration"
      ],
      tasks: [
        ["Setup testing framework", "Write first unit test", "Use assertions effectively", "Test edge cases"],
        ["Structure test classes", "Name tests descriptively", "Apply AAA pattern", "Group related tests"],
        ["Introduction to mocking", "Mock external dependencies", "Verify mock interactions", "Test with fakes"],
        ["Write tests first", "Red-Green-Refactor cycle", "Practice TDD kata", "Build feature with TDD"],
        ["Test database operations", "Test API endpoints", "Handle test data", "Clean up resources"],
        ["Parameterized tests", "Test async code", "Snapshot testing", "Performance testing"],
        ["Setup test automation", "Configure code coverage", "Integrate with pipeline", "Final project review"]
      ]
    },
    'data-structures': {
      overview: "Build strong algorithmic foundations with arrays, linked lists, trees, graphs, and essential algorithms. Develop problem-solving skills for technical interviews and real-world applications.",
      focuses: [
        "Arrays & Strings",
        "Linked Lists",
        "Stacks & Queues",
        "Trees & BST",
        "Heaps & Priority Queues",
        "Graphs & Traversal",
        "Algorithm Review"
      ],
      tasks: [
        ["Array manipulation techniques", "Two-pointer patterns", "String operations", "Solve array problems"],
        ["Implement linked list", "Insert and delete nodes", "Reverse linked list", "Detect cycles"],
        ["Implement stack from scratch", "Queue implementations", "Solve bracket matching", "Use in algorithms"],
        ["Build binary search tree", "Tree traversal methods", "Balance considerations", "Solve tree problems"],
        ["Implement min/max heap", "Priority queue usage", "Heap sort algorithm", "Solve scheduling problems"],
        ["Graph representations", "BFS and DFS", "Shortest path algorithms", "Solve graph problems"],
        ["Time complexity analysis", "Space optimization", "Mock interview practice", "Comprehensive review"]
      ]
    }
  };

  const plan = topicPlans[topic] || topicPlans['csharp-oop'];
  const targetLevel = confidence <= 2 ? 'beginner' : confidence <= 4 ? 'intermediate' : 'advanced';
  
  const days: DayPlan[] = plan.focuses.map((focus, index) => {
    const dayTasks = plan.tasks[index];
    const tasksPerDay = Math.min(Math.ceil(time / 20), dayTasks.length);
    
    return {
      day: index + 1,
      focus,
      estimatedTime: time,
      practiceChallenge: `Complete a hands-on exercise applying ${focus.toLowerCase()} concepts to a real scenario.`,
      successCriteria: `You can confidently explain and implement ${focus.toLowerCase()} without referring to documentation.`,
      tasks: dayTasks.slice(0, tasksPerDay).map((desc, taskIndex) => ({
        id: `d${index + 1}_t${taskIndex + 1}`,
        description: desc,
        type: taskIndex % 4 === 0 ? 'reading' : taskIndex % 4 === 1 ? 'coding' : taskIndex % 4 === 2 ? 'coding' : 'project',
        completed: false,
        estimatedMinutes: Math.floor(time / tasksPerDay),
        resources: taskIndex === 0 ? ['https://docs.microsoft.com'] : undefined,
      } as Task)),
    };
  });

  return {
    overview: plan.overview,
    targetLevel,
    days,
    weekProject: `Build a complete ${topic.replace('-', ' ')} application that demonstrates mastery of all concepts covered this week. This project will serve as portfolio evidence of your skills.`,
  };
};

const GeneratePlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setGeneratedPlan } = useStudy();
  const [messageIndex, setMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.diagnosticData) {
      navigate('/');
      return;
    }

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    // Generate plan after delay (simulating AI generation)
    const generateTimeout = setTimeout(() => {
      try {
        const plan = generateMockPlan(
          profile.topic,
          profile.diagnosticData.confidenceLevel,
          profile.diagnosticData.goal,
          profile.diagnosticData.availableTime
        );
        setGeneratedPlan(plan);
        setIsGenerating(false);
        
        // Navigate to plan after brief success state
        setTimeout(() => {
          navigate('/plan');
        }, 1000);
      } catch (e) {
        setError('Failed to generate your study plan. Please try again.');
        setIsGenerating(false);
      }
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(generateTimeout);
    };
  }, [profile, navigate, setGeneratedPlan]);

  const handleRetry = () => {
    setError(null);
    setIsGenerating(true);
    setMessageIndex(0);
    // Will trigger useEffect again
    window.location.reload();
  };

  if (!profile?.diagnosticData) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4">
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Oops, something went wrong
              </h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <HeroButton onClick={handleRetry} icon={<RefreshCw className="w-5 h-5" />}>
              Try Again
            </HeroButton>
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Animated icon */}
            <motion.div
              className="relative w-24 h-24 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>

            {/* Loading text */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Creating Your Study Plan
              </h2>
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-muted-foreground"
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto"
            >
              <Sparkles className="w-10 h-10 text-accent" />
            </motion.div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Your plan is ready!
              </h2>
              <p className="text-muted-foreground">Redirecting you now...</p>
            </div>
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneratePlan;
