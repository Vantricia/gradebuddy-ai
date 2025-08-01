import React from 'react';
import { Header } from '@/components/layout/Header';
import { ExamResult } from '@/components/student/ExamResult';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ExamResultPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ExamResult />
        </main>
      </div>
    </ProtectedRoute>
  );
}