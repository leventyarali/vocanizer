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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  definition_tr: z.string().min(1, 'Türkçe tanım boş bırakılamaz'),
  definition_en: z.string().min(1, 'İngilizce tanım boş bırakılamaz'),
  detailed_definition_tr: z.string().optional(),
  detailed_definition_en: z.string().optional(),
  grammar_tr: z.string().optional(),
  grammar_en: z.string().optional(),
  hint_tr: z.string().optional(),
  hint_en: z.string().optional(),
});

export type WordMeaningFormData = z.infer<typeof formSchema>;

interface WordMeaningFormProps {
  defaultValues?: Partial<WordMeaningFormData>;
  onSubmit: (data: WordMeaningFormData) => Promise<void>;
  isLoading?: boolean;
}

export function WordMeaningForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: WordMeaningFormProps) {
  const form = useForm<WordMeaningFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      definition_tr: '',
      definition_en: '',
      detailed_definition_tr: '',
      detailed_definition_en: '',
      grammar_tr: '',
      grammar_en: '',
      hint_tr: '',
      hint_en: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="definition_tr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Türkçe Tanım</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kelimenin Türkçe tanımını girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimenin Türkçe tanımını girin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İngilizce Tanım</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kelimenin İngilizce tanımını girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimenin İngilizce tanımını girin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailed_definition_tr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Türkçe Detaylı Tanım</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kelimenin Türkçe detaylı tanımını girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimenin Türkçe detaylı tanımını girin (isteğe bağlı).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailed_definition_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İngilizce Detaylı Tanım</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kelimenin İngilizce detaylı tanımını girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimenin İngilizce detaylı tanımını girin (isteğe bağlı).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grammar_tr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Türkçe Gramer Notu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Türkçe gramer notunu girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimeyle ilgili Türkçe gramer notunu girin (isteğe bağlı).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grammar_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İngilizce Gramer Notu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="İngilizce gramer notunu girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimeyle ilgili İngilizce gramer notunu girin (isteğe bağlı).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hint_tr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Türkçe İpucu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Türkçe kullanım ipucunu girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimeyle ilgili Türkçe kullanım ipucunu girin (isteğe bağlı).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hint_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İngilizce İpucu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="İngilizce kullanım ipucunu girin"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kelimeyle ilgili İngilizce kullanım ipucunu girin (isteğe bağlı).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </form>
    </Form>
  );
} 