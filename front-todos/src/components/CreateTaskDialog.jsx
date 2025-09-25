import { useState } from 'react';
import { useTodos } from '@/context/TodoContext.jsx';
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
import { Calendar, Image, Mic, Plus } from 'lucide-react';

const CreateTaskDialog = ({ isOpen, onClose }) => {
  const { createTodo, isLoading } = useTodos();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare todo data
    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      assignedTo: formData.assignedTo || null,
    };

    const success = await createTodo(todoData, image || undefined, audio || undefined);
    
    if (success) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
      });
      setImage(null);
      setAudio(null);
      onClose();
    }
  };

  const handleImageChange = (e) => {
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

  const handleAudioChange = (e) => {
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
            <Plus className="h-5 w-5 mr-2" />
            Create New Task
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
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Image (Optional)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {image && (
              <p className="text-sm text-success">Selected: {image.name}</p>
            )}
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          </div>

          {/* Audio Upload */}
          <div className="space-y-2">
            <Label htmlFor="audio" className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Audio Note (Optional)
            </Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="cursor-pointer"
            />
            {audio && (
              <p className="text-sm text-success">Selected: {audio.name}</p>
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
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;