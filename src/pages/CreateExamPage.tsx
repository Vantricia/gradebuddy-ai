import React from 'react';
import { Header } from '@/components/layout/Header';
import { CreateExamForm } from '@/components/teacher/CreateExamForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CreateExamPage() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <CreateExamForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}