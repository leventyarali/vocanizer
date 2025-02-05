"use client"

import { SearchInput } from "@/components/common/search-input"

interface TextSearchProps {
  onHighlight?: (text: string) => void
}

export function TextSearch({ onHighlight }: TextSearchProps) {
  return (
    <SearchInput
      placeholder="Metin ara..."
      className="max-w-sm"
      paramName="search"
    />
  )
} 