"use client";

import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { getWord, updateWord } from '@/lib/api/words';
import { WordForm } from '@/components/content/words/word-form';
import { Word, CEFRLevel } from '@/lib/types/word';
import { useEffect, useState, use } from 'react';
import { BaseWordFormData } from '@/components/content/words/forms/base-word-form';
import { WordTypeFormData } from '@/components/content/words/forms/word-type-form';
import { WordMeaningFormData } from '@/components/content/words/forms/word-meaning-form';

interface EditWordPageProps {
  params: Promise<{
    wordId: string;
  }>;
}

export default function EditWordPage({ params }: EditWordPageProps) {
  const router = useRouter();
  const { wordId } = use(params);
  const [word, setWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await getWord(wordId);
        if (response.error || !response.data) {
          notFound();
        }
        setWord(response.data);
      } catch (error) {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchWord();
  }, [wordId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!word) {
    return null;
  }

  const defaultValues = {
    base: {
      word: word.word,
      is_active: word.is_active ?? false,
      is_public: word.is_public ?? false,
    },
    type: {
      word_type_id: word.word_type_id ? parseInt(word.word_type_id, 10) : undefined,
      cefr_level: word.cefr_level as CEFRLevel | undefined,
    },
    meaning: word.meanings[0] ? {
      definition_tr: word.meanings[0].definition_tr,
      definition_en: word.meanings[0].definition_en,
      detailed_definition_tr: word.meanings[0].detailed_definition_tr ?? '',
      detailed_definition_en: word.meanings[0].detailed_definition_en ?? '',
      grammar_tr: word.meanings[0].grammar_tr ?? '',
      grammar_en: word.meanings[0].grammar_en ?? '',
      hint_tr: word.meanings[0].hint_tr ?? '',
      hint_en: word.meanings[0].hint_en ?? '',
    } : undefined
  };

  const handleSubmit = async (
    base: BaseWordFormData,
    type: WordTypeFormData,
    meaning: WordMeaningFormData
  ) => {
    try {
      const response = await updateWord({
        id: wordId,
        word: base.word,
        word_type_id: type.word_type_id.toString(),
        cefr_level: type.cefr_level,
        is_active: base.is_active,
        is_public: base.is_public,
        meanings: [{
          word_type_name: word.meanings[0]?.word_type_name ?? null,
          cefr_level: type.cefr_level,
          definition_tr: meaning.definition_tr,
          definition_en: meaning.definition_en,
          detailed_definition_tr: meaning.detailed_definition_tr || null,
          detailed_definition_en: meaning.detailed_definition_en || null,
          grammar_tr: meaning.grammar_tr || null,
          grammar_en: meaning.grammar_en || null,
          hint_tr: meaning.hint_tr || null,
          hint_en: meaning.hint_en || null,
          synonyms: word.meanings[0]?.synonyms ?? null,
          antonyms: word.meanings[0]?.antonyms ?? null,
          word_lists: word.meanings[0]?.word_lists ?? null,
          word_family: word.meanings[0]?.word_family ?? null,
          word_forms: word.meanings[0]?.word_forms ?? null,
          created_at: word.meanings[0]?.created_at ?? null,
          updated_at: new Date().toISOString(),
        }]
      });

      if (response.error) {
        throw response.error;
      }

      toast.success('Kelime başarıyla güncellendi');
      router.push('/admin/content/words');
      router.refresh();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Kelime güncellenirken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Kelime Düzenle</h1>
      <WordForm defaultValues={defaultValues} onSubmit={handleSubmit} />
    </div>
  );
}
