import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReadingLessonContent } from "@/types/lesson-content";
import { BookOpen } from "lucide-react";

interface ReadingPreviewProps {
  content: ReadingLessonContent;
}

export function ReadingPreview({ content }: ReadingPreviewProps) {
  const { passage, preReading, whileReading, postReading } = content;

  return (
    <div className="space-y-6">
      {/* Passage Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {passage.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
              {passage.genre}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded">
              {passage.wordCount} words
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
              {passage.readingTime} min read
            </span>
          </div>

          {(passage.author || passage.source) && (
            <div className="text-sm text-gray-600">
              {passage.author && <span>By {passage.author}</span>}
              {passage.source && (
                <span>
                  {passage.author ? " • " : ""}Source: {passage.source}
                </span>
              )}
            </div>
          )}

          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg text-gray-800 leading-relaxed whitespace-pre-line">
              {passage.text}
            </div>
          </div>

          {passage.images && passage.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {passage.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="rounded-lg w-full"
                />
              ))}
            </div>
          )}

          {passage.vocabulary && passage.vocabulary.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Key Vocabulary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {passage.vocabulary.map((word, index) => (
                  <div key={index} className="bg-white border p-3 rounded-lg">
                    <div className="font-semibold text-blue-600">
                      {word.word}
                    </div>
                    <p className="text-sm text-gray-700">{word.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-Reading */}
      {preReading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pre-Reading Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preReading.context && (
              <div>
                <h4 className="font-semibold mb-2">Context</h4>
                <p className="text-gray-700">{preReading.context}</p>
              </div>
            )}

            {preReading.predictions && preReading.predictions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Prediction Questions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {preReading.predictions.map((q, index) => (
                    <li key={index} className="text-gray-700">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {preReading.vocabulary && preReading.vocabulary.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Vocabulary Preview</h4>
                <div className="flex flex-wrap gap-2">
                  {preReading.vocabulary.map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded">
                      {word.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* While Reading */}
      {whileReading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">While-Reading Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {whileReading.annotations &&
              whileReading.annotations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Annotations</h4>
                  <div className="space-y-2">
                    {whileReading.annotations.map((annotation, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4">
                        <div className="text-sm font-medium text-blue-600 mb-1">
                          Paragraph {annotation.paragraph}
                        </div>
                        <p className="text-gray-700">{annotation.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {whileReading.questions && whileReading.questions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">
                  Comprehension Questions ({whileReading.questions.length})
                </h4>
                <div className="space-y-2">
                  {whileReading.questions.map((question, index) => (
                    <p key={index} className="text-gray-700">
                      {index + 1}. {question.question}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Post-Reading */}
      {postReading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post-Reading Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {postReading.comprehensionQuestions &&
              postReading.comprehensionQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">
                    Comprehension Questions (
                    {postReading.comprehensionQuestions.length})
                  </h4>
                  <div className="space-y-2">
                    {postReading.comprehensionQuestions.map(
                      (question, index) => (
                        <p key={index} className="text-gray-700">
                          {index + 1}. {question.question}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}

            {postReading.discussionQuestions &&
              postReading.discussionQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {postReading.discussionQuestions.map((q, index) => (
                      <li key={index} className="text-gray-700">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {postReading.summaryTask && (
              <div>
                <h4 className="font-semibold mb-2">Summary Task</h4>
                <p className="text-gray-700">{postReading.summaryTask}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
