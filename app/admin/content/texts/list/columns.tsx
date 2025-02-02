"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export type Text = {
  id: string;
  title: string;
  content: string;
  cefr_level: string;
  language: { name: string };
  language_variant: { variant_name: string };
  created_at: string;
};

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
      return <span>{content.slice(0, 50)}...</span>;
    },
  },
  {
    accessorKey: "language.name",
    header: "Dil",
  },
  {
    accessorKey: "language_variant.variant_name",
    header: "Dil Varyantı",
  },
  {
    accessorKey: "cefr_level",
    header: "CEFR",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const text = row.original;

      const handleDelete = async () => {
        try {
          logger.info("Metin silme işlemi başlatıldı", { textId: text.id });

          const { error } = await supabase
            .from("texts")
            .delete()
            .eq("id", text.id);

          if (error) {
            logger.error("Metin silinirken hata oluştu", { error, textId: text.id });
            throw error;
          }

          logger.info("Metin başarıyla silindi", { textId: text.id });
          toast.success("Metin başarıyla silindi");
          window.location.reload();
        } catch (error) {
          toast.error("Metin silinirken bir hata oluştu");
          console.error("Error deleting text:", error);
        }
      };

      return (
        <div className="flex gap-2">
          <Link href={`/admin/content/texts/${text.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }
]; 