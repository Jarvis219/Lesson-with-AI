import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WritingLessonContent } from "@/types/lesson-content";
import { PenTool } from "lucide-react";

interface WritingPreviewProps {
  content: WritingLessonContent;
}

export function WritingPreview({ content }: WritingPreviewProps) {
  const {
    writingType,
    instruction,
    modelText,
    writingFramework,
    exercises,
    rubric,
    checklist,
  } = content;

  return (
    <div className="space-y-6">
      {/* Writing Type & Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PenTool className="h-6 w-6" />
            {writingType
              ? writingType.charAt(0).toUpperCase() + writingType.slice(1)
              : "Writing"}{" "}
            Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {instruction.prompt && (
            <div>
              <h4 className="font-semibold mb-2">Writing Prompt</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800">{instruction.prompt}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instruction.audience && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Audience</h4>
                <p className="text-gray-700">{instruction.audience}</p>
              </div>
            )}
            {instruction.purpose && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Purpose</h4>
                <p className="text-gray-700">{instruction.purpose}</p>
              </div>
            )}
            {instruction.tone && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Tone</h4>
                <p className="text-gray-700">{instruction.tone}</p>
              </div>
            )}
          </div>

          {instruction.requirements && instruction.requirements.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <ul className="list-disc list-inside space-y-1">
                {instruction.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Text */}
      {modelText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Text Example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{modelText.title}</h4>
              <div className="bg-gray-50 p-4 rounded-lg prose max-w-none">
                <p className="text-gray-800 whitespace-pre-line">
                  {modelText.text}
                </p>
              </div>
            </div>

            {modelText.analysis && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Analysis</h4>
                <p className="text-gray-700">{modelText.analysis}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Writing Framework */}
      {writingFramework && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Writing Framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {writingFramework.structure &&
              writingFramework.structure.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Structure</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {writingFramework.structure.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            {writingFramework.usefulPhrases &&
              writingFramework.usefulPhrases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Useful Phrases</h4>
                  <div className="space-y-3">
                    {writingFramework.usefulPhrases.map((group, index) => (
                      <div key={index}>
                        <div className="font-medium text-sm text-blue-600 mb-1">
                          {group.category}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.phrases.map((phrase, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {writingFramework.grammarPoints &&
              writingFramework.grammarPoints.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Grammar Points</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {writingFramework.grammarPoints.map((point, index) => (
                      <li key={index} className="text-gray-700">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {writingFramework.vocabularyBank &&
              writingFramework.vocabularyBank.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Vocabulary Bank</h4>
                  <div className="flex flex-wrap gap-2">
                    {writingFramework.vocabularyBank.map((word, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Pre-writing Exercises */}
      {exercises && exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Pre-Writing Exercises ({exercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Exercise {index + 1}:</span>
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

      {/* Rubric */}
      {rubric && rubric.criteria && rubric.criteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Grading Rubric (Total: {rubric.totalPoints} points)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rubric.criteria.map((criterion, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{criterion.name}</h4>
                    <span className="text-sm font-medium text-blue-600">
                      {criterion.maxPoints} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      {checklist && checklist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">☐</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
