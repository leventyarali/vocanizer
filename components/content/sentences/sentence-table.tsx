/**
 * Bu komponent cümleleri listelemek için kullanılır.
 * Tablo yapısı, arama, filtreleme ve sayfalama özelliklerini içerir.
 * 
 * ÖNEMLİ NOTLAR:
 * 1. Bu dosyanın adı değiştirilmemeli, sentences-table.tsx yerine sentence-table.tsx kullanılmalı
 * 2. Client component olarak işaretlenmeli ("use client")
 * 3. Eğer "createClient() from the server" hatası alınırsa:
 *    - Komponentin parent'ı server component olmalı
 *    - Data ve pagination bilgileri prop olarak gelmeli
 * 4. Eğer hydration hatası alınırsa:
 *    - useEffect içinde state güncellemeleri yapılmalı
 *    - Default değerler undefined yerine null olmalı
 */

"use client";

import { SentenceListItem } from "@/lib/types/sentence"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DIFFICULTY_LEVELS } from "@/lib/types/sentence"

interface SentenceTableProps {
  data: SentenceListItem[]
}

export function SentenceTable({ data }: SentenceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[300px]">Cümle</TableHead>
            <TableHead>Seviye</TableHead>
            <TableHead>Zorluk</TableHead>
            <TableHead className="w-[100px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sentence) => (
            <TableRow key={sentence.id}>
              <TableCell>
                <div className="space-y-2">
                  <div className="font-medium">
                    {sentence.text}
                  </div>
                  {sentence.translations?.map((translation) => (
                    <div key={translation.id} className="text-sm text-muted-foreground">
                      {translation.text}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {sentence.cefr_level && (
                  <Badge variant="outline">{sentence.cefr_level}</Badge>
                )}
              </TableCell>
              <TableCell>
                {sentence.difficulty_level && (
                  <Badge variant="outline">
                    {DIFFICULTY_LEVELS[sentence.difficulty_level as keyof typeof DIFFICULTY_LEVELS]}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/content/sentences/${sentence.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/admin/content/sentences/${sentence.id}/edit`}>
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
  )
} 