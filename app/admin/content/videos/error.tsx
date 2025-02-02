// app/admin/content/videos/error.tsx
"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from "lucide-react";

export default function Error() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.
      </AlertDescription>
    </Alert>
  );
}