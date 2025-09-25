import { useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useTodos } from '@/context/TodoContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import TaskCard from '@/components/TaskCard.jsx';
import CreateTaskDialog from '@/components/CreateTaskDialog.jsx';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  Users, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { ownedTodos, assignedTodos, isLoading } = useTodos();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter todos based on search
  const filterTodos = (todos) => {
    if (!searchQuery) return todos;
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredOwnedTodos = filterTodos(ownedTodos);
  const filteredAssignedTodos = filterTodos(assignedTodos);

  // Statistics
  const totalTasks = ownedTodos.length + assignedTodos.length;
  const completedTasks = [...ownedTodos, ...assignedTodos].filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = [...ownedTodos, ...assignedTodos].filter(todo => 
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TodoMaster</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Notifications */}
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalTasks}</span>
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-success">{completedTasks}</span>
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-warning">{pendingTasks}</span>
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-destructive">{overdueTasks}</span>
                <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Task Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Tasks Tabs */}
        <Tabs defaultValue="owned" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="owned" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Owned Tasks
              <Badge variant="secondary">{ownedTodos.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="assigned" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assigned to Me
              <Badge variant="secondary">{assignedTodos.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredOwnedTodos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOwnedTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {searchQuery ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : 'Create your first task to get started'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredAssignedTodos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssignedTodos.map((todo) => (
                  <TaskCard key={todo.id} todo={todo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {searchQuery ? 'No assigned tasks found' : 'No assigned tasks'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : 'Tasks assigned to you will appear here'
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Task Dialog */}
      <CreateTaskDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;