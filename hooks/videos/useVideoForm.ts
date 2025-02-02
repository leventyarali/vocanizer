// hooks/videos/useVideoForm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Video } from "@/lib/types/video";
import { validateVideo } from '@/lib/validations/video';
import { toast } from '@/hooks/use-toast';

interface UseVideoFormProps {
  videoId?: string;
  onSaved?: () => void;
}

export function useVideoForm({ videoId, onSaved }: UseVideoFormProps = {}) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Video>) => {
    try {
      setIsSubmitting(true);
      setErrors([]);

      const url = videoId 
        ? `/api/videos/${videoId}`
        : '/api/videos';

      const method = videoId ? 'PUT' : 'POST';

      const validationErrors = validateVideo(data);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'İşlem başarısız');
      }

      const result = await response.json();
      onSaved?.();

      if (!videoId) {
        const video = result;
        router.push(`/admin/content/videos/${video.id}`);
      }

      toast({
        title: "Başarılı",
        description: videoId ? "Video güncellendi" : "Video eklendi",
      });

      return result;
    } catch (error) {
      setErrors(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    isSubmitting,
    handleSubmit,
    formState: {
      isSubmitting,
    },
    onSuccess: onSaved,
  };
}

// Helper function to extract YouTube ID from URL
function extractYoutubeId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
