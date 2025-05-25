import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use a mock user
    // In a real app, this would check the session/token
    setUser({
      id: '1',
      email: 'user@example.com',
      name: 'Test User'
    });
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    setUser({
      id: '1',
      email,
      name: 'Test User'
    });
  };

  const signOut = async () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    signIn,
    signOut
  };
}; 