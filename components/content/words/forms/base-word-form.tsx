// components/content/words/forms/base-word-form.tsx
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  word: z.string().min(1, 'Kelime boş bırakılamaz'),
  is_active: z.boolean().default(true),
  is_public: z.boolean().default(true),
});

export type BaseWordFormData = z.infer<typeof formSchema>;

interface BaseWordFormProps {
  defaultValues?: Partial<BaseWordFormData>;
  onSubmit: (data: BaseWordFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BaseWordForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: BaseWordFormProps) {
  const form = useForm<BaseWordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: '',
      is_active: true,
      is_public: true,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="word"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelime</FormLabel>
              <FormControl>
                <Input placeholder="Kelimeyi girin" {...field} />
              </FormControl>
              <FormDescription>
                Eklemek istediğiniz kelimeyi girin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktif</FormLabel>
                <FormDescription>
                  Kelime aktif olarak kullanılabilir durumda olsun mu?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Herkese Açık</FormLabel>
                <FormDescription>
                  Kelime herkese açık olarak görüntülenebilir olsun mu?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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