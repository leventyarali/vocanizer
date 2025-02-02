"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface WordSearchProps {
  defaultValue?: string;
}

export function WordSearch({ defaultValue = '' }: WordSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set('page', '1');
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    router.push(`/admin/content/words?${createQueryString('search', searchTerm)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router.push(`/admin/content/words?${createQueryString('search', value)}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              name="search"
              placeholder="Kelime ara..."
              defaultValue={defaultValue}
              onChange={handleChange}
              className="pl-8"
            />
          </form>
        </div>
      </div>
    </div>
  );
} 