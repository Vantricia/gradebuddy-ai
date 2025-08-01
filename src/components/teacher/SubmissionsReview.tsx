import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  ArrowLeft, 
  Download, 
  Edit,
  Save,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'graded' | 'pending' | 'reviewed';
  timeTaken: number; // in minutes
}

interface ExamData {
  id: string;
  title: string;
  subject: string;
  totalSubmissions: number;
  averageScore: number;
}

// Mock data
const mockExam: ExamData = {
  id: '1',
  title: 'Biology Chapter 5 Quiz',
  subject: 'Biology',
  totalSubmissions: 24,
  averageScore: 78.5
};

const mockSubmissions: StudentSubmission[] = [
  {
    id: '1',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    studentEmail: 'alice@school.edu',
    submittedAt: '2024-01-20 14:30',
    score: 85,
    maxScore: 100,
    percentage: 85,
    status: 'graded',
    timeTaken: 25
  },
  {
    id: '2',
    studentId: 'student2',
    studentName: 'Bob Smith',
    studentEmail: 'bob@school.edu',
    submittedAt: '2024-01-20 15:45',
    score: 92,
    maxScore: 100,
    percentage: 92,
    status: 'graded',
    timeTaken: 28
  },
  {
    id: '3',
    studentId: 'student3',
    studentName: 'Carol Davis',
    studentEmail: 'carol@school.edu',
    submittedAt: '2024-01-20 16:20',
    score: 0,
    maxScore: 100,
    percentage: 0,
    status: 'pending',
    timeTaken: 30
  }
];

export const SubmissionsReview: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exam] = useState<ExamData>(mockExam);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState('');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'graded': return 'default';
      case 'pending': return 'secondary';
      case 'reviewed': return 'outline';
      default: return 'default';
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-accent';
    if (percentage >= 60) return 'text-primary';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const handleScoreEdit = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setEditScore(submission.score.toString());
    setIsEditing(true);
  };

  const handleSaveScore = () => {
    if (!selectedSubmission) return;

    const newScore = parseInt(editScore);
    if (isNaN(newScore) || newScore < 0 || newScore > selectedSubmission.maxScore) {
      toast({
        title: "Invalid Score",
        description: `Score must be between 0 and ${selectedSubmission.maxScore}`,
        variant: "destructive",
      });
      return;
    }

    setSubmissions(prev => prev.map(sub => 
      sub.id === selectedSubmission.id 
        ? { 
            ...sub, 
            score: newScore, 
            percentage: Math.round((newScore / sub.maxScore) * 100),
            status: 'reviewed' as const
          }
        : sub
    ));

    toast({
      title: "Score Updated",
      description: `Score for ${selectedSubmission.studentName} has been updated to ${newScore}`,
    });

    setIsEditing(false);
    setSelectedSubmission(null);
  };

  const handleExportResults = () => {
    // This would integrate with backend to export results
    toast({
      title: "Exporting Results",
      description: "Results are being exported to CSV format",
    });
  };

  const gradedSubmissions = submissions.filter(s => s.status === 'graded' || s.status === 'reviewed');
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/teacher')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button onClick={handleExportResults}>
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Exam Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{exam.title}</CardTitle>
          <CardDescription className="text-lg">
            {exam.subject} • Submission Review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold">{exam.totalSubmissions}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-accent mr-2" />
                <span className="text-2xl font-bold">{gradedSubmissions.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-6 w-6 text-warning mr-2" />
                <span className="text-2xl font-bold">{pendingSubmissions.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{exam.averageScore}%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>
            Review and manage student exam submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">{submission.studentEmail}</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                  <TableCell>
                    {isEditing && selectedSubmission?.id === submission.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editScore}
                          onChange={(e) => setEditScore(e.target.value)}
                          className="w-20"
                          type="number"
                          min="0"
                          max={submission.maxScore}
                        />
                        <span>/ {submission.maxScore}</span>
                        <Button size="sm" onClick={handleSaveScore}>
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{submission.score} / {submission.maxScore}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleScoreEdit(submission)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getPerformanceColor(submission.percentage)}`}>
                      {submission.percentage}%
                    </span>
                  </TableCell>
                  <TableCell>{submission.timeTaken} min</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(submission.status)}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/teacher/submission/${submission.id}/review`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};