import { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';

interface FeedbackFormProps {
  taskId: string;
  currentFeedback: string | null;
}

const FeedbackForm = ({ taskId, currentFeedback }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState(currentFeedback || '');
  const [isEditing, setIsEditing] = useState(!currentFeedback);
  const { addFeedback, isLoading } = useTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) return;
    
    try {
      await addFeedback(taskId, feedback.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  return (
    <div className="mt-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Manager Feedback
      </h4>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add your feedback for this task..."
          />
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading || !feedback.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Feedback'}
            </button>
            
            {currentFeedback && (
              <button
                type="button"
                onClick={() => {
                  setFeedback(currentFeedback);
                  setIsEditing(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div>
          {currentFeedback ? (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-sm text-gray-700">{currentFeedback}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Edit Feedback
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Add Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;