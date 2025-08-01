import React from 'react';
import { Header } from '@/components/layout/Header';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <StudentDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}