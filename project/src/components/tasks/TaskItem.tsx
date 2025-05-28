import { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { CheckCircle, Calendar, MessageSquare, Clock } from 'lucide-react';
import { Task } from '../../types/taskTypes';
import { useTask } from '../../contexts/TaskContext';
import FeedbackForm from './FeedbackForm';

interface TaskItemProps {
  task: Task;
  isEmployee?: boolean;
}

const TaskItem = ({ task, isEmployee = true }: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { completeTask } = useTask();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.is_completed) {
      await completeTask(task.id);
    }
  };

  const isDueDatePassed = task.due_date ? isPast(parseISO(task.due_date)) && !task.is_completed : false;

  return (
    <li className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        onClick={toggleExpand}
        className="px-4 py-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex-1">
          <div className="flex items-start">
            {isEmployee && (
              <button
                onClick={handleComplete}
                disabled={task.is_completed}
                className={`mr-3 mt-0.5 flex-shrink-0 h-5 w-5 rounded-full ${
                  task.is_completed 
                    ? 'bg-green-100 text-green-600 cursor-default' 
                    : 'border-2 border-gray-300 hover:border-blue-500 transition-colors'
                }`}
              >
                {task.is_completed && <CheckCircle className="h-5 w-5" />}
              </button>
            )}
            <div>
              <h3 className={`text-sm font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {task.due_date && (
            <span className={`flex items-center ${isDueDatePassed ? 'text-red-600' : ''}`}>
              <Calendar className="h-4 w-4 mr-1" />
              {format(parseISO(task.due_date), 'MMM d, yyyy')}
            </span>
          )}
          
          {task.is_completed && task.completed_at && (
            <span className="flex items-center text-green-600">
              <Clock className="h-4 w-4 mr-1" />
              {format(parseISO(task.completed_at), 'MMM d, h:mm a')}
            </span>
          )}
          
          {task.feedback && (
            <span className="flex items-center text-blue-600">
              <MessageSquare className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {/* Task details */}
          {task.description && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{task.description}</p>
            </div>
          )}
          
          {/* Completion details */}
          {task.is_completed && task.completed_at && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Completed</h4>
              <p className="text-sm text-gray-700">
                {format(parseISO(task.completed_at), 'MMMM d, yyyy h:mm a')}
              </p>
            </div>
          )}
          
          {/* Feedback section */}
          {isEmployee ? (
            task.feedback && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Feedback from Manager</h4>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p className="text-sm text-gray-700">{task.feedback}</p>
                </div>
              </div>
            )
          ) : (
            <FeedbackForm taskId={task.id} currentFeedback={task.feedback} />
          )}
        </div>
      )}
    </li>
  );
};

export default TaskItem;