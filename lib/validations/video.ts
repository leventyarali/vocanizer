// lib/validations/video.ts
import * as z from "zod";

export const VideoSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  url: z.string().url("Geçerli bir URL giriniz").min(1, "URL zorunludur"),
  language_id: z.string().min(1, "Dil seçimi zorunludur"),
  cefr_level: z.string().min(1, "Seviye seçimi zorunludur"),
  status: z.enum(["draft", "published", "archived"]),
  metadata: z.object({
    tags: z.array(z.string()).optional(),
    youtubeId: z.string().optional(),
    viewCount: z.number().optional(),
  }),
});

export function validateVideo(data: Partial<Video>): string[] {
    const errors: string[] = [];
    if (!data.title || data.title.length < 5) errors.push('Title is too short');
    if (!data.url) errors.push('URL is required');
    if (!data.language_id) errors.push('Language is required');
    return errors;
  }