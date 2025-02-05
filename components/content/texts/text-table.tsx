"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { deleteText } from "@/lib/api/texts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { TextListItem, CONTENT_TYPES } from "@/lib/types/text";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { highlightText } from "@/lib/utils/highlight";

interface TextTableProps {
  data: TextListItem[];
}

export function TextTable({ data }: TextTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteText(id);
      toast.success("Metin başarıyla silindi");
      router.refresh();
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Metin silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>İçerik Türü</TableHead>
            <TableHead>CEFR</TableHead>
            <TableHead>Kelime Sayısı</TableHead>
            <TableHead className="w-[100px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((text) => (
            <TableRow key={text.id}>
              <TableCell className="font-medium">
                <div dangerouslySetInnerHTML={{ 
                  __html: highlightText(text.title, search) 
                }} />
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {CONTENT_TYPES[text.content_type as keyof typeof CONTENT_TYPES]}
                </Badge>
              </TableCell>
              <TableCell>
                {text.cefr_level && (
                  <Badge variant="outline">{text.cefr_level}</Badge>
                )}
              </TableCell>
              <TableCell>{text.word_count || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/content/texts/${text.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/content/texts/${text.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu işlem geri alınamaz. Bu metin kalıcı olarak silinecektir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(text.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Siliniyor..." : "Sil"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 