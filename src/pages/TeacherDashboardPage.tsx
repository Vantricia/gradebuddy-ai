import React from 'react';
import { Header } from '@/components/layout/Header';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <TeacherDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}