
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-3xl shadow-lg border-primary/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">CallCenter Analytics Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Final Year Project - CS4023 Advanced Software Engineering
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Project Overview</h3>
              <p className="text-muted-foreground">
                This dashboard application provides real-time analytics for call center operations, 
                helping managers monitor executive performance and customer interactions with advanced visualization tools.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Technologies Used</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>React with TypeScript</li>
                <li>Tailwind CSS for styling</li>
                <li>Recharts for data visualization</li>
                <li>React Router for navigation</li>
                <li>React Query for data management</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-medium">Aiden Smith</p>
                <p className="text-xs text-muted-foreground">Frontend Development</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Priya Patel</p>
                <p className="text-xs text-muted-foreground">Data Visualization</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Jordan Lee</p>
                <p className="text-xs text-muted-foreground">Backend Integration</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
        </CardFooter>
        
        <div className="px-8 pb-6 text-center text-sm text-muted-foreground">
          © 2025 | State University Computer Science Department
        </div>
      </Card>
    </div>
  );
};

export default Index;
