import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useAuth } from './AuthContext';
import { Task } from '../types/taskTypes';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  fetchAllEmployeeTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_completed' | 'completed_at' | 'feedback'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  addFeedback: (id: string, feedback: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export function useTask() {
  return useContext(TaskContext);
}

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isManager } = useAuth();

  async function fetchTasks() {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) {
        toast.error('Failed to fetch tasks');
        throw error;
      }

      setTasks(data as Task[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllEmployeeTasks() {
    if (!user || !isManager) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, profiles!inner(*)')
        .order('due_date', { ascending: true });

      if (error) {
        toast.error('Failed to fetch employee tasks');
        throw error;
      }

      setTasks(data as Task[]);
    } catch (error) {
      console.error('Error fetching employee tasks:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_completed' | 'completed_at' | 'feedback'>) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          is_completed: false,
        }])
        .select();

      if (error) {
        toast.error('Failed to create task');
        throw error;
      }

      setTasks(prev => [...prev, data[0] as Task]);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        toast.error('Failed to update task');
        throw error;
      }

      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { ...task, ...updates, updated_at: new Date().toISOString() } 
            : task
        )
      );
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function completeTask(id: string) {
    setIsLoading(true);
    try {
      const completed_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('tasks')
        .update({
          is_completed: true,
          completed_at,
          updated_at: completed_at,
        })
        .eq('id', id);

      if (error) {
        toast.error('Failed to complete task');
        throw error;
      }

      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                is_completed: true, 
                completed_at, 
                updated_at: completed_at 
              } 
            : task
        )
      );
      toast.success('Task completed!');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function addFeedback(id: string, feedback: string) {
    if (!isManager) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          feedback,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        toast.error('Failed to add feedback');
        throw error;
      }

      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                feedback, 
                updated_at: new Date().toISOString() 
              } 
            : task
        )
      );
      toast.success('Feedback added successfully');
    } catch (error) {
      console.error('Error adding feedback:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    tasks,
    isLoading,
    fetchTasks,
    fetchAllEmployeeTasks,
    createTask,
    updateTask,
    completeTask,
    addFeedback,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}