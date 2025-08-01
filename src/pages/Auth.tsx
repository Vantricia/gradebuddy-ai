import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { BookOpen, GraduationCap, Users, CheckCircle } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-xl p-3">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">GradeBuddy AI</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Intelligent auto-grading platform for modern education
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-accent rounded-lg p-2">
                <CheckCircle className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI-Powered Grading</h3>
                <p className="text-muted-foreground">Automatically grade MCQs, fill-in-the-blanks, and short answers with intelligent feedback</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-accent rounded-lg p-2">
                <BookOpen className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Easy Exam Creation</h3>
                <p className="text-muted-foreground">Create and publish exams with multiple question types and custom rubrics</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-accent rounded-lg p-2">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Student Analytics</h3>
                <p className="text-muted-foreground">Track student progress with detailed analytics and performance insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div>
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
}