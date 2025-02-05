import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getWords } from "@/lib/api/words";
import { WordTable } from "@/components/content/words/word-table";
import { WordSearch } from "@/components/content/words/word-search";

function WordsError({ error }: { error: Error }) {
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

export default async function WordListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.word === 'string' ? searchParams.word : undefined;
  const { data, error } = await getWords(1, 10, { word: search });

  if (error) {
    return <WordsError error={error} />;
  }

  if (!data) {
    return <WordsError error={new Error("Kelimeler yüklenirken bir hata oluştu")} />;
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Kelimeler</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm kelimeleri yönetin
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/content/words/create" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kelime
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <WordSearch />
          </div>
          <WordTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
}