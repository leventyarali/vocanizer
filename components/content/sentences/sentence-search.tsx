"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"

export function SentenceSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("search") ?? "")
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedValue) {
      params.set("search", debouncedValue)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }, [debouncedValue, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cümle ara..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 max-w-sm"
      />
    </div>
  )
} 