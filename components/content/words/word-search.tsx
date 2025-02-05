"use client"

import { SearchInput } from "@/components/common/search-input"

export function WordSearch() {
  return (
    <SearchInput
      placeholder="Kelime ara..."
      className="max-w-sm"
      paramName="word"
    />
  )
} 