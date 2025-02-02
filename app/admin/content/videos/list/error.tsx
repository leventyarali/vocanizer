// app/admin/content/videos/list/error.tsx
"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from "lucide-react";

export default function Error() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Video listesi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
      </AlertDescription>
    </Alert>
  );
}
