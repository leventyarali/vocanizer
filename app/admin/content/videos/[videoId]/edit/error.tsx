// app/admin/content/videos/[videoId]/error.tsx
"use client";

import { useEffect } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <p>Something went wrong while loading this video.</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}