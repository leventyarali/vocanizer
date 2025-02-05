import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SentenceTable } from "@/components/content/sentences/sentence-table"
import { getSentences } from "@/lib/api/sentences"
import { SentenceSearch } from "@/components/content/sentences/sentence-search"
import { Suspense } from "react"

async function SentenceContent({
  search
}: {
  search?: string
}) {
  const { data, error } = await getSentences(search)

  if (error || !data) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Cümleler yüklenirken bir sorun oluştu
      </div>
    )
  }

  return <SentenceTable data={data} />
}

export default async function SentenceListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = searchParams?.search?.toString();

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Cümleler</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm cümleleri yönetin
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/content/sentences/create" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Cümle
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <SentenceSearch />
          </div>
          <Suspense fallback={<div className="text-center p-4 text-muted-foreground">Yükleniyor...</div>}>
            <SentenceContent search={search} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 