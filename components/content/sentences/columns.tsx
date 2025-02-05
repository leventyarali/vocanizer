"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileText, Volume2, Image, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SentenceListItem, DIFFICULTY_LEVELS } from "@/lib/types/sentence";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { deleteSentence } from "@/lib/api/sentences";

export const columns: ColumnDef<SentenceListItem>[] = [
  {
    accessorKey: "text",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cümle
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const hasAudio = row.original.has_audio;
      const hasImage = row.original.has_image;
      const hasSourceText = row.original.source_text_id;
      
      return (
        <div className="space-y-1">
          <div className="font-medium flex items-center gap-2">
            <Link 
              href={`/admin/content/sentences/${row.original.id}`}
              className="hover:underline"
            >
              {row.getValue("text")}
            </Link>
            <div className="flex gap-1">
              {hasSourceText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Metne bağlı</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {hasAudio && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ses dosyası mevcut</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {hasImage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Görsel mevcut</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.translation}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "cefr_level",
    header: "CEFR",
    cell: ({ row }) => {
      const level = row.getValue("cefr_level") as string;
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
    accessorKey: "difficulty_level",
    header: "Zorluk",
    cell: ({ row }) => {
      const level = row.getValue("difficulty_level") as number;
      const levelText = DIFFICULTY_LEVELS[level as keyof typeof DIFFICULTY_LEVELS];
      
      return level ? (
        <Badge variant="outline">
          {levelText}
        </Badge>
      ) : '-';
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sentence = row.original;

      const handleDelete = async () => {
        try {
          const { error } = await deleteSentence(sentence.id);
          if (error) throw error;
          
          toast.success("Cümle başarıyla silindi");
          window.location.reload();
        } catch (error) {
          toast.error("Cümle silinirken bir hata oluştu");
          console.error("Error deleting sentence:", error);
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
              onClick={() => navigator.clipboard.writeText(sentence.text)}
            >
              Cümleyi Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/sentences/${sentence.id}`}>
                Görüntüle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/sentences/${sentence.id}/edit`}>
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