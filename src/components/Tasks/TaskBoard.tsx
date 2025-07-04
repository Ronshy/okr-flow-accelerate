
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Calendar, User, Flag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  linkedOKR: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialData: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Develop user authentication system',
        description: 'Implement secure login and registration functionality',
        assignee: 'John Doe',
        dueDate: '2024-01-15',
        priority: 'high',
        tags: ['Backend', 'Security'],
        linkedOKR: 'Improve platform security by 40%'
      },
      {
        id: '2',
        title: 'Design mobile app mockups',
        description: 'Create wireframes and high-fidelity designs',
        assignee: 'Jane Smith',
        dueDate: '2024-01-20',
        priority: 'medium',
        tags: ['Design', 'Mobile'],
        linkedOKR: 'Launch mobile app Q1'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'Implement dashboard analytics',
        description: 'Add charts and metrics to main dashboard',
        assignee: 'Mike Johnson',
        dueDate: '2024-01-18',
        priority: 'high',
        tags: ['Frontend', 'Analytics'],
        linkedOKR: 'Increase user engagement by 25%'
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      {
        id: '4',
        title: 'Code review for API endpoints',
        description: 'Review and test new REST API endpoints',
        assignee: 'Sarah Wilson',
        dueDate: '2024-01-12',
        priority: 'medium',
        tags: ['Backend', 'Review'],
        linkedOKR: 'Improve API response time by 30%'
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '5',
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        assignee: 'Alex Brown',
        dueDate: '2024-01-10',
        priority: 'low',
        tags: ['DevOps', 'Automation'],
        linkedOKR: 'Reduce deployment time by 50%'
      }
    ]
  }
];

const TaskBoard = () => {
  const [columns, setColumns] = useState(initialData);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTask = sourceColumn.tasks.find(task => task.id === draggableId);
    if (!sourceTask) return;

    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== draggableId)
        };
      }
      if (column.id === destination.droppableId) {
        const newTasks = [...column.tasks];
        newTasks.splice(destination.index, 0, sourceTask);
        return {
          ...column,
          tasks: newTasks
        };
      }
      return column;
    });

    setColumns(newColumns);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[400px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    } rounded-lg p-2 transition-colors`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                {task.title}
                              </h4>
                              <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)} rounded p-0.5`} />
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{task.assignee}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{task.dueDate}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              {task.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="text-xs text-gray-500 italic">
                              Linked to: {task.linkedOKR}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
