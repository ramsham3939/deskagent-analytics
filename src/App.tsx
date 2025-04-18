
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Executives from "./pages/Executives";
import ExecutiveDetails from "./pages/ExecutiveDetails";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { useEffect } from "react";
import { initializeDatabase } from "./utils/initSupabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Dashboard routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="executives" element={<Executives />} />
                    <Route path="executives/:id" element={<ExecutiveDetails />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
