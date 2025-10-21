"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useAuth";
import { fetchLessonDetail } from "@/lib/student-courses-service";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Headphones,
  Lightbulb,
  Mic,
  MicOff,
  Pause,
  PenTool,
  Play,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  content: any;
  course?: {
    _id: string;
    title: string;
  };
  teacher?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function StudentLessonPage() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchLesson();
    }
  }, [isAuthenticated, params.id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { lesson: lessonData } = await fetchLessonDetail(params.id);
      setLesson(lessonData);
    } catch (error: any) {
      console.error("Error fetching lesson:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to load lesson",
        variant: "destructive",
      });
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (exerciseId: string, answer: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseId]: answer,
    }));
  };

  const handleSubmitExercise = () => {
    setShowResults(true);
    toast({
      title: "Exercise Submitted",
      description: "Check your results below!",
    });
  };

  const handleNextExercise = () => {
    if (
      lesson?.content?.exercises &&
      currentExerciseIndex < lesson.content.exercises.length - 1
    ) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setShowResults(false);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setShowResults(false);
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording functionality
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "vocab":
        return <BookOpen className="h-5 w-5" />;
      case "grammar":
        return <Edit3 className="h-5 w-5" />;
      case "listening":
        return <Headphones className="h-5 w-5" />;
      case "speaking":
        return <Mic className="h-5 w-5" />;
      case "reading":
        return <Eye className="h-5 w-5" />;
      case "writing":
        return <PenTool className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const renderVocabularyLesson = () => {
    if (!lesson?.content?.vocabulary) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Vocabulary Words
            </CardTitle>
            <CardDescription>
              Learn these vocabulary words and their meanings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {lesson.content.vocabulary.map((word: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{word.word}</h3>
                      <p className="text-gray-600 mb-2">{word.definition}</p>
                      <p className="text-sm text-gray-500 italic">
                        "{word.example}"
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {word.partOfSpeech}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {word.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {word.audioUrl && (
                      <Button variant="outline" size="sm" onClick={toggleAudio}>
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGrammarLesson = () => {
    if (!lesson?.content?.grammarRule) return null;

    const rule = lesson.content.grammarRule;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Grammar Rule: {rule.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Explanation</h4>
              <p className="text-gray-700">{rule.explanation}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Structure</h4>
              <code className="bg-gray-100 p-2 rounded text-sm font-mono">
                {rule.structure}
              </code>
            </div>

            {rule.usage && rule.usage.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Usage</h4>
                <ul className="list-disc list-inside space-y-1">
                  {rule.usage.map((usage: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {usage}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rule.examples && rule.examples.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Examples</h4>
                <div className="space-y-3">
                  {rule.examples.map((example: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-200 pl-4">
                      <p className="font-medium">{example.sentence}</p>
                      <p className="text-gray-600 italic">
                        {example.translation}
                      </p>
                      {example.explanation && (
                        <p className="text-sm text-gray-500">
                          {example.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderListeningLesson = () => {
    if (!lesson?.content?.audio) return null;

    const audio = lesson.content.audio;

    return (
      <div className="space-y-6">
        {lesson.content.preListening && (
          <Card>
            <CardHeader>
              <CardTitle>Pre-Listening</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {lesson.content.preListening.context}
              </p>
              {lesson.content.preListening.vocabulary && (
                <div>
                  <h4 className="font-semibold mb-2">Key Vocabulary</h4>
                  <div className="flex flex-wrap gap-2">
                    {lesson.content.preListening.vocabulary.map(
                      (word: any, index: number) => (
                        <Badge key={index} variant="outline">
                          {word.word}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Audio Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={toggleAudio} size="lg">
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <div>
                  <p className="font-medium">
                    Duration: {audio.duration} seconds
                  </p>
                  <p className="text-sm text-gray-600">Speed: {audio.speed}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Transcript</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{audio.transcript}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSpeakingLesson = () => {
    return (
      <div className="space-y-6">
        {lesson?.content?.pronunciation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Pronunciation Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.content.pronunciation.sounds && (
                <div className="space-y-4">
                  {lesson.content.pronunciation.sounds.map(
                    (sound: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{sound.phoneme}</h4>
                        <p className="text-gray-600 mb-2">
                          {sound.description}
                        </p>
                        <div className="space-y-2">
                          <p className="font-medium">Examples:</p>
                          <div className="flex flex-wrap gap-2">
                            {sound.examples.map(
                              (example: string, exIndex: number) => (
                                <Badge key={exIndex} variant="outline">
                                  {example}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {lesson?.content?.practiceExercises && (
          <Card>
            <CardHeader>
              <CardTitle>Speaking Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lesson.content.practiceExercises.map(
                  (exercise: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{exercise.prompt}</h4>
                      {exercise.sampleAnswer && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Sample Answer:
                          </p>
                          <p className="italic text-gray-700">
                            {exercise.sampleAnswer}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={toggleRecording}
                          variant={isRecording ? "destructive" : "default"}>
                          {isRecording ? (
                            <MicOff className="h-4 w-4 mr-2" />
                          ) : (
                            <Mic className="h-4 w-4 mr-2" />
                          )}
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                        {exercise.timeLimit && (
                          <p className="text-sm text-gray-600">
                            Time limit: {exercise.timeLimit} seconds
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderReadingLesson = () => {
    if (!lesson?.content?.passage) return null;

    const passage = lesson.content.passage;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Reading Passage
            </CardTitle>
            <CardDescription>
              {passage.genre} • {passage.wordCount} words •{" "}
              {passage.readingTime} min read
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{passage.title}</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {passage.text}
                </p>
              </div>
              {passage.author && (
                <p className="text-sm text-gray-500 italic">
                  By {passage.author}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {lesson.content.postReading && (
          <Card>
            <CardHeader>
              <CardTitle>Comprehension Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lesson.content.postReading.comprehensionQuestions?.map(
                  (question: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium mb-3">{question.question}</p>
                      {question.type === "multiple-choice" && (
                        <RadioGroup>
                          {question.options.map(
                            (option: any, optIndex: number) => (
                              <div
                                key={optIndex}
                                className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={option.value}
                                  id={`${index}-${optIndex}`}
                                />
                                <label
                                  htmlFor={`${index}-${optIndex}`}
                                  className="text-sm">
                                  {option.value}
                                </label>
                              </div>
                            )
                          )}
                        </RadioGroup>
                      )}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderWritingLesson = () => {
    if (!lesson?.content?.instruction) return null;

    const instruction = lesson.content.instruction;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Writing Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Prompt</h4>
                <p className="text-gray-700">{instruction.prompt}</p>
              </div>

              {instruction.requirements &&
                instruction.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {instruction.requirements.map(
                        (req: string, index: number) => (
                          <li key={index} className="text-gray-700">
                            {req}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {instruction.audience && (
                <div>
                  <h4 className="font-semibold mb-2">Target Audience</h4>
                  <p className="text-gray-700">{instruction.audience}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Your Response</h4>
                <Textarea
                  placeholder="Write your response here..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {lesson.content.modelText && (
          <Card>
            <CardHeader>
              <CardTitle>Model Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">
                  {lesson.content.modelText.title}
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">
                    {lesson.content.modelText.text}
                  </p>
                </div>
                {lesson.content.modelText.analysis && (
                  <div>
                    <h5 className="font-medium mb-2">Analysis</h5>
                    <p className="text-gray-600">
                      {lesson.content.modelText.analysis}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderExercises = () => {
    if (!lesson?.content?.exercises || lesson.content.exercises.length === 0) {
      return null;
    }

    const exercise = lesson.content.exercises[currentExerciseIndex];
    const userAnswer = userAnswers[exercise._id || currentExerciseIndex];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Exercise {currentExerciseIndex + 1} of{" "}
              {lesson.content.exercises.length}
            </span>
            <Badge variant="outline">{exercise.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{exercise.question}</h4>
              {exercise.translation && (
                <p className="text-gray-600 italic">{exercise.translation}</p>
              )}
            </div>

            {exercise.type === "multiple-choice" && (
              <RadioGroup
                value={userAnswer}
                onValueChange={(value) =>
                  handleAnswerChange(
                    exercise._id || currentExerciseIndex,
                    value
                  )
                }>
                {exercise.options.map((option: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`${currentExerciseIndex}-${index}`}
                    />
                    <label
                      htmlFor={`${currentExerciseIndex}-${index}`}
                      className="text-sm">
                      {option.value}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {exercise.type === "fill-in-the-blank" && (
              <div className="space-y-2">
                <p className="text-gray-700">{exercise.sentence}</p>
                <Input
                  placeholder="Your answer..."
                  value={userAnswer || ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      exercise._id || currentExerciseIndex,
                      e.target.value
                    )
                  }
                />
              </div>
            )}

            {exercise.type === "true-false" && (
              <RadioGroup
                value={userAnswer}
                onValueChange={(value) =>
                  handleAnswerChange(
                    exercise._id || currentExerciseIndex,
                    value === "true"
                  )
                }>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="true"
                    id={`${currentExerciseIndex}-true`}
                  />
                  <label htmlFor={`${currentExerciseIndex}-true`}>True</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="false"
                    id={`${currentExerciseIndex}-false`}
                  />
                  <label htmlFor={`${currentExerciseIndex}-false`}>False</label>
                </div>
              </RadioGroup>
            )}

            {exercise.type === "translation" && (
              <div className="space-y-2">
                <p className="text-gray-700">{exercise.sentence}</p>
                <Textarea
                  placeholder="Your translation..."
                  value={userAnswer || ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      exercise._id || currentExerciseIndex,
                      e.target.value
                    )
                  }
                />
              </div>
            )}

            {showResults && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {userAnswer === exercise.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {userAnswer === exercise.correctAnswer
                      ? "Correct!"
                      : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Correct answer: {exercise.correctAnswer}
                </p>
                {exercise.explanation && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Explanation
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      {exercise.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePreviousExercise}
                disabled={currentExerciseIndex === 0}>
                Previous
              </Button>

              <div className="flex gap-2">
                {!showResults ? (
                  <Button onClick={handleSubmitExercise}>Submit Answer</Button>
                ) : (
                  <Button onClick={handleNextExercise}>Next Exercise</Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Show loading if auth is still loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading lesson...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lesson not found
            </h1>
            <p className="text-gray-600 mb-6">
              The lesson you're looking for doesn't exist or is not available.
            </p>
            <Button onClick={() => router.push("/student/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() =>
            router.push(
              lesson.course
                ? `/student/courses/${lesson.course._id}`
                : "/student/courses"
            )
          }
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {lesson.course ? lesson.course.title : "Courses"}
        </button>

        {/* Lesson Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {getLessonIcon(lesson.type)}
                    <Badge variant="outline" className="capitalize">
                      {lesson.type}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {lesson.difficulty}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {lesson.estimatedTime} min
                  </div>
                </div>

                <CardTitle className="text-3xl font-bold mb-4 text-gray-900">
                  {lesson.title}
                </CardTitle>

                <CardDescription className="text-lg text-gray-600">
                  {lesson.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Lesson Content */}
        <div className="space-y-6">
          {lesson.type === "vocab" && renderVocabularyLesson()}
          {lesson.type === "grammar" && renderGrammarLesson()}
          {lesson.type === "listening" && renderListeningLesson()}
          {lesson.type === "speaking" && renderSpeakingLesson()}
          {lesson.type === "reading" && renderReadingLesson()}
          {lesson.type === "writing" && renderWritingLesson()}

          {/* Exercises */}
          {renderExercises()}
        </div>
      </div>
    </div>
  );
}
