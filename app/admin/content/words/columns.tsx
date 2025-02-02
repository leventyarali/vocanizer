"use client"

import Link from 'next/link'
import { ColumnDef } from "@tanstack/react-table"
import { WordListItem } from '@/lib/types/word'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<WordListItem>[] = [
  {
    accessorKey: "word",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kelime
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const word = row.getValue('word') as string;
      const isOxford3000 = row.original.is_oxford_3000;
      const isOxford5000 = row.original.is_oxford_5000;
      
      return (
        <div className="flex items-center gap-2">
          <Link 
            href={`/admin/content/words/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {word}
          </Link>
          <div className="flex gap-1">
            {isOxford3000 && (
              <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-700">
                Oxford 3000
              </Badge>
            )}
            {isOxford5000 && (
              <Badge variant="secondary" className="bg-purple-100 hover:bg-purple-100 text-purple-700">
                Oxford 5000
              </Badge>
            )}
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "word_type_name",
    header: "Tür",
    cell: ({ row }) => {
      const wordType = row.getValue('word_type_name') as string;
      return (
        <Badge variant="outline" className="font-normal">
          {wordType || '-'}
        </Badge>
      );
    }
  },
  {
    accessorKey: "cefr_level",
    header: "Seviye",
    cell: ({ row }) => {
      const level = row.getValue('cefr_level') as string;
      const levelColors: { [key: string]: string } = {
        'A1': 'bg-red-100 hover:bg-red-100 text-red-700',
        'A2': 'bg-orange-100 hover:bg-orange-100 text-orange-700',
        'B1': 'bg-yellow-100 hover:bg-yellow-100 text-yellow-700',
        'B2': 'bg-green-100 hover:bg-green-100 text-green-700',
        'C1': 'bg-blue-100 hover:bg-blue-100 text-blue-700',
        'C2': 'bg-purple-100 hover:bg-purple-100 text-purple-700',
      };
      
      return level ? (
        <Badge variant="secondary" className={levelColors[level] || ''}>
          {level}
        </Badge>
      ) : '-';
    }
  },
  {
    accessorKey: "definition_en",
    header: "İngilizce Tanım",
    cell: ({ row }) => {
      const definition = row.getValue("definition_en") as string;
      return <div className="max-w-[400px] truncate">{definition || "-"}</div>;
    }
  },
  {
    accessorKey: "definition_tr",
    header: "Türkçe Tanım",
    cell: ({ row }) => {
      const definition = row.getValue("definition_tr") as string;
      return <div className="max-w-[400px] truncate">{definition || "-"}</div>;
    }
  },
  {
    accessorKey: "is_active",
    header: "Durum",
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Aktif' : 'Pasif'}
        </Badge>
      );
    }
  }
] 