import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(undefined);

const DEMO_MODE = false;
const API_BASE_URL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // Demo mode - simulate successful login
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoUser = {
          id: 'demo-user-1',
          email: email,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          avatar: null
        };
        
        const demoToken = 'demo-jwt-token';
        
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        toast({
          title: "Welcome to Demo Mode!",
          description: `Logged in as ${demoUser.name}`,
        });
        
        return true;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.token) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        toast({
          title: "Welcome back!",
          description: `Logged in as ${data.data.user.name}`,
        });

        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data.error || "Invalid credentials",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: DEMO_MODE ? "Demo Mode Error" : "Login error",
        description: DEMO_MODE ? "Demo login failed. Please try again." : "Unable to connect to server. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);

      // Demo mode - simulate successful registration
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          name: name,
          avatar: null
        };
        
        const demoToken = 'demo-jwt-token-' + Date.now();
        
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        toast({
          title: "Account created!",
          description: `Welcome ${demoUser.name}! (Demo Mode)`,
        });
        
        return true;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.token) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        toast({
          title: "Account created!",
          description: `Welcome ${data.data.user.name}!`,
        });

        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: data.error || "Unable to create account",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: DEMO_MODE ? "Demo Mode Error" : "Registration error",
        description: DEMO_MODE ? "Demo registration failed. Please try again." : "Unable to connect to server. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};