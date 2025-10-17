import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpeakingLessonContent } from "@/types/lesson-content";
import { Mic } from "lucide-react";

interface SpeakingPreviewProps {
  content: SpeakingLessonContent;
}

export function SpeakingPreview({ content }: SpeakingPreviewProps) {
  const { pronunciation, conversation, practiceExercises, topics } = content;

  return (
    <div className="space-y-6">
      {/* Pronunciation */}
      {pronunciation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pronunciation Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pronunciation.sounds && pronunciation.sounds.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Sounds</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pronunciation.sounds.map((sound, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-mono text-blue-600 mb-2">
                        {sound.phoneme}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {sound.description}
                      </p>
                      {sound.examples && sound.examples.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Examples:</strong> {sound.examples.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pronunciation.intonation && (
              <div>
                <h4 className="font-semibold mb-2">Intonation</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium mb-1">
                    {pronunciation.intonation.pattern}
                  </p>
                  <p className="text-sm text-gray-700">
                    {pronunciation.intonation.description}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversation */}
      {conversation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Conversation Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversation.scenario && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Scenario</h4>
                <p className="text-gray-700">{conversation.scenario}</p>
              </div>
            )}

            {conversation.dialogues && conversation.dialogues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Dialogue</h4>
                <div className="space-y-3">
                  {conversation.dialogues.map((turn, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="font-semibold text-blue-600 min-w-[80px]">
                        {turn.speaker}:
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{turn.text}</p>
                        {turn.translation && (
                          <p className="text-sm text-gray-500 italic mt-1">
                            {turn.translation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversation.usefulPhrases &&
              conversation.usefulPhrases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Useful Phrases</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {conversation.usefulPhrases.map((phrase, index) => (
                      <li key={index} className="text-gray-700">
                        {phrase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Practice Exercises */}
      {practiceExercises && practiceExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Practice Exercises ({practiceExercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practiceExercises.map((exercise, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Exercise {index + 1}:</span>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                      {exercise.type}
                    </span>
                    {exercise.timeLimit && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {exercise.timeLimit}s
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{exercise.prompt}</p>
                  {exercise.tips && exercise.tips.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <strong>Tips:</strong>{" "}
                      {exercise.tips.map((tip, i) => (
                        <span key={i}>
                          {tip}
                          {i < exercise.tips!.length - 1 ? "; " : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussion Topics */}
      {topics && topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discussion Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {topics.map((topic, index) => (
                <li key={index} className="text-gray-700">
                  {topic}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
