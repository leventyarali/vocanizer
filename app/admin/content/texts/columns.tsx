"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Text {
  id: string;
  title: string;
  content: string;
  cefr_level: string;
  difficulty_score: number;
  created_at: string;
}

export const columns: ColumnDef<Text>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Başlık
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "content",
    header: "İçerik",
    cell: ({ row }) => {
      const content = row.getValue("content") as string;
      return (
        <div className="max-w-[500px] truncate">
          {content}
        </div>
      );
    },
  },
  {
    accessorKey: "cefr_level",
    header: "CEFR",
    cell: ({ row }) => {
      const level = row.getValue("cefr_level") as string;
      return (
        <div className="font-medium">
          {level}
        </div>
      );
    },
  },
  {
    accessorKey: "difficulty_score",
    header: "Zorluk",
    cell: ({ row }) => {
      const score = row.getValue("difficulty_score") as number;
      return (
        <div className="font-medium">
          {score}/100
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const text = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from("texts")
            .delete()
            .eq("id", text.id);

          if (error) throw error;
          toast.success("Metin başarıyla silindi");
          router.refresh();
        } catch (error) {
          toast.error("Metin silinirken bir hata oluştu");
          console.error("Error deleting text:", error);
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/admin/content/texts/${text.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 