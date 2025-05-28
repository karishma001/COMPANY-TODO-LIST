import { useState } from 'react';
import { Task } from '../../types/taskTypes';
import TaskItem from './TaskItem';

interface EmployeeTaskListProps {
  tasks: Task[];
}

const EmployeeTaskList = ({ tasks }: EmployeeTaskListProps) => {
  const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({});
  
  // Group tasks by employee
  const tasksByEmployee = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const userId = task.user_id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(task);
    return acc;
  }, {});

  const toggleEmployee = (userId: string) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="divide-y divide-gray-200">
      {Object.entries(tasksByEmployee).map(([userId, employeeTasks]) => {
        const isExpanded = expandedEmployees[userId] ?? false;
        const pendingCount = employeeTasks.filter(t => !t.is_completed).length;
        const completedCount = employeeTasks.filter(t => t.is_completed).length;
        const employeeEmail = employeeTasks[0]?.email || userId;
        
        return (
          <div key={userId} className="bg-white">
            <div 
              onClick={() => toggleEmployee(userId)}
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{employeeEmail}</h3>
                <p className="text-sm text-gray-500">
                  {pendingCount} pending, {completedCount} completed
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">{isExpanded ? 'Hide' : 'Show'}</span>
                <svg
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <ul className="space-y-3">
                  {employeeTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task}
                      isEmployee={false}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeTaskList;