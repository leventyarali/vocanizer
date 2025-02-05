"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface WordMeaning {
  id: string;
  word: string;
  type: string;
  cefr_level: string;
  meaning: string;
}

interface WordMeaningDialogProps {
  word: string;
  onSelect: (meaning: WordMeaning) => void;
}

// Örnek veri, gerçek API'den gelecek
const SAMPLE_MEANINGS: WordMeaning[] = [
  {
    id: "1",
    word: "run",
    type: "verb",
    cefr_level: "A1",
    meaning: "koşmak",
  },
  {
    id: "2",
    word: "run",
    type: "verb",
    cefr_level: "A2",
    meaning: "yönetmek",
  },
  {
    id: "3",
    word: "run",
    type: "noun",
    cefr_level: "B1",
    meaning: "koşu",
  },
];

export function WordMeaningDialog({ word, onSelect }: WordMeaningDialogProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredMeanings = SAMPLE_MEANINGS.filter(
    (meaning) =>
      meaning.word.toLowerCase().includes(search.toLowerCase()) ||
      meaning.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-4 w-4"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kelime Anlamı Seç</DialogTitle>
          <DialogDescription>
            &quot;{word}&quot; kelimesi için bir anlam seçin
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="Kelime veya anlam ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {filteredMeanings.map((meaning) => (
                <div
                  key={meaning.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onSelect(meaning);
                    setOpen(false);
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{meaning.word}</span>
                      <Badge variant="outline">{meaning.type}</Badge>
                      <Badge>{meaning.cefr_level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meaning.meaning}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
} 