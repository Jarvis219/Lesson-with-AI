import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListeningLessonContent } from "@/types/lesson-content";
import { Volume2 } from "lucide-react";

interface ListeningPreviewProps {
  content: ListeningLessonContent;
}

export function ListeningPreview({ content }: ListeningPreviewProps) {
  const { audio, preListening, whileListening, postListening } = content;

  return (
    <div className="space-y-6">
      {/* Audio Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
              {audio.duration} seconds
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">
              {audio.speed} speed
            </span>
            {audio.accent && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                {audio.accent} accent
              </span>
            )}
          </div>

          {audio.url && (
            <div>
              <audio controls className="w-full">
                <source src={audio.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {audio.transcript && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Transcript</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {audio.transcript}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-Listening */}
      {preListening && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pre-Listening Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preListening.context && (
              <div>
                <h4 className="font-semibold mb-2">Context</h4>
                <p className="text-gray-700">{preListening.context}</p>
              </div>
            )}

            {preListening.predictionQuestions &&
              preListening.predictionQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Prediction Questions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {preListening.predictionQuestions.map((q, index) => (
                      <li key={index} className="text-gray-700">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* While Listening */}
      {whileListening?.exercises && whileListening.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              While-Listening Exercises ({whileListening.exercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {whileListening.exercises.map((exercise, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Task {index + 1}:</span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {exercise.type}
                    </span>
                  </div>
                  <p className="text-gray-700">{exercise.question}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post-Listening */}
      {postListening && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post-Listening Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {postListening.comprehensionQuestions &&
              postListening.comprehensionQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">
                    Comprehension Questions (
                    {postListening.comprehensionQuestions.length})
                  </h4>
                  <div className="space-y-2">
                    {postListening.comprehensionQuestions.map(
                      (question, index) => (
                        <p key={index} className="text-gray-700">
                          {index + 1}. {question.question}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}

            {postListening.discussionQuestions &&
              postListening.discussionQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {postListening.discussionQuestions.map((q, index) => (
                      <li key={index} className="text-gray-700">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
