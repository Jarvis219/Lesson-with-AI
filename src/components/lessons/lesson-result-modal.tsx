"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lesson } from "@/types";
import {
  Award,
  Brain,
  Clock,
  RotateCcw,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

interface LessonResultModalProps {
  lesson: Lesson;
  score: number;
  timeSpent: number;
  onClose: () => void;
  onContinue: () => void;
}

export default function LessonResultModal({
  lesson,
  score,
  timeSpent,
  onClose,
  onContinue,
}: LessonResultModalProps) {
  const [showAIFeedback, setShowAIFeedback] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90)
      return "Xuất sắc! Bạn đã hoàn thành bài học một cách tuyệt vời!";
    if (score >= 80) return "Tốt lắm! Bạn đã hiểu rõ nội dung bài học.";
    if (score >= 70) return "Khá tốt! Hãy ôn tập thêm để cải thiện.";
    if (score >= 60) return "Đạt yêu cầu. Hãy luyện tập thêm để nâng cao.";
    return "Cần cải thiện. Hãy ôn tập lại và thử lại.";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🎉";
    if (score >= 80) return "👏";
    if (score >= 70) return "👍";
    if (score >= 60) return "✅";
    return "💪";
  };

  // Mock AI feedback based on score and lesson type
  const getAIFeedback = () => {
    const feedbacks = {
      vocab: [
        "Bạn có thể cải thiện bằng cách học thêm từ vựng mới mỗi ngày.",
        "Hãy thử sử dụng flashcards để ghi nhớ từ vựng tốt hơn.",
        "Luyện tập phát âm các từ khó để cải thiện kỹ năng nói.",
      ],
      grammar: [
        "Hãy ôn tập các quy tắc ngữ pháp cơ bản trước khi học nâng cao.",
        "Luyện tập viết câu để áp dụng ngữ pháp vào thực tế.",
        "Đọc nhiều để quen với cấu trúc câu tự nhiên.",
      ],
      listening: [
        "Nghe podcast hoặc video tiếng Anh mỗi ngày để cải thiện.",
        "Bắt đầu với tốc độ chậm và tăng dần độ khó.",
        "Luyện tập nghe và chép chính tả để cải thiện kỹ năng.",
      ],
      speaking: [
        "Luyện tập phát âm với các video hướng dẫn trên YouTube.",
        "Nói chuyện với người bản xứ hoặc sử dụng app luyện nói.",
        "Ghi âm giọng nói của mình để tự đánh giá và cải thiện.",
      ],
      reading: [
        "Đọc các bài báo tiếng Anh mỗi ngày để mở rộng vốn từ.",
        "Bắt đầu với các chủ đề bạn quan tâm để tăng động lực.",
        "Sử dụng từ điển để tra nghĩa từ mới và học cách sử dụng.",
      ],
      writing: [
        "Viết nhật ký bằng tiếng Anh mỗi ngày để luyện tập.",
        "Tham gia các diễn đàn viết tiếng Anh để nhận feedback.",
        "Đọc nhiều để học cách diễn đạt và cấu trúc câu.",
      ],
    };

    return feedbacks[lesson.skill as keyof typeof feedbacks] || feedbacks.vocab;
  };

  const getNextLessonSuggestion = () => {
    const suggestions = {
      vocab: "Hãy thử bài học từ vựng nâng cao hoặc học về idioms thông dụng.",
      grammar:
        "Ôn lại thì quá khứ đơn và thử bài học về thì hiện tại hoàn thành.",
      listening:
        "Luyện nghe với các bài hội thoại dài hơn hoặc tin tức tiếng Anh.",
      speaking:
        "Thử các bài học về phát âm hoặc luyện nói về các chủ đề quen thuộc.",
      reading:
        "Đọc các bài báo về chủ đề bạn quan tâm hoặc truyện ngắn tiếng Anh.",
      writing: "Luyện viết đoạn văn hoặc email bằng tiếng Anh.",
    };

    return (
      suggestions[lesson.skill as keyof typeof suggestions] || suggestions.vocab
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Kết quả bài học</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-6xl mb-4">{getScoreEmoji(score)}</div>
            <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
              {score}%
            </div>
            <p className="text-lg text-gray-600 mb-4">
              {getScoreMessage(score)}
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timeSpent} phút</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{lesson.questions.length} câu hỏi</span>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                {lesson.skill.toUpperCase()}
              </Badge>
            </div>
          </Card>

          {/* AI Feedback */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Phản hồi từ AI</h3>
            </div>

            {!showAIFeedback ? (
              <Button
                variant="outline"
                onClick={() => setShowAIFeedback(true)}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                <Brain className="h-4 w-4 mr-2" />
                Xem phản hồi AI
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Điểm mạnh:</strong> Bạn đã hiểu được{" "}
                    {Math.floor(score / 10)}/10 khái niệm trong bài học này.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Cần cải thiện:</strong>{" "}
                    {
                      getAIFeedback()[
                        Math.floor(Math.random() * getAIFeedback().length)
                      ]
                    }
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Gợi ý bài học tiếp theo:
                  </h4>
                  <p className="text-sm text-gray-700">
                    {getNextLessonSuggestion()}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Achievement */}
          {score >= 80 && (
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Thành tích mới!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bạn đã hoàn thành bài học với điểm số cao!
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Học lại
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tiếp tục học
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
