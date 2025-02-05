"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { WordMeaningDialog } from "./word-meaning-dialog";

interface WordMeaning {
  id: string;
  word: string;
  type: string;
  cefr_level: string;
  meaning: string;
}

interface SelectedWord {
  word: string;
  meaning?: WordMeaning;
}

interface SelectedWordsProps {
  words: SelectedWord[];
  onAddMeaning: (word: string, meaning: WordMeaning) => void;
  onRemoveWord: (word: string) => void;
}

export function SelectedWords({
  words,
  onAddMeaning,
  onRemoveWord,
}: SelectedWordsProps) {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-2">
        {words.map((item) => (
          <div
            key={item.word}
            className="flex items-center justify-between rounded-lg border p-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.word}</span>
              {item.meaning ? (
                <>
                  <Badge variant="outline">{item.meaning.type}</Badge>
                  <Badge>{item.meaning.cefr_level}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {item.meaning.meaning}
                  </span>
                </>
              ) : (
                <WordMeaningDialog
                  word={item.word}
                  onSelect={(meaning) => onAddMeaning(item.word, meaning)}
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveWord(item.word)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {words.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Henüz kelime seçilmedi
          </div>
        )}
      </div>
    </ScrollArea>
  );
} 