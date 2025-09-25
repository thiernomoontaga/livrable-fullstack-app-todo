import { useState } from 'react';
import { useTodos } from '@/context/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { UserPlus, Users, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

  id;
  title;
  description;
  completed;
  priority: 'low' | 'medium' | 'high';
  dueDate;
  createdBy;
  assignedTo;
  image;
  audioNote;
  createdAt;
  updatedAt;

  todo: Todo;
  isOpen;
  onClose: () => void;

const AssignTaskDialog = ({ todo, isOpen, onClose }: AssignTaskDialogProps) => {
  const { assignTodo, isLoading } = useTodos();
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [error, setError] = useState('');

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!assigneeEmail.trim()) {
      setError('Please enter a user email');
      return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(assigneeEmail)) {
      setError('Please enter a valid email address');
      return;

    const success = await assignTodo(todo.id, assigneeEmail);
    
    if (success) {
      setAssigneeEmail('');
      onClose();
  };

  const handleUnassign = async () => {
    const success = await assignTodo(todo.id, '');
    
    if (success) {
      onClose();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Assign Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Info */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <h3 className="font-medium text-sm mb-1">{todo.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {todo.description}
            </p>
          </div>

          {/* Current Assignment */}
          <div className="space-y-2">
            <Label>Current Assignment</Label>
            {todo.assignedToUser ? (
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-xs">
                      {todo.assignedToUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{todo.assignedToUser.name}</p>
                    <p className="text-xs text-muted-foreground">{todo.assignedToUser.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleUnassign}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed rounded-lg text-muted-foreground">
                <Users className="h-5 w-5 mr-2" />
                <span className="text-sm">Not assigned to anyone</span>
              </div>
            )}
          </div>

          {/* Assign Form */}
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">
                {todo.assignedToUser ? 'Reassign to' : 'Assign to'}
              </Label>
              <Input
                id="assignee"
                type="email"
                placeholder="Enter user email address"
                value={assigneeEmail}
                onChange={(e) => {
                  setAssigneeEmail(e.target.value);
                  setError('');
                }}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">
                The user must have an account in the system to receive task assignments
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !assigneeEmail.trim() || !validateEmail(assigneeEmail)}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? 'Assigning...' : 'Assign Task'}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Once assigned, the user will be able to view and edit this task. 
              They'll receive notifications about task updates.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;