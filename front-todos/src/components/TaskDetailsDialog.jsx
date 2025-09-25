import { useEffect } from 'react';
import { useTodos } from '@/context/TodoContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  User, 
  Clock, 
  Image as ImageIcon, 
  Mic,
  CheckCircle,
  Activity
} from 'lucide-react';

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

const TaskDetailsDialog = ({ todo, isOpen, onClose }: TaskDetailsDialogProps) => {
  const { activityLogs, fetchActivityLogs } = useTodos();

  useEffect(() => {
    if (isOpen && todo.id) {
      fetchActivityLogs(todo.id);
  }, [isOpen, todo.id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{todo.title}</span>
            {todo.completed && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{todo.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Priority</span>
                <div className="mt-1">
                  <Badge className={getPriorityColor(todo.priority)}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </Badge>
                </div>
              </div>

              {todo.dueDate && (
                <div>
                  <span className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due Date
                  </span>
                  <p className="text-muted-foreground mt-1">
                    {formatDate(todo.dueDate)}
                  </p>
                </div>
              )}
            </div>

            {/* Assignment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Created By
                </span>
                <div className="flex items-center mt-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-xs">
                      {todo.createdByUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{todo.createdByUser?.name || 'Unknown User'}</span>
                </div>
              </div>

              {todo.assignedToUser && (
                <div>
                  <span className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Assigned To
                  </span>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">
                        {todo.assignedToUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{todo.assignedToUser.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Created: {formatDate(todo.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Updated: {formatDate(todo.updatedAt)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Media Attachments */}
          {(todo.image || todo.audioNote) && (
            <div className="space-y-4">
              <h3 className="font-medium">Attachments</h3>
              
              {todo.image && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image Attachment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={todo.image} 
                      alt="Task attachment" 
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </CardContent>
                </Card>
              )}

              {todo.audioNote && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Mic className="h-4 w-4 mr-2" />
                      Audio Note
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <audio controls className="w-full">
                      <source src={todo.audioNote} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Activity Log */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </h3>
            
            {activityLogs.length > 0 ? (
              <div className="space-y-2">
                {activityLogs.map((log) => (
                  <Card key={log.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          by {log.userName} • {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;