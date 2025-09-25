import { useState, useEffect } from 'react';
import { useTodos } from '@/context/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Image, Mic, Edit } from 'lucide-react';

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

const EditTaskDialog = ({ todo, isOpen, onClose }: EditTaskDialogProps) => {
  const { updateTodo, isLoading } = useTodos();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    assignedTo: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key;

  // Initialize form data when todo changes
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '', // Format date for input
        assignedTo: todo.assignedToUser?.email || ''
      });
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;

    // Prepare todo data - only include changed fields
    const todoData: any = {};
    if (formData.title !== todo.title) todoData.title = formData.title.trim();
    if (formData.description !== todo.description) todoData.description = formData.description.trim();
    if (formData.priority !== todo.priority) todoData.priority = formData.priority;
    if (formData.dueDate !== (todo.dueDate ? todo.dueDate.split('T')[0] : '')) {
      todoData.dueDate = formData.dueDate || null;
    if (formData.assignedTo !== (todo.assignedToUser?.email || '')) {
      todoData.assignedTo = formData.assignedTo || null;

    const success = await updateTodo(todo.id, todoData, image || undefined, audio || undefined);
    
    if (success) {
      setImage(null);
      setAudio(null);
      onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select a valid image file' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: 'Image must be less than 5MB' });
        return;
      }
      setImage(file);
      setErrors({ ...errors, image: '' });
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('audio/')) {
        setErrors({ ...errors, audio: 'Please select a valid audio file' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors({ ...errors, audio: 'Audio file must be less than 10MB' });
        return;
      }
      setAudio(file);
      setErrors({ ...errors, audio: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your task in detail"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Due Date (Optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To (Optional)</Label>
            <Input
              id="assignedTo"
              placeholder="Enter user email or ID"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Enter the email address of the user you want to assign this task to
            </p>
          </div>

          {/* Current Attachments */}
          {(todo.image || todo.audioNote) && (
            <div className="space-y-2">
              <Label>Current Attachments</Label>
              <div className="grid grid-cols-1 gap-2">
                {todo.image && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Image className="h-4 w-4 mr-2" />
                    Image attached
                  </div>
                )}
                {todo.audioNote && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mic className="h-4 w-4 mr-2" />
                    Audio note attached
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              {todo.image ? 'Replace Image' : 'Add Image (Optional)'}
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {image && (
              <p className="text-sm text-success">New image selected: {image.name}</p>
            )}
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          </div>

          {/* New Audio Upload */}
          <div className="space-y-2">
            <Label htmlFor="audio" className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              {todo.audioNote ? 'Replace Audio Note' : 'Add Audio Note (Optional)'}
            </Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="cursor-pointer"
            />
            {audio && (
              <p className="text-sm text-success">New audio selected: {audio.name}</p>
            )}
            {errors.audio && <p className="text-sm text-destructive">{errors.audio}</p>}
            <p className="text-xs text-muted-foreground">
              Max 30 seconds audio note supported
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isLoading ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;