import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GrammarLessonContent } from "@/types/lesson-content";

interface GrammarPreviewProps {
  content: GrammarLessonContent;
}

export function GrammarPreview({ content }: GrammarPreviewProps) {
  const { grammarRule, exercises } = content;

  return (
    <div className="space-y-6">
      {/* Grammar Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{grammarRule.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Explanation */}
          <div>
            <h4 className="font-semibold mb-2">Explanation</h4>
            <p className="text-gray-700">{grammarRule.explanation}</p>
          </div>

          {/* Structure */}
          <div>
            <h4 className="font-semibold mb-2">Structure</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <code className="text-blue-800 font-mono">
                {grammarRule.structure}
              </code>
            </div>
          </div>

          {/* Usage */}
          {grammarRule.usage && grammarRule.usage.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Usage</h4>
              <ul className="list-disc list-inside space-y-1">
                {grammarRule.usage.map((use, index) => (
                  <li key={index} className="text-gray-700">
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples */}
          {grammarRule.examples && grammarRule.examples.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Examples</h4>
              <div className="space-y-3">
                {grammarRule.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-800 mb-1">{example.sentence}</p>
                    <p className="text-sm text-gray-600 italic">
                      {example.translation}
                    </p>
                    {example.explanation && (
                      <p className="text-sm text-blue-600 mt-2">
                        💡 {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {grammarRule.commonMistakes &&
            grammarRule.commonMistakes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Common Mistakes</h4>
                <ul className="list-disc list-inside space-y-1">
                  {grammarRule.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-red-600">
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Notes */}
          {grammarRule.notes && grammarRule.notes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <ul className="list-disc list-inside space-y-1">
                {grammarRule.notes.map((note, index) => (
                  <li key={index} className="text-gray-700">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercises */}
      {exercises && exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Practice Exercises ({exercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Question {index + 1}:</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      {exercise.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {exercise.points} pts
                    </span>
                  </div>
                  <p className="text-gray-700">{exercise.question}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
