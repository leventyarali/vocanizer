'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { WordForm } from '@/components/content/words/word-form';
import { createWord } from '@/lib/api/words';
import { BaseWordFormData } from '@/components/content/words/forms/base-word-form';
import { WordTypeFormData } from '@/components/content/words/forms/word-type-form';
import { WordMeaningFormData } from '@/components/content/words/forms/word-meaning-form';

export default function CreateWordPage() {
  const router = useRouter();

  const handleSubmit = async (
    base: BaseWordFormData,
    type: WordTypeFormData,
    meaning: WordMeaningFormData
  ) => {
    try {
      await createWord({
        word: base.word,
        word_type_id: type.word_type_id.toString(),
        cefr_level: type.cefr_level,
        is_active: base.is_active,
        is_public: base.is_public,
        meanings: [{
          definition_tr: meaning.definition_tr,
          definition_en: meaning.definition_en,
          example_tr: meaning.example_tr,
          example_en: meaning.example_en,
        }]
      });
      toast.success('Kelime başarıyla oluşturuldu');
      router.push('/admin/content/words');
    } catch (error) {
      toast.error('Kelime oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Yeni Kelime Ekle</h1>
      <WordForm onSubmit={handleSubmit} />
    </div>
  );
}
