"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TTSVocabularyButton } from "@/components/ui/tts-button";
import { VocabularyItem } from "@/types/vocab";
import { Award, ChevronDown, Zap } from "lucide-react";

interface VocabCardProps {
  item: VocabularyItem;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

export function VocabCard({
  item,
  expandedId,
  onToggleExpand,
}: VocabCardProps) {
  const levelColors: Record<string, string> = {
    Easy: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-700",
    Medium: "from-amber-500 to-amber-600 bg-amber-50 text-amber-700",
    Hard: "from-red-500 to-red-600 bg-red-50 text-red-700",
  };
  const levelColor =
    levelColors[item.level] ||
    "from-slate-500 to-slate-600 bg-slate-50 text-slate-700";

  const isExpanded = expandedId === item._id;

  return (
    <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.word}
              </h3>
              <TTSVocabularyButton
                word={item.word}
                pronunciation={item.phonetic}
                id={`vocab-${item._id}`}
                className="shrink-0"
              />
            </div>
            {item.phonetic && (
              <p className="text-xs font-mono text-slate-500">
                {item.phonetic}
              </p>
            )}
          </div>
          <Badge
            variant="secondary"
            className="ml-2 shrink-0 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200/50">
            {item.partOfSpeech}
          </Badge>
        </div>

        {/* Definition */}
        <p className="text-sm text-slate-700 line-clamp-2 mb-3 flex-1">
          {item.definition}
        </p>

        {/* Translation */}
        {item.translation && (
          <div className="mb-4 p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1">
              Translation
            </p>
            <p className="text-sm text-slate-700">{item.translation}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Badge className={`text-xs font-semibold ${levelColor} border-0`}>
            <Award className="h-3 w-3 mr-1" />
            {item.level || "N/A"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpand(item._id)}
            className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            {isExpanded ? (
              <>
                <ChevronDown className="h-3 w-3 mr-1 rotate-180" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                More
              </>
            )}
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-sm">
            {item.example && (
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-semibold text-slate-700">Example</span>
                </div>
                <p className="text-slate-600 italic pl-6">"{item.example}"</p>
              </div>
            )}
            {Array.isArray(item.synonyms) && item.synonyms.length > 0 && (
              <div>
                <span className="font-semibold text-slate-700">Synonyms: </span>
                <span className="text-slate-600">
                  {item.synonyms.join(", ")}
                </span>
              </div>
            )}
            {Array.isArray(item.antonyms) && item.antonyms.length > 0 && (
              <div>
                <span className="font-semibold text-slate-700">Antonyms: </span>
                <span className="text-slate-600">
                  {item.antonyms.join(", ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
