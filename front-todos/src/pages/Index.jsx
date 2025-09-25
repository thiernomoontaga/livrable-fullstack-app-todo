import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Users, 
  Image as ImageIcon, 
  Mic, 
  Shield, 
  Zap,
  ArrowRight,
  Star
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TodoMaster</h1>
              <p className="text-sm text-muted-foreground">Professional Task Management</p>
            </div>
          </div>

          <Button 
            onClick={() => window.location.href = '/auth'}
            className="bg-gradient-primary hover:opacity-90"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Star className="w-3 h-3 mr-1" />
            Professional Task Management
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Organize Your Tasks,
            <br />
            Boost Your Productivity
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern todo application with team collaboration, media attachments, 
            and intelligent task assignment. Built for professionals who get things done.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-primary hover:opacity-90"
            >
              Start Managing Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you and your team stay organized and productive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Task Management */}
          <Card className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>CRUD Operations</CardTitle>
              <CardDescription>
                Complete task management with create, read, update, and delete operations.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Team Collaboration */}
          <Card className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Task Assignment</CardTitle>
              <CardDescription>
                Assign tasks to team members and collaborate efficiently with role-based permissions.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Media Support */}
          <Card className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-warning" />
              </div>
              <CardTitle>Media Attachments</CardTitle>
              <CardDescription>
                Add images and audio notes to your tasks for better context and communication.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Audio Notes */}
          <Card className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Voice Notes</CardTitle>
              <CardDescription>
                Record up to 30-second audio notes for quick task updates and team communication.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Permissions */}
          <Card className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Smart Permissions</CardTitle>
              <CardDescription>
                Secure task management where users can only edit tasks they own or are assigned to.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Performance */}
          <Card className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Activity logs and instant updates keep your team synchronized and informed.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-primary text-white border-0 shadow-strong">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of professionals using TodoMaster to stay organized and productive. 
              Create your account in seconds and start managing your tasks today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = '/auth'}
              className="bg-white text-primary hover:bg-white/90"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">TodoMaster</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
