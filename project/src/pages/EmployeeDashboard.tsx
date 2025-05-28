import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import AppLayout from '../components/layout/AppLayout';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { PlusCircle, X } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const EmployeeDashboard = () => {
  const { user, profile } = useAuth();
  const { tasks, fetchTasks, isLoading } = useTask();
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Employee'}
            </p>
          </div>
          <button
            onClick={toggleTaskForm}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {showTaskForm ? (
              <>
                <X className="mr-2 h-5 w-5" />
                Cancel
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                New Task
              </>
            )}
          </button>
        </div>

        {showTaskForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>
            <TaskForm onSuccess={() => setShowTaskForm(false)} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Your Tasks</h3>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <TaskList tasks={tasks} isEmployee={true} />
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create your first task to get started"
              action={
                !showTaskForm && (
                  <button
                    onClick={toggleTaskForm}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Task
                  </button>
                )
              }
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default EmployeeDashboard;