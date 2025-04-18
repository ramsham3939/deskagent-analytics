
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (mode: 'login' | 'signup') => {
    setIsLoading(true);
    try {
      let result;
      
      if (mode === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (result.error) {
        throw result.error;
      }

      if (mode === 'signup') {
        toast.success('Account created! Please check your email for verification.');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent, mode: 'login' | 'signup') => {
    e.preventDefault();
    handleAuth(mode);
  };

  return (
    <Card className="w-[380px] shadow-lg animate-scale-in">
      <Tabs defaultValue="login">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Call Center Admin</CardTitle>
          <CardDescription className="text-center">
            Login or create an account to access the dashboard
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          <TabsContent value="login">
            <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email-login"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password-login"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </TabsContent>
        </CardContent>

        <CardFooter className="text-xs text-center text-muted-foreground">
          <p className="w-full">Demo admin account: admin@example.com / admin123</p>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default LoginForm;
