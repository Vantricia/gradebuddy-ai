import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import CreateExamPage from "./pages/CreateExamPage";
import ExamTakingPage from "./pages/ExamTakingPage";
import ExamResultPage from "./pages/ExamResultPage";
import SubmissionsReviewPage from "./pages/SubmissionsReviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherDashboardPage />} />
            <Route path="/teacher/create-exam" element={<CreateExamPage />} />
            <Route path="/teacher/exam/:examId/edit" element={<CreateExamPage />} />
            <Route path="/teacher/exam/:examId/submissions" element={<SubmissionsReviewPage />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/exam/:examId" element={<ExamTakingPage />} />
            <Route path="/student/result/:resultId" element={<ExamResultPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
