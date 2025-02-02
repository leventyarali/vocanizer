'use client'

import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Message = {
  type: 'success' | 'error'
  message: string
}

export function FormMessage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  if (!error && !success) return null

  return (
    <Alert
      className={cn('text-sm', {
        'bg-destructive/15 text-destructive': error,
        'bg-emerald-500/15 text-emerald-500': success,
      })}
    >
      <div className="flex gap-2 items-center">
        {error ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        <AlertDescription>{error || success}</AlertDescription>
      </div>
    </Alert>
  )
}
