"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SelectedWords } from "./selected-words";
import { useState, useEffect } from "react";
import { SentenceFormData, DIFFICULTY_LEVELS } from "@/lib/types/sentence";
import { Database } from "@/lib/supabase/database.types";

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

const formSchema = z.object({
  text: z.string().min(1, "Cümle boş bırakılamaz"),
  language_id: z.string().min(1, "Dil seçimi zorunludur"),
  cefr_level: z.enum(['NONE', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).nullable(),
  difficulty_level: z.number().min(1).max(3),
  translation: z.string().optional(),
});

interface SentenceFormProps {
  initialData?: SentenceFormData;
  onSubmit: (data: SentenceFormData) => Promise<void>;
  languages: { id: string; name: string }[];
}

export function SentenceForm({ initialData, onSubmit, languages }: SentenceFormProps) {
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);

  const form = useForm<SentenceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: initialData?.text || "",
      language_id: initialData?.language_id || "en",
      difficulty_level: initialData?.difficulty_level || 1,
      cefr_level: initialData?.cefr_level || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        text: initialData.text,
        language_id: initialData.language_id,
        difficulty_level: initialData.difficulty_level,
        cefr_level: initialData.cefr_level,
      });
    }
  }, [form, initialData]);

  const handleTextChange = (value: string) => {
    form.setValue("text", value);
    const words = value.split(/\s+/).filter(Boolean);
    const uniqueWords = Array.from(new Set(words));
    setSelectedWords(uniqueWords.map(word => ({ word })));
  };

  const handleWordClick = (word: string) => {
    const selectedWord = selectedWords.find(w => w.word === word);
    if (selectedWord) {
      // Burada kelime anlamlarını getirme ve seçme işlemlerini yapacağız
      console.log("Selected word:", word);
    }
  };

  const handleAddMeaning = (word: string, meaning: WordMeaning) => {
    setSelectedWords((prev) =>
      prev.map((item) =>
        item.word === word ? { ...item, meaning } : item
      )
    );
  };

  const handleRemoveWord = (word: string) => {
    setSelectedWords((prev) => prev.filter((item) => item.word !== word));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField
            control={form.control}
            name="language_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dil</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Dil seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.id} value={language.id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cefr_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEFR Seviyesi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "NONE"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seviye seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">Belirtilmemiş</SelectItem>
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zorluk Seviyesi</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Zorluk seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İngilizce Cümle</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cümleyi girin"
                  {...field}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Seçilen Kelimeler</FormLabel>
          <div className="flex flex-wrap gap-2">
            {selectedWords.map((word, index) => (
              <span
                key={`${word.word}-${index}`}
                onClick={() => handleWordClick(word.word)}
                className="px-2 py-1 bg-muted rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
              >
                {word.word}
              </span>
            ))}
          </div>
          <SelectedWords
            words={selectedWords}
            onAddMeaning={handleAddMeaning}
            onRemoveWord={handleRemoveWord}
          />
        </div>

        <FormField
          control={form.control}
          name="translation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Türkçe Çeviri</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Çeviriyi girin"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 