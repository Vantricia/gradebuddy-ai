import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  PlayCircle,
  Calendar,
  Trophy,
  Target
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface AvailableExam {
  id: string;
  title: string;
  subject: string;
  type: 'mcq' | 'fib' | 'short';
  questions: number;
  timeLimit: number; // in minutes
  dueDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CompletedExam {
  id: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  completedAt: string;
  feedback: string;
}

// Mock data - replace with API calls
const mockAvailableExams: AvailableExam[] = [
  {
    id: '1',
    title: 'Biology Chapter 5 Quiz',
    subject: 'Biology',
    type: 'mcq',
    questions: 15,
    timeLimit: 30,
    dueDate: '2024-01-25',
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'Math Algebra Test',
    subject: 'Mathematics',
    type: 'fib',
    questions: 10,
    timeLimit: 45,
    dueDate: '2024-01-28',
    difficulty: 'hard'
  }
];

const mockCompletedExams: CompletedExam[] = [
  {
    id: '3',
    title: 'Chemistry Basics',
    subject: 'Chemistry',
    score: 85,
    maxScore: 100,
    completedAt: '2024-01-15',
    feedback: 'Good understanding of basic concepts'
  },
  {
    id: '4',
    title: 'English Grammar',
    subject: 'English',
    score: 92,
    maxScore: 100,
    completedAt: '2024-01-12',
    feedback: 'Excellent grammar skills demonstrated'
  }
];

export const StudentDashboard: React.FC = () => {
  const [availableExams] = useState<AvailableExam[]>(mockAvailableExams);
  const [completedExams] = useState<CompletedExam[]>(mockCompletedExams);
  const navigate = useNavigate();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'fib': return 'Fill in Blanks';
      case 'short': return 'Short Answer';
      default: return type;
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'secondary';
      case 'medium': return 'default';
      case 'hard': return 'destructive';
      default: return 'default';
    }
  };

  const averageScore = completedExams.length > 0 
    ? Math.round(completedExams.reduce((sum, exam) => sum + (exam.score / exam.maxScore * 100), 0) / completedExams.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableExams.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to take
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedExams.length}</div>
            <p className="text-xs text-muted-foreground">
              Exams completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedExams.length > 0 
                ? Math.max(...completedExams.map(e => Math.round(e.score / e.maxScore * 100)))
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Personal best
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Available Exams</CardTitle>
          <CardDescription>
            Click "Start Exam" to begin taking an exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{exam.title}</h3>
                    <Badge variant={getDifficultyVariant(exam.difficulty)}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{exam.subject}</span>
                    <span>•</span>
                    <span>{getTypeLabel(exam.type)}</span>
                    <span>•</span>
                    <span>{exam.questions} questions</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {exam.timeLimit} min
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due: {exam.dueDate}
                    </div>
                  </div>
                </div>
                <Button onClick={() => navigate(`/student/exam/${exam.id}`)}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Exam
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>
            Your completed exams and scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedExams.map((exam) => {
                const percentage = Math.round((exam.score / exam.maxScore) * 100);
                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.subject}</TableCell>
                    <TableCell>{exam.score}/{exam.maxScore}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={percentage} className="w-20" />
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {exam.completedAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/student/result/${exam.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};