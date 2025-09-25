import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';

const TodoContext = createContext(undefined);

// Demo mode - set to true to test without a real API
const DEMO_MODE = false;
const API_BASE_URL = 'http://localhost:3000/api';

// Demo todos for testing
const DEMO_TODOS = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and finalize the Q4 project proposal including budget estimates and timeline.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'demo-user-1',
    assignedTo: null,
    createdByUser: { id: 'demo-user-1', name: 'You', email: 'demo@example.com' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review the latest pull requests and provide feedback to the development team.',
    completed: true,
    priority: 'medium',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'demo-user-1',
    assignedTo: null,
    createdByUser: { id: 'demo-user-1', name: 'You', email: 'demo@example.com' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Prepare presentation slides',
    description: 'Create slides for the upcoming client meeting next week.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'demo-user-2',
    assignedTo: 'demo-user-1',
    createdByUser: { id: 'demo-user-2', name: 'John Doe', email: 'john@example.com' },
    assignedToUser: { id: 'demo-user-1', name: 'You', email: 'demo@example.com' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();
  const { toast } = useToast();

  // Filter todos based on ownership and assignment
  const ownedTodos = todos.filter(todo => todo.createdBy === user?.id);
  const assignedTodos = todos.filter(todo => todo.assignedTo === user?.id && todo.createdBy !== user?.id);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const fetchTodos = async () => {
    if (!token) return;

    try {
      setIsLoading(true);

      // Demo mode - use demo data
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setTodos(DEMO_TODOS);
        return;
      }

      // Fetch owned todos
      const ownedResponse = await fetch(`${API_BASE_URL}/todos`, {
        headers: getAuthHeaders(),
      });

      // Fetch assigned todos
      const assignedResponse = await fetch(`${API_BASE_URL}/todos/assigned`, {
        headers: getAuthHeaders(),
      });

      if (ownedResponse.ok && assignedResponse.ok) {
        const ownedData = await ownedResponse.json();
        const assignedData = await assignedResponse.json();

        // Combine and transform data to match frontend expectations
        const ownedTodos = (ownedData.success ? ownedData.data.data : []).map(todo => ({
          ...todo,
          createdBy: todo.ownerId,
          assignedTo: todo.assignedToId,
          createdByUser: { id: todo.ownerId, name: 'You', email: 'your@email.com' }, // Would need user data
          assignedToUser: todo.assignedToId ? { id: todo.assignedToId, name: 'Assigned User', email: 'assigned@email.com' } : null,
          priority: 'medium', // Default
          dueDate: null,
        }));

        const assignedTodos = (assignedData.success ? assignedData.data.data : []).map(todo => ({
          ...todo,
          createdBy: todo.ownerId,
          assignedTo: todo.assignedToId,
          createdByUser: { id: todo.ownerId, name: 'Creator', email: 'creator@email.com' },
          assignedToUser: { id: todo.assignedToId, name: 'You', email: 'your@email.com' },
          priority: 'medium',
          dueDate: null,
        }));

        setTodos([...ownedTodos, ...assignedTodos]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch todos",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to connect to server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTodo = async (todoData, image, audio) => {
    if (!token) return false;

    try {
      setIsLoading(true);

      // Demo mode - simulate todo creation
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newTodo = {
          id: 'demo-todo-' + Date.now(),
          title: todoData.title,
          description: todoData.description,
          completed: false,
          priority: todoData.priority || 'medium',
          dueDate: todoData.dueDate,
          createdBy: user.id,
          assignedTo: todoData.assignedTo || null,
          createdByUser: { id: user.id, name: user.name, email: user.email },
          assignedToUser: todoData.assignedTo ? {
            id: todoData.assignedTo,
            name: 'Assigned User',
            email: todoData.assignedTo
          } : null,
          image: image ? URL.createObjectURL(image) : null,
          audioNote: audio ? URL.createObjectURL(audio) : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setTodos(prev => [newTodo, ...prev]);

        toast({
          title: "Task created!",
          description: `"${todoData.title}" has been created (Demo Mode)`,
        });

        return true;
      }

      // Backend expects JSON, not FormData
      const requestBody = {
        title: todoData.title,
        description: todoData.description || '',
      };

      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform backend response to match frontend expectations
          const newTodo = {
            ...data.data,
            createdBy: data.data.ownerId,
            assignedTo: data.data.assignedToId,
            createdByUser: { id: data.data.ownerId, name: user.name, email: user.email },
            assignedToUser: null, // Would need to fetch user data
            priority: 'medium',
            dueDate: null,
          };
          setTodos(prev => [newTodo, ...prev]);

          toast({
            title: "Task created!",
            description: `"${todoData.title}" has been created`,
          });

          return true;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.error || "Failed to create todo",
      });
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to create todo",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id, todoData, image, audio) => {
    if (!token) return false;

    try {
      setIsLoading(true);

      // Demo mode - simulate todo update
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));

        setTodos(prev => prev.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              ...todoData,
              updatedAt: new Date().toISOString(),
              image: image ? URL.createObjectURL(image) : todo.image,
              audioNote: audio ? URL.createObjectURL(audio) : todo.audioNote,
            };
          }
          return todo;
        }));

        toast({
          title: "Task updated!",
          description: "Changes have been saved (Demo Mode)",
        });

        return true;
      }

      // Backend expects JSON for updates
      const requestBody = {};
      if (todoData.title !== undefined) requestBody.title = todoData.title;
      if (todoData.description !== undefined) requestBody.description = todoData.description;
      if (todoData.completed !== undefined) requestBody.completed = todoData.completed;

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform and update the todo
          const updatedTodo = {
            ...data.data,
            createdBy: data.data.ownerId,
            assignedTo: data.data.assignedToId,
            createdByUser: { id: data.data.ownerId, name: user.name, email: user.email },
            assignedToUser: data.data.assignedToId ? { id: data.data.assignedToId, name: 'Assigned User', email: 'assigned@email.com' } : null,
            priority: 'medium',
            dueDate: null,
          };
          setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));

          toast({
            title: "Task updated!",
            description: "Changes have been saved",
          });

          return true;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.error || "Failed to update todo",
      });
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to update todo",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    if (!token) return false;

    try {
      // Demo mode - simulate todo deletion
      if (DEMO_MODE) {
        setTodos(prev => prev.filter(todo => todo.id !== id));

        toast({
          title: "Task deleted",
          description: "Task has been removed (Demo Mode)",
        });

        return true;
      }

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTodos(prev => prev.filter(todo => todo.id !== id));

          toast({
            title: "Task deleted",
            description: "Task has been removed",
          });

          return true;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.error || "Failed to delete todo",
      });
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to delete todo",
      });
      return false;
    }
  };

  const assignTodo = async (id, assignedTo) => {
    if (!token) return false;

    try {
      // Demo mode
      if (DEMO_MODE) {
        return updateTodo(id, { assignedTo });
      }

      const response = await fetch(`${API_BASE_URL}/todos/${id}/assign`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ assignedToId: assignedTo }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the todo in state
          setTodos(prev => prev.map(todo =>
            todo.id === id ? {
              ...todo,
              assignedTo: data.data.assignedToId,
              assignedToUser: data.data.assignedToId ? { id: data.data.assignedToId, name: 'Assigned User', email: 'assigned@email.com' } : null,
              updatedAt: new Date().toISOString()
            } : todo
          ));

          toast({
            title: "Task assigned!",
            description: "Task has been assigned successfully",
          });

          return true;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.error || "Failed to assign todo",
      });
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to assign todo",
      });
      return false;
    }
  };

  const toggleComplete = async (id) => {
    if (!token) return false;

    try {
      // Demo mode
      if (DEMO_MODE) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return false;
        return updateTodo(id, { completed: !todo.completed });
      }

      const response = await fetch(`${API_BASE_URL}/todos/${id}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the todo in state
          setTodos(prev => prev.map(todo =>
            todo.id === id ? {
              ...todo,
              completed: data.data.completed,
              updatedAt: new Date().toISOString()
            } : todo
          ));

          toast({
            title: "Task updated!",
            description: `Task marked as ${data.data.completed ? 'completed' : 'incomplete'}`,
          });

          return true;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.error || "Failed to update todo",
      });
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to update todo",
      });
      return false;
    }
  };

  const fetchActivityLogs = async (todoId) => {
    if (!token) return;

    try {
      // Demo mode - simulate activity logs
      if (DEMO_MODE) {
        const demoLogs = [
          {
            id: '1',
            todoId: todoId,
            action: 'Task Created',
            description: 'Task was created',
            userId: user.id,
            userName: user.name,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            todoId: todoId,
            action: 'Priority Updated',
            description: 'Priority changed to high',
            userId: user.id,
            userName: user.name,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ];
        setActivityLogs(demoLogs);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/todos/${todoId}/activity`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setActivityLogs(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  return (
    <TodoContext.Provider value={{
      todos,
      ownedTodos,
      assignedTodos,
      activityLogs,
      isLoading,
      createTodo,
      updateTodo,
      deleteTodo,
      assignTodo,
      toggleComplete,
      fetchTodos,
      fetchActivityLogs,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};