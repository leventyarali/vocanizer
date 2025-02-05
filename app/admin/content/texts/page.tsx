import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TextTable } from "@/components/content/texts/text-table";
import { getTexts } from "@/lib/api/texts";
import { TextSearch } from "@/components/content/texts/text-search";

function TextsError({ error }: { error: Error }) {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Hata Oluştu</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{error.message}</p>
      </CardContent>
    </Card>
  );
}

export default async function TextListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const { data, error } = await getTexts(1, 20, { title: search })

  if (error) {
    return <TextsError error={error} />
  }

  if (!data) {
    return <TextsError error={new Error("Metinler yüklenirken bir hata oluştu")} />
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Metinler</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm metinleri yönetin
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/content/texts/create" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Metin
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <TextSearch />
          </div>
          <TextTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
} 