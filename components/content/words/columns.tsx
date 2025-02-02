"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WordListItem } from '@/lib/types/word';

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
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Link 
            href={`/admin/content/words/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.getValue('word')}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "word_type_name",
    header: "Tür",
    cell: ({ row }) => {
      const wordType = row.getValue('word_type_name') as string;
      return wordType || '-';
    }
  },
  {
    accessorKey: "cefr_level",
    header: "Seviye",
    cell: ({ row }) => {
      const level = row.getValue('cefr_level') as string;
      return level ? (
        <Badge variant="outline">{level}</Badge>
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const word = row.original;

      const handleDelete = async () => {
        try {
          logger.info("Kelime silme işlemi başlatıldı", { wordId: word.id });

          const supabase = createClient();
          const { error } = await supabase
            .from("words")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", word.id);

          if (error) {
            logger.error("Kelime silinirken hata oluştu", { error, wordId: word.id });
            throw error;
          }

          logger.info("Kelime başarıyla silindi", { wordId: word.id });
          toast.success("Kelime başarıyla silindi");
          window.location.reload();
        } catch (error) {
          toast.error("Kelime silinirken bir hata oluştu");
          console.error("Error deleting word:", error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(word.word)}
            >
              Kelimeyi Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/words/${word.id}`}>
                Görüntüle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/words/${word.id}/edit`}>
                Düzenle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 