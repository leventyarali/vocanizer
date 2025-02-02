"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  sentence: z.string().min(1, "Cümle gereklidir"),
  translation: z.string().min(1, "Çeviri gereklidir"),
  language_id: z.string().min(1, "Dil seçimi gereklidir"),
  language_variant_id: z.string().min(1, "Dil varyantı seçimi gereklidir"),
  cefr_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  difficulty_score: z.number().min(1).max(100).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Language {
  id: string;
  name: string;
}

interface LanguageVariant {
  id: string;
  variant_name: string;
}

interface SentenceFormProps {
  initialData?: FormValues;
  sentenceId?: string;
}

interface FieldProps {
  field: {
    onChange: (value: any) => void;
    value: any;
  };
}

export function SentenceForm({ initialData, sentenceId }: SentenceFormProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [variants, setVariants] = useState<LanguageVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      sentence: "",
      translation: "",
      language_id: "",
      language_variant_id: "",
      cefr_level: "A1",
      difficulty_score: 50,
    },
  });

  useEffect(() => {
    fetchLanguages();
  }, []);

  const languageId = form.watch("language_id");
  useEffect(() => {
    if (languageId) {
      fetchVariants(languageId);
    }
  }, [languageId]);

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");

      if (error) throw error;
      setLanguages(data || []);
    } catch (error) {
      toast.error("Diller yüklenirken bir hata oluştu");
      console.error("Error fetching languages:", error);
    }
  };

  const fetchVariants = async (languageId: string) => {
    try {
      const { data, error } = await supabase
        .from("language_variants")
        .select("*")
        .eq("language_id", languageId)
        .order("variant_name");

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      toast.error("Dil varyantları yüklenirken bir hata oluştu");
      console.error("Error fetching variants:", error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (sentenceId) {
        const { error } = await supabase
          .from("sentences")
          .update(values)
          .eq("id", sentenceId);
        if (error) throw error;
        toast.success("Cümle başarıyla güncellendi");
      } else {
        const { error } = await supabase.from("sentences").insert(values);
        if (error) throw error;
        toast.success("Cümle başarıyla eklendi");
      }
      router.push("/admin/content/sentences/list");
    } catch (error) {
      toast.error("Bir hata oluştu");
      console.error("Error saving sentence:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sentenceId ? "Cümle Düzenle" : "Yeni Cümle Ekle"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="sentence"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>Cümle</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cümleyi girin"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="translation"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>Çeviri</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Çeviriyi girin"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="language_id"
                  render={({ field }: FieldProps) => (
                    <FormItem>
                      <FormLabel>Dil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Dil seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
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
                  name="language_variant_id"
                  render={({ field }: FieldProps) => (
                    <FormItem>
                      <FormLabel>Dil Varyantı</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        disabled={!form.watch("language_id")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Varyant seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {variants.map((variant) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.variant_name}
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
                  render={({ field }: FieldProps) => (
                    <FormItem>
                      <FormLabel>CEFR Seviyesi</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seviye seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
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
                  name="difficulty_score"
                  render={({ field }: FieldProps) => (
                    <FormItem>
                      <FormLabel>Zorluk Puanı (1-100)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/content/sentences/list")}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {sentenceId ? "Güncelle" : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 