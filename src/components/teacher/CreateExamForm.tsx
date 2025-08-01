import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send,
  GripVertical 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  type: 'mcq' | 'fib' | 'short';
  text: string;
  options?: string[];
  correctAnswer: string;
  rubric: string;
  keywords: string[];
}

interface ExamData {
  title: string;
  subject: string;
  description: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
}

export const CreateExamForm: React.FC = () => {
  const [examData, setExamData] = useState<ExamData>({
    title: '',
    subject: '',
    description: '',
    timeLimit: 60,
    difficulty: 'medium',
    questions: []
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'mcq',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      rubric: '',
      keywords: []
    };
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (id: string) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!examData.title || !examData.subject || examData.questions.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one question",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: publish ? "Exam Published!" : "Exam Saved!",
      description: publish 
        ? "Your exam is now available to students" 
        : "Your exam has been saved as a draft",
    });

    navigate('/teacher');
  };

  const QuestionEditor: React.FC<{ question: Question; index: number }> = ({ question, index }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          <div className="flex items-center space-x-2">
            <Select 
              value={question.type} 
              onValueChange={(value) => updateQuestion(question.id, 'type', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="fib">Fill in Blanks</SelectItem>
                <SelectItem value="short">Short Answer</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => removeQuestion(question.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Question Text</Label>
          <Textarea
            value={question.text}
            onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
            placeholder="Enter your question here..."
            className="mt-1"
          />
        </div>

        {question.type === 'mcq' && (
          <div>
            <Label>Answer Options</Label>
            <div className="space-y-2 mt-1">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-6">{String.fromCharCode(65 + optionIndex)}.</span>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[optionIndex] = e.target.value;
                      updateQuestion(question.id, 'options', newOptions);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Correct Answer</Label>
          {question.type === 'mcq' ? (
            <Select 
              value={question.correctAnswer}
              onValueChange={(value) => updateQuestion(question.id, 'correctAnswer', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {String.fromCharCode(65 + index)}. {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
              placeholder="Enter the correct answer"
              className="mt-1"
            />
          )}
        </div>

        <div>
          <Label>Grading Rubric</Label>
          <Textarea
            value={question.rubric}
            onChange={(e) => updateQuestion(question.id, 'rubric', e.target.value)}
            placeholder="Describe how this question should be graded..."
            className="mt-1"
          />
        </div>

        {question.type !== 'mcq' && (
          <div>
            <Label>Keywords (for AI grading)</Label>
            <Input
              value={question.keywords.join(', ')}
              onChange={(e) => updateQuestion(question.id, 'keywords', 
                e.target.value.split(',').map(k => k.trim()).filter(k => k)
              )}
              placeholder="Enter keywords separated by commas"
              className="mt-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Exam</CardTitle>
          <CardDescription>
            Set up your exam details and add questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                value={examData.title}
                onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Biology Chapter 5 Quiz"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={examData.subject}
                onChange={(e) => setExamData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Biology"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={examData.description}
              onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the exam..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={examData.timeLimit}
                onChange={(e) => setExamData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
            <div>
              <Label>Difficulty Level</Label>
              <Select 
                value={examData.difficulty}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                  setExamData(prev => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Questions ({examData.questions.length})</h3>
        <Button onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {examData.questions.map((question, index) => (
        <QuestionEditor key={question.id} question={question} index={index} />
      ))}

      {examData.questions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No questions added yet. Click "Add Question" to get started.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4 pt-6">
        <Button variant="outline" onClick={() => handleSave(false)}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={() => handleSave(true)}>
          <Send className="mr-2 h-4 w-4" />
          Publish Exam
        </Button>
      </div>
    </div>
  );
};