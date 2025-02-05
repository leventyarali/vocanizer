'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getWordTypes } from '@/lib/api/word-types';
import { WordType } from '@/lib/types/word';

const formSchema = z.object({
  word_type_id: z.number().min(1, 'Kelime türü seçilmelidir'),
  cefr_level: z.enum(['NONE', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const),
});

export type WordTypeFormData = z.infer<typeof formSchema>;

interface WordTypeFormProps {
  defaultValues?: Partial<WordTypeFormData>;
  onSubmit: (data: WordTypeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function WordTypeForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: WordTypeFormProps) {
  const [wordTypes, setWordTypes] = useState<WordType[]>([]);

  useEffect(() => {
    const fetchWordTypes = async () => {
      try {
        const response = await getWordTypes();
        if (response.data) {
          setWordTypes(response.data);
        }
      } catch (error) {
        console.error('Kelime türleri yüklenirken hata oluştu:', error);
      }
    };

    fetchWordTypes();
  }, []);

  const form = useForm<WordTypeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word_type_id: undefined,
      cefr_level: 'NONE',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="word_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelime Türü</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kelime türü seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wordTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Kelimenin türünü seçin (isim, fiil, sıfat vb.).
              </FormDescription>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="CEFR seviyesi seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NONE">Belirtilmemiş</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Kelimenin CEFR seviyesini seçin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Kaydediliyor...' : 'Devam Et'}
        </Button>
      </form>
    </Form>
  );
} 