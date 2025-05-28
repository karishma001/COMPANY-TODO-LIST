import { Task } from '../../types/taskTypes';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isEmployee?: boolean;
}

const TaskList = ({ tasks, isEmployee = true }: TaskListProps) => {
  // Group tasks by completion status
  const pendingTasks = tasks.filter(task => !task.is_completed);
  const completedTasks = tasks.filter(task => task.is_completed);

  return (
    <div className="divide-y divide-gray-200">
      {/* Pending Tasks */}
      <div className="px-6 py-4 bg-white">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Pending Tasks ({pendingTasks.length})
        </h4>
        {pendingTasks.length > 0 ? (
          <ul className="space-y-3">
            {pendingTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task}
                isEmployee={isEmployee}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No pending tasks</p>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="px-6 py-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Completed Tasks ({completedTasks.length})
        </h4>
        {completedTasks.length > 0 ? (
          <ul className="space-y-3">
            {completedTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task}
                isEmployee={isEmployee}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No completed tasks</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;