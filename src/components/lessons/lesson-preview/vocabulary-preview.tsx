import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VocabularyLessonContent } from "@/types/lesson-content";

interface VocabularyPreviewProps {
  content: VocabularyLessonContent;
}

export function VocabularyPreview({ content }: VocabularyPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Thematic Group */}
      {content.thematicGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{content.thematicGroup}</p>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Vocabulary ({content.vocabulary?.length || 0} words)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.vocabulary?.map((word, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-blue-600">
                    {word.word}
                  </h4>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {word.partOfSpeech}
                  </span>
                </div>

                {word.pronunciation && (
                  <p className="text-sm text-gray-500 mb-2">
                    /{word.pronunciation}/
                  </p>
                )}

                <p className="text-gray-700 mb-2">
                  <strong>Definition:</strong> {word.definition}
                </p>

                <p className="text-gray-600 italic mb-3">
                  <strong>Example:</strong> {word.example}
                </p>

                {word.synonyms && word.synonyms.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Synonyms:</strong> {word.synonyms.join(", ")}
                  </p>
                )}

                {word.antonyms && word.antonyms.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <strong>Antonyms:</strong> {word.antonyms.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      {content.exercises && content.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Practice Exercises ({content.exercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.exercises.map((exercise, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Question {index + 1}:</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {exercise.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {exercise.points} pts
                    </span>
                  </div>
                  <p className="text-gray-700">{exercise.question}</p>
                  {exercise.translation && (
                    <p className="text-sm text-gray-500 mt-1">
                      {exercise.translation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
