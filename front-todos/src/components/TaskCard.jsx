import { useState } from 'react';
import { useTodos } from '@/context/TodoContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Image as ImageIcon, 
  Mic, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TaskDetailsDialog from './TaskDetailsDialog.jsx';
import EditTaskDialog from './EditTaskDialog.jsx';
import AssignTaskDialog from './AssignTaskDialog.jsx';

const TaskCard = ({ todo }) => {
  const { user } = useAuth();
  const { toggleComplete, deleteTodo } = useTodos();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Check permissions
  const canEdit = todo.createdBy === user?.id || todo.assignedTo === user?.id;
  const isOwner = todo.createdBy === user?.id;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && !todo.completed;
    
    return {
      formatted: date.toLocaleDateString(),
      isOverdue
    };
  };

  const handleToggleComplete = () => {
    if (canEdit) {
      toggleComplete(todo.id);
  };

  const handleDelete = () => {
    if (isOwner && window.confirm('Are you sure you want to delete this task?')) {
      deleteTodo(todo.id);
  };

  const dueDate = formatDueDate(todo.dueDate);

  return (
    <>
      <Card className="task-card group hover:shadow-medium transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {canEdit && (
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={handleToggleComplete}
                  className="mt-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 
                  className={`font-medium cursor-pointer hover:text-primary transition-colors ${
                    todo.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                  onClick={() => setIsDetailsOpen(true)}
                >
                  {todo.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {todo.description}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {isOwner && (
                    <DropdownMenuItem onClick={() => setIsAssignOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign
                    </DropdownMenuItem>
                  )}
                  {isOwner && (
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Priority and Status */}
          <div className="flex items-center justify-between">
            <Badge className={getPriorityColor(todo.priority)}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </Badge>
            {todo.completed && (
              <div className="flex items-center text-success text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </div>
            )}
          </div>

          {/* Due Date */}
          {dueDate && (
            <div className={`flex items-center text-sm ${
              dueDate.isOverdue ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>Due: {dueDate.formatted}</span>
              {dueDate.isOverdue && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Overdue
                </Badge>
              )}
            </div>
          )}

          {/* Assignment Info */}
          {todo.assignedToUser && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs">
                  {todo.assignedToUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>Assigned to {todo.assignedToUser.name}</span>
            </div>
          )}

          {/* Media Indicators */}
          <div className="flex items-center space-x-2">
            {todo.image && (
              <div className="flex items-center text-xs text-muted-foreground">
                <ImageIcon className="h-3 w-3 mr-1" />
                Image
              </div>
            )}
            {todo.audioNote && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Mic className="h-3 w-3 mr-1" />
                Audio
              </div>
            )}
          </div>

          {/* Created/Updated info */}
          <div className="text-xs text-muted-foreground border-t pt-2">
            {isOwner ? 'Created by you' : `Created by ${todo.createdByUser?.name || 'Unknown'}`}
            {' • '}
            <time className="inline-flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(todo.updatedAt).toLocaleDateString()}
            </time>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TaskDetailsDialog 
        todo={todo}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
      <EditTaskDialog 
        todo={todo}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
      <AssignTaskDialog 
        todo={todo}
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
      />
    </>
  );
};

export default TaskCard;