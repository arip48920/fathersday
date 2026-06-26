'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  colorRgb: string;
  role: 'parent' | 'child';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // member IDs
  dueDate: string; // YYYY-MM-DD
  category: 'Chores' | 'School' | 'Social' | 'Shopping' | 'Work' | 'Other';
  status: 'Todo' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Comment {
  id: string;
  memberId: string;
  text: string;
  date: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  uploadedBy: string; // member ID
  likes: number;
  likedBy: string[]; // member IDs
  comments: Comment[];
  category: 'Vacation' | 'Holidays' | 'Everyday' | 'Pets' | 'Other';
}

interface FamilyContextType {
  members: FamilyMember[];
  activeMember: FamilyMember;
  setActiveMemberId: (id: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id' | 'likes' | 'likedBy' | 'comments'>) => void;
  addCommentToPhoto: (photoId: string, commentText: string) => void;
  likePhoto: (photoId: string) => void;
  loading: boolean;
}

const defaultMembers: FamilyMember[] = [
  { id: 'mom', name: 'Sarah', avatar: '👩‍🍳', color: '#fb7185', colorRgb: '251, 113, 133', role: 'parent' },
  { id: 'dad', name: 'Mark', avatar: '👨‍💻', color: '#3b82f6', colorRgb: '59, 130, 246', role: 'parent' },
  { id: 'alex', name: 'Alex', avatar: '🛹', color: '#10b981', colorRgb: '16, 185, 129', role: 'child' },
  { id: 'emily', name: 'Emily', avatar: '🎨', color: '#f59e0b', colorRgb: '245, 158, 11', role: 'child' },
  { id: 'chloe', name: 'Chloe', avatar: '🦄', color: '#8b5cf6', colorRgb: '139, 92, 246', role: 'child' },
];

const getInitialTasks = (): Task[] => {
  const today = new Date();
  const formatOffsetDate = (offset: number) => {
    const d = new Date();
    d.setDate(today.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'task-1',
      title: 'Plan Father\'s Day Dinner',
      description: 'Make reservations at Dad\'s favorite Italian restaurant and order a special dessert.',
      assignedTo: ['mom', 'alex', 'emily'],
      dueDate: formatOffsetDate(0), // Today
      category: 'Social',
      status: 'Todo',
      priority: 'High',
    },
    {
      id: 'task-2',
      title: 'Water the backyard garden',
      description: 'Give the tomato plants and flowers a thorough watering in the evening.',
      assignedTo: ['chloe'],
      dueDate: formatOffsetDate(0), // Today
      category: 'Chores',
      status: 'Todo',
      priority: 'Low',
    },
    {
      id: 'task-3',
      title: 'Finish science fair project proposal',
      description: 'Write up the hypothesis and list of materials for approval by teacher.',
      assignedTo: ['emily'],
      dueDate: formatOffsetDate(2),
      category: 'School',
      status: 'InProgress',
      priority: 'Medium',
    },
    {
      id: 'task-4',
      title: 'Grocery shopping',
      description: 'Pick up milk, eggs, chicken breast, salad greens, and coffee beans.',
      assignedTo: ['dad'],
      dueDate: formatOffsetDate(1),
      category: 'Shopping',
      status: 'Todo',
      priority: 'Medium',
    },
    {
      id: 'task-5',
      title: 'Walk the dog (Buster)',
      description: 'Take Buster for his evening 30-minute walk around the park.',
      assignedTo: ['alex'],
      dueDate: formatOffsetDate(0), // Today
      category: 'Chores',
      status: 'Completed',
      priority: 'Medium',
    },
    {
      id: 'task-6',
      title: 'Fix garage shelf',
      description: 'Reinforce the brackets on the left garage wall storage rack.',
      assignedTo: ['dad'],
      dueDate: formatOffsetDate(-2), // Past
      category: 'Work',
      status: 'Completed',
      priority: 'Low',
    },
  ];
};

const getInitialPhotos = (): Photo[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'photo-1',
      title: 'Family Summer Hike',
      description: 'Conquered the peak! Amazing weather and panoramic mountain views.',
      date: '2026-06-15',
      url: '/images/family_hiking.png',
      uploadedBy: 'dad',
      likes: 4,
      likedBy: ['mom', 'alex', 'emily', 'chloe'],
      category: 'Vacation',
      comments: [
        { id: 'c1', memberId: 'mom', text: 'My legs were so sore the next day but it was 100% worth it!', date: '2026-06-15' },
        { id: 'c2', memberId: 'alex', text: 'Next time let\'s try the harder trail.', date: '2026-06-16' },
      ],
    },
    {
      id: 'photo-2',
      title: 'Baking Championship at Home',
      description: 'Alex and Chloe teamed up to make custom pizza. Flour got everywhere!',
      date: '2026-06-10',
      url: '/images/family_cooking.png',
      uploadedBy: 'mom',
      likes: 3,
      likedBy: ['dad', 'alex', 'emily'],
      category: 'Everyday',
      comments: [
        { id: 'c3', memberId: 'chloe', text: 'Mine tasted better because of the extra cheese!', date: '2026-06-10' },
        { id: 'c4', memberId: 'dad', text: 'I am still cleaning flour out of the cabinets. Super fun though!', date: '2026-06-11' },
      ],
    },
    {
      id: 'photo-3',
      title: 'Sunset Beach Run',
      description: 'Chasing waves until the sun went down. Beautiful orange skies.',
      date: '2026-06-01',
      url: '/images/family_beach.png',
      uploadedBy: 'alex',
      likes: 5,
      likedBy: ['mom', 'dad', 'alex', 'emily', 'chloe'],
      category: 'Vacation',
      comments: [
        { id: 'c5', memberId: 'emily', text: 'This photo belongs in a frame!', date: '2026-06-02' },
      ],
    },
    {
      id: 'photo-4',
      title: 'Cozy Holiday Gathering',
      description: 'Gathered around the Christmas fireplace opening gifts together.',
      date: '2025-12-25',
      url: '/images/family_holiday.png',
      uploadedBy: 'mom',
      likes: 5,
      likedBy: ['mom', 'dad', 'alex', 'emily', 'chloe'],
      category: 'Holidays',
      comments: [
        { id: 'c6', memberId: 'chloe', text: 'I still love that unicorn plushie!', date: '2025-12-25' },
      ],
    },
  ];
};

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMemberId, setActiveMemberId] = useState<string>('dad'); // Default to Dad
  const [tasks, setTasks] = useState<Task[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const storedActiveMember = localStorage.getItem('family_activeMemberId');
    const storedTasks = localStorage.getItem('family_tasks');
    const storedPhotos = localStorage.getItem('family_photos');

    if (storedActiveMember) {
      setActiveMemberId(storedActiveMember);
    }
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      const initial = getInitialTasks();
      setTasks(initial);
      localStorage.setItem('family_tasks', JSON.stringify(initial));
    }

    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    } else {
      const initial = getInitialPhotos();
      setPhotos(initial);
      localStorage.setItem('family_photos', JSON.stringify(initial));
    }
    
    setLoading(false);
  }, []);

  // Save changes to local storage helper
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('family_tasks', JSON.stringify(newTasks));
  };

  const savePhotos = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('family_photos', JSON.stringify(newPhotos));
  };

  const handleSetActiveMemberId = (id: string) => {
    setActiveMemberId(id);
    localStorage.setItem('family_activeMemberId', id);
    
    // Dynamically update CSS variables on document element for easy styling integration
    const member = defaultMembers.find(m => m.id === id);
    if (member) {
      document.documentElement.style.setProperty('--member-color', member.color);
      document.documentElement.style.setProperty('--member-color-rgb', member.colorRgb);
    }
  };

  // Set the default accent variables on body load
  useEffect(() => {
    if (!loading) {
      const member = defaultMembers.find(m => m.id === activeMemberId);
      if (member) {
        document.documentElement.style.setProperty('--member-color', member.color);
        document.documentElement.style.setProperty('--member-color-rgb', member.colorRgb);
      }
    }
  }, [loading, activeMemberId]);

  const activeMember = defaultMembers.find(m => m.id === activeMemberId) || defaultMembers[1];

  // Tasks actions
  const addTask = (taskInput: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`,
    };
    saveTasks([newTask, ...tasks]);
  };

  const updateTask = (updatedTask: Task) => {
    saveTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  // Photos actions
  const addPhoto = (photoInput: Omit<Photo, 'id' | 'likes' | 'likedBy' | 'comments'>) => {
    const newPhoto: Photo = {
      ...photoInput,
      id: `photo-${Date.now()}`,
      likes: 0,
      likedBy: [],
      comments: [],
    };
    savePhotos([newPhoto, ...photos]);
  };

  const addCommentToPhoto = (photoId: string, commentText: string) => {
    if (!commentText.trim()) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      memberId: activeMemberId,
      text: commentText,
      date: todayStr,
    };

    savePhotos(
      photos.map(p => {
        if (p.id === photoId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const likePhoto = (photoId: string) => {
    savePhotos(
      photos.map(p => {
        if (p.id === photoId) {
          const isLiked = p.likedBy.includes(activeMemberId);
          const likedBy = isLiked
            ? p.likedBy.filter(id => id !== activeMemberId)
            : [...p.likedBy, activeMemberId];
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedBy,
          };
        }
        return p;
      })
    );
  };

  return (
    <FamilyContext.Provider
      value={{
        members: defaultMembers,
        activeMember,
        setActiveMemberId: handleSetActiveMemberId,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        photos,
        addPhoto,
        addCommentToPhoto,
        likePhoto,
        loading,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
