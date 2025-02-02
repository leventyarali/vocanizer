"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type WordListItem = Database['public']['Views']['v_word_list']['Row'];

interface WordCardProps {
  word: WordListItem;
  showLink?: boolean;
}

export function WordCard({ word, showLink = true }: WordCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {showLink ? (
              <Link 
                href={`/admin/content/words/${word.word_id}`}
                className="hover:underline"
              >
                {word.word}
              </Link>
            ) : (
              word.word
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{word.cefr_level}</Badge>
            <Badge variant="secondary">{word.word_type_name}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Tanım</h4>
            <p className="text-sm text-muted-foreground">{word.definition}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={word.is_active ? "default" : "secondary"}>
              {word.is_active ? "Aktif" : "Pasif"}
            </Badge>
            <Badge variant={word.is_public ? "default" : "secondary"}>
              {word.is_public ? "Yayında" : "Taslak"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
