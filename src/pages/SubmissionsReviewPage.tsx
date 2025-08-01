import React from 'react';
import { Header } from '@/components/layout/Header';
import { SubmissionsReview } from '@/components/teacher/SubmissionsReview';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SubmissionsReviewPage() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SubmissionsReview />
        </main>
      </div>
    </ProtectedRoute>
  );
}