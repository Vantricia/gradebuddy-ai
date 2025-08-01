import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle,
  Flag
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'mcq' | 'fib' | 'short';
  text: string;
  options?: string[];
}

interface ExamData {
  id: string;
  title: string;
  subject: string;
  timeLimit: number; // in minutes
  questions: Question[];
}

interface Answer {
  questionId: string;
  answer: string;
  flagged: boolean;
}

// Mock exam data
const mockExam: ExamData = {
  id: '1',
  title: 'Biology Chapter 5 Quiz',
  subject: 'Biology',
  timeLimit: 30,
  questions: [
    {
      id: '1',
      type: 'mcq',
      text: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum']
    },
    {
      id: '2',
      type: 'fib',
      text: 'Photosynthesis occurs in the _______ of plant cells.'
    },
    {
      id: '3',
      type: 'short',
      text: 'Explain the process of cellular respiration in 2-3 sentences.'
    }
  ]
};

export const ExamTaking: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exam] = useState<ExamData>(mockExam);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(exam.timeLimit * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize answers
  useEffect(() => {
    setAnswers(exam.questions.map(q => ({
      questionId: q.id,
      answer: '',
      flagged: false
    })));
  }, [exam.questions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === exam.questions[currentQuestion]?.id);
  };

  const updateAnswer = (answer: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === exam.questions[currentQuestion].id 
        ? { ...a, answer }
        : a
    ));
  };

  const toggleFlag = () => {
    setAnswers(prev => prev.map(a => 
      a.questionId === exam.questions[currentQuestion].id 
        ? { ...a, flagged: !a.flagged }
        : a
    ));
  };

  const nextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Exam Submitted!",
      description: "Your answers have been saved. You will receive results soon.",
    });

    navigate('/student/dashboard');
  };

  const question = exam.questions[currentQuestion];
  const currentAnswer = getCurrentAnswer();
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;
  const answeredCount = answers.filter(a => a.answer.trim() !== '').length;

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-8">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Submitting Exam...</h2>
            <p className="text-muted-foreground">Please wait while we save your answers.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{exam.title}</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {exam.questions.length} • {exam.subject}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {timeRemaining < 300 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Time Running Out!
                </Badge>
              )}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_, index) => {
              const answer = answers.find(a => a.questionId === exam.questions[index].id);
              const isAnswered = answer?.answer.trim() !== '';
              const isFlagged = answer?.flagged;
              
              return (
                <Button
                  key={index}
                  variant={index === currentQuestion ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  className={`relative ${isFlagged ? 'border-warning' : ''}`}
                >
                  {index + 1}
                  {isAnswered && (
                    <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-accent bg-background rounded-full" />
                  )}
                  {isFlagged && (
                    <Flag className="h-3 w-3 absolute top-0 right-0 text-warning" />
                  )}
                </Button>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {answeredCount} of {exam.questions.length} questions answered
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
              <Badge variant="outline" className="mt-2">
                {question.type === 'mcq' ? 'Multiple Choice' : 
                 question.type === 'fib' ? 'Fill in the Blank' : 'Short Answer'}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFlag}
              className={currentAnswer?.flagged ? 'bg-warning text-warning-foreground' : ''}
            >
              <Flag className="h-4 w-4 mr-1" />
              {currentAnswer?.flagged ? 'Unflag' : 'Flag'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg leading-relaxed">
            {question.text}
          </div>

          {/* Answer Input based on question type */}
          {question.type === 'mcq' && question.options && (
            <RadioGroup 
              value={currentAnswer?.answer || ''} 
              onValueChange={updateAnswer}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'fib' && (
            <div>
              <Label htmlFor="answer">Your Answer</Label>
              <Input
                id="answer"
                value={currentAnswer?.answer || ''}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="mt-2"
              />
            </div>
          )}

          {question.type === 'short' && (
            <div>
              <Label htmlFor="answer">Your Answer</Label>
              <Textarea
                id="answer"
                value={currentAnswer?.answer || ''}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="mt-2 min-h-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex space-x-4">
          {currentQuestion === exam.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90">
              Submit Exam
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};