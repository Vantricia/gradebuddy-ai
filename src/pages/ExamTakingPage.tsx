import React from 'react';
import { Header } from '@/components/layout/Header';
import { ExamTaking } from '@/components/student/ExamTaking';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ExamTakingPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ExamTaking />
        </main>
      </div>
    </ProtectedRoute>
  );
}