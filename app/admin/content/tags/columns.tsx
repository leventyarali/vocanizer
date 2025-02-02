"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Tag {
  id: string
  name: string
  description: string
  created_at: string
}

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: "Ad",
  },
  {
    accessorKey: "description",
    header: "Açıklama",
  },
  {
    accessorKey: "created_at",
    header: "Oluşturulma Tarihi",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString("tr-TR")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter()
      const tag = row.original

      const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from("tags")
            .delete()
            .eq("id", tag.id)

          if (error) throw error
          toast.success("Etiket başarıyla silindi")
          router.refresh()
        } catch (error) {
          toast.error("Etiket silinirken bir hata oluştu")
          console.error("Error deleting tag:", error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/content/tags/${tag.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 