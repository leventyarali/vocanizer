"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { WordListItem } from "@/lib/types/word";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface WordTableProps {
  data: WordListItem[];
}

export function WordTable({ data }: WordTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kelime</TableHead>
            <TableHead>Tür</TableHead>
            <TableHead>Seviye</TableHead>
            <TableHead className="w-[100px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((word) => (
            <TableRow key={word.id}>
              <TableCell className="font-medium">
                {word.word}
              </TableCell>
              <TableCell>{word.word_type_name}</TableCell>
              <TableCell>
                {word.cefr_level && (
                  <Badge variant="outline">{word.cefr_level}</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/content/words/${word.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/content/words/${word.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 