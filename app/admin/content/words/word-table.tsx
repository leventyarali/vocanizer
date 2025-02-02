"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { WordListItem } from "@/lib/types/word";
import { useRouter, useSearchParams } from "next/navigation";

interface WordTableProps {
  data: WordListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}

export function WordTable({ data, pageCount, pageIndex, pageSize }: WordTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (pageIndex + 1).toString());
    router.push(`/admin/content/words?${params.toString()}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', pageSize.toString());
    params.set('page', '1');
    router.push(`/admin/content/words?${params.toString()}`);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={{
        pageIndex,
        pageSize,
        pageCount,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange
      }}
    />
  );
} 