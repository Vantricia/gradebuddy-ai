import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  ArrowLeft,
  Trophy,
  Target,
  Clock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface QuestionResult {
  id: string;
  type: 'mcq' | 'fib' | 'short';
  text: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string;
}

interface ExamResult {
  id: string;
  title: string;
  subject: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeTaken: number; // in minutes
  questions: QuestionResult[];
  overallFeedback: string;
}

// Mock result data
const mockResult: ExamResult = {
  id: '3',
  title: 'Chemistry Basics',
  subject: 'Chemistry',
  totalScore: 85,
  maxScore: 100,
  percentage: 85,
  completedAt: '2024-01-15',
  timeTaken: 28,
  overallFeedback: 'Good understanding of basic chemistry concepts. Focus on balancing chemical equations for improvement.',
  questions: [
    {
      id: '1',
      type: 'mcq',
      text: 'What is the atomic number of carbon?',
      studentAnswer: '6',
      correctAnswer: '6',
      isCorrect: true,
      score: 10,
      maxScore: 10,
      feedback: 'Correct! Carbon has 6 protons.'
    },
    {
      id: '2',
      type: 'fib',
      text: 'The chemical formula for water is _______.',
      studentAnswer: 'H2O',
      correctAnswer: 'H2O',
      isCorrect: true,
      score: 10,
      maxScore: 10,
      feedback: 'Perfect answer!'
    },
    {
      id: '3',
      type: 'short',
      text: 'Explain the difference between an element and a compound.',
      studentAnswer: 'An element is made of one type of atom, while a compound is made of different types of atoms bonded together.',
      correctAnswer: 'Elements contain only one type of atom, compounds contain multiple types of atoms chemically bonded.',
      isCorrect: true,
      score: 15,
      maxScore: 20,
      feedback: 'Good explanation, but could be more detailed about chemical bonding.'
    }
  ]
};

export const ExamResult: React.FC = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result] = useState<ExamResult>(mockResult);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-accent';
    if (percentage >= 70) return 'text-primary';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleDownloadPDF = () => {
    // This would integrate with backend to generate PDF
    console.log('Downloading PDF for result:', resultId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Overall Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{result.title}</CardTitle>
              <CardDescription className="text-lg">
                {result.subject} • Completed on {result.completedAt}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
                {getGradeLabel(result.percentage)}
              </div>
              <p className="text-sm text-muted-foreground">Grade</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-accent mr-2" />
                <span className="text-2xl font-bold">{result.totalScore}</span>
                <span className="text-lg text-muted-foreground">/{result.maxScore}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold">{result.percentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Percentage</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-accent mr-2" />
                <span className="text-2xl font-bold">
                  {result.questions.filter(q => q.isCorrect).length}
                </span>
                <span className="text-lg text-muted-foreground">/{result.questions.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{result.timeTaken}</span>
                <span className="text-lg text-muted-foreground">min</span>
              </div>
              <p className="text-sm text-muted-foreground">Time Taken</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Performance</span>
              <span className="text-sm text-muted-foreground">{result.percentage}%</span>
            </div>
            <Progress value={result.percentage} className="h-3" />
          </div>

          {result.overallFeedback && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Teacher's Feedback</h4>
              <p className="text-muted-foreground">{result.overallFeedback}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question by Question Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>
            Review your answers and feedback for each question
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.questions.map((question, index) => (
            <div key={question.id} className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">Question {index + 1}</h4>
                  <Badge variant="outline" className="mb-3">
                    {question.type === 'mcq' ? 'Multiple Choice' : 
                     question.type === 'fib' ? 'Fill in the Blank' : 'Short Answer'}
                  </Badge>
                  <p className="text-foreground mb-4">{question.text}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {question.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-accent" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  <div className="text-right">
                    <div className="font-bold">{question.score}/{question.maxScore}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Answer:</p>
                  <p className={`p-2 rounded ${question.isCorrect ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
                    {question.studentAnswer}
                  </p>
                </div>

                {!question.isCorrect && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Correct Answer:</p>
                    <p className="p-2 bg-accent/10 text-accent rounded">
                      {question.correctAnswer}
                    </p>
                  </div>
                )}

                {question.feedback && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Feedback:</p>
                    <p className="p-2 bg-muted rounded text-muted-foreground">
                      {question.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};