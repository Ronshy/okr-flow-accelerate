
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DepartmentProvider } from "./components/OKR/DepartmentContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import OKRManagement from "./pages/OKRManagement";
import MyOKR from "./pages/MyOKR";
import TeamOKR from "./pages/TeamOKR";
import CompanyOKR from "./pages/CompanyOKR";
import Tasks from "./pages/Tasks";
import Performance from "./pages/Performance";
import Engagement from "./pages/Engagement";
import CalendarPage from "./pages/Calendar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { OKRProvider } from "./contexts/OKRContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DepartmentProvider>
          <OKRProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={import.meta.env.BASE_URL || "/okr/"}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/okr/reset-password" element={<ResetPassword />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/okr" element={<OKRManagement />} />
                        <Route path="/okr/my" element={<MyOKR />} />
                        <Route path="/okr/team" element={<TeamOKR />} />
                        <Route path="/okr/company" element={<CompanyOKR />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/performance/*" element={<Performance />} />
                        <Route path="/engagement" element={<Engagement />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </OKRProvider>
        </DepartmentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
