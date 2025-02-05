"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"

interface SearchInputProps {
  placeholder?: string
  className?: string
  paramName?: string
}

export function SearchInput({ 
  placeholder = "Ara...", 
  className = "",
  paramName = "search"
}: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get(paramName) ?? "")
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedValue) {
      params.set(paramName, debouncedValue)
    } else {
      params.delete(paramName)
    }
    router.push(`?${params.toString()}`)
  }, [debouncedValue, router, searchParams, paramName])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`pl-9 ${className}`}
      />
    </div>
  )
} 