'use client';

import { notFound } from 'next/navigation';
import { getWord } from '@/lib/api/words';
import { WordDetail } from '@/components/content/words/word-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Word } from '@/lib/types/word';
import { use } from 'react';

interface WordDetailPageProps {
  params: Promise<{
    wordId: string;
  }>;
}

function WordDetailLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function WordDetailError({ error }: { error: Error }) {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Hata Oluştu</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{error.message}</p>
      </CardContent>
    </Card>
  );
}

export default function WordDetailPage({ params }: WordDetailPageProps) {
  const { wordId } = use(params);
  const [word, setWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await getWord(wordId);
        if (response.error) {
          setError(response.error);
          return;
        }
        if (!response.data) {
          notFound();
          return;
        }
        setWord(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWord();
  }, [wordId]);

  if (isLoading) {
    return <WordDetailLoading />;
  }

  if (error) {
    return <WordDetailError error={error} />;
  }

  if (!word) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <WordDetail word={word} canEdit={true} />
        </CardContent>
      </Card>
    </div>
  );
}
