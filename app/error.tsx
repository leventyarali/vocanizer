'use client'

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h2 className="text-lg font-semibold">Bir şeyler yanlış gitti</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "Beklenmeyen bir hata oluştu."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Tekrar Dene
      </Button>
    </div>
  )
} 