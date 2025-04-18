
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Login successful!');
      } else {
        await signUp(email, password);
        toast.success('Sign up successful! Please check your email for verification.');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AuthForm = ({ isLogin }: { isLogin: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isLogin)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          {isLogin && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {isLogin ? 'Signing in...' : 'Signing up...'}
          </div>
        ) : (
          isLogin ? "Sign in" : "Sign up"
        )}
      </Button>
    </form>
  );

  return (
    <Card className="w-[380px] shadow-lg animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Call Center Admin</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthForm isLogin={true} />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm isLogin={false} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
