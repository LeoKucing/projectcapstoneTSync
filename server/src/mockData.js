export const initialMembers = [
  {
    id: "mem-1",
    name: "Alex Pratama",
    email: "alex@tsync.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Product Lead",
    department: "Product"
  },
  {
    id: "mem-2",
    name: "Sarah Jenkins",
    email: "sarah@tsync.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Senior UI/UX Designer",
    department: "Design"
  },
  {
    id: "mem-3",
    name: "Rian Hidayat",
    email: "rian@tsync.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Fullstack Engineer",
    department: "Engineering"
  },
  {
    id: "mem-4",
    name: "Maya Putri",
    email: "maya@tsync.io",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "QA & Testing Specialist",
    department: "Quality Assurance"
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    name: "Tsync Web Application",
    description: "Next-gen task management platform with real-time sync & modern UX.",
    color: "#6366f1",
    icon: "LayoutGrid",
    status: "active",
    dueDate: "2026-11-30"
  },
  {
    id: "proj-2",
    name: "Mobile App Redesign (iOS & Android)",
    description: "Revamping mobile experience with biometric auth and offline-first storage.",
    color: "#ec4899",
    icon: "Smartphone",
    status: "active",
    dueDate: "2026-12-15"
  },
  {
    id: "proj-3",
    name: "Design System & Component Library",
    description: "Atomic design tokens, dark mode palette, and accessible Figma components.",
    color: "#8b5cf6",
    icon: "Palette",
    status: "active",
    dueDate: "2026-10-31"
  }
];

export const initialTasks = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Implement Drag and Drop Kanban Board",
    description: "Smooth drag-and-drop interaction for cards between columns with immediate position persistence.",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2026-10-28",
    assigneeId: "mem-3",
    tags: ["Frontend", "Core UX", "Sprint 1"],
    position: 0,
    subtasks: [
      { id: "sub-1-1", title: "Setup column drop zones", completed: true },
      { id: "sub-1-2", title: "Touch device gesture support", completed: false },
      { id: "sub-1-3", title: "Optimistic UI state update", completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Design Figma Component Kit & Tokens",
    description: "Standardize colors, elevation levels, and typography tokens matching Figma specs.",
    status: "done",
    priority: "high",
    dueDate: "2026-10-26",
    assigneeId: "mem-2",
    tags: ["Design", "Tokens"],
    position: 0,
    subtasks: [
      { id: "sub-2-1", title: "Export SVG icons from Figma", completed: true },
      { id: "sub-2-2", title: "Dark mode color contrast check", completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "task-3",
    projectId: "proj-1",
    title: "PostgreSQL REST API Integration",
    description: "Create Express endpoints for tasks, projects, members, and analytics with proper error handling.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-29",
    assigneeId: "mem-3",
    tags: ["Backend", "PostgreSQL", "API"],
    position: 1,
    subtasks: [
      { id: "sub-3-1", title: "Define schema.sql and indexes", completed: true },
      { id: "sub-3-2", title: "REST endpoints for /api/tasks", completed: true },
      { id: "sub-3-3", title: "Analytics aggregation query", completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "task-4",
    projectId: "proj-1",
    title: "Add Task Filtering and Live Search",
    description: "Allow team members to filter by priority, assignee, status, and tag with instant search feedback.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-11-02",
    assigneeId: "mem-1",
    tags: ["Search", "UX"],
    position: 0,
    subtasks: [
      { id: "sub-4-1", title: "Debounced search query", completed: false },
      { id: "sub-4-2", title: "Filter pill badges with clear all", completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "task-5",
    projectId: "proj-2",
    title: "Mobile Viewport Responsiveness Audit",
    description: "Ensure touch targets >= 48px, drawer menus, and sticky navigation headers work on iOS & Android.",
    status: "backlog",
    priority: "low",
    dueDate: "2026-11-10",
    assigneeId: "mem-4",
    tags: ["Mobile", "QA"],
    position: 0,
    subtasks: [
      { id: "sub-5-1", title: "Check viewport on Safari iOS", completed: false },
      { id: "sub-5-2", title: "Check bottom bar gesture nav", completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "task-6",
    projectId: "proj-3",
    title: "Calendar and Timeline Schedule View",
    description: "Visual calendar showing task deadlines with color coding based on project and priority.",
    status: "todo",
    priority: "high",
    dueDate: "2026-10-31",
    assigneeId: "mem-2",
    tags: ["Calendar", "Feature"],
    position: 1,
    subtasks: [
      { id: "sub-6-1", title: "Month view grid layout", completed: false },
      { id: "sub-6-2", title: "Click date to quick add task", completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export const initialActivities = [
  {
    id: "act-1",
    taskId: "task-1",
    taskTitle: "Implement Drag and Drop Kanban Board",
    userName: "Rian Hidayat",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    action: "moved task to In Progress",
    time: "10 minutes ago"
  },
  {
    id: "act-2",
    taskId: "task-2",
    taskTitle: "Design Figma Component Kit & Tokens",
    userName: "Sarah Jenkins",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    action: "completed task",
    time: "2 hours ago"
  },
  {
    id: "act-3",
    taskId: "task-3",
    taskTitle: "PostgreSQL REST API Integration",
    userName: "Alex Pratama",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    action: "assigned to Rian Hidayat",
    time: "Yesterday"
  }
];
