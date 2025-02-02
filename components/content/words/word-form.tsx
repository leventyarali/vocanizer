// components/content/words/word-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseWordForm, BaseWordFormData } from './forms/base-word-form';
import { WordTypeForm, WordTypeFormData } from './forms/word-type-form';
import { WordMeaningForm, WordMeaningFormData } from './forms/word-meaning-form';
import { createWord } from '@/lib/api/words';
import { toast } from 'sonner';

interface WordFormProps {
  defaultValues?: {
    base?: Partial<BaseWordFormData>;
    type?: Partial<WordTypeFormData>;
    meaning?: Partial<WordMeaningFormData>;
  };
  onSubmit?: (base: BaseWordFormData, type: WordTypeFormData, meaning: WordMeaningFormData) => Promise<void>;
}

export function WordForm({ defaultValues, onSubmit }: WordFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('base');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    base?: BaseWordFormData;
    type?: WordTypeFormData;
    meaning?: WordMeaningFormData;
  }>({});

  const handleBaseSubmit = async (data: BaseWordFormData) => {
    setFormData((prev) => ({ ...prev, base: data }));
    setActiveTab('type');
  };

  const handleTypeSubmit = async (data: WordTypeFormData) => {
    setFormData((prev) => ({ ...prev, type: data }));
    setActiveTab('meaning');
  };

  const handleMeaningSubmit = async (data: WordMeaningFormData) => {
    setFormData((prev) => ({ ...prev, meaning: data }));
    setIsLoading(true);

    try {
      if (!formData.base || !formData.type) {
        throw new Error('Eksik form verisi');
      }

      if (onSubmit) {
        await onSubmit(formData.base, formData.type, data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Form gönderilirken hata oluştu:', error);
      toast.error('Form gönderilirken bir hata oluştu');
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="base">Temel Bilgiler</TabsTrigger>
        <TabsTrigger value="type" disabled={!formData.base}>
          Kelime Türü
        </TabsTrigger>
        <TabsTrigger value="meaning" disabled={!formData.type}>
          Tanımlar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="base">
        <BaseWordForm
          defaultValues={defaultValues?.base}
          onSubmit={handleBaseSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
      <TabsContent value="type">
        <WordTypeForm
          defaultValues={defaultValues?.type}
          onSubmit={handleTypeSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
      <TabsContent value="meaning">
        <WordMeaningForm
          defaultValues={defaultValues?.meaning}
          onSubmit={handleMeaningSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}