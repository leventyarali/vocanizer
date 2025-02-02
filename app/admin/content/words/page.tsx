import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getWords } from "@/lib/api/words";
import { WordSearch } from "./word-search";
import { WordTable } from "./word-table";

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
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const { data, error, metadata } = await getWords(page, limit, { word: search });

  if (error) {
    return <WordsError error={error} />;
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Kelimeler</CardTitle>
          <Button asChild>
            <Link href="/admin/content/words/new" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kelime
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <WordSearch defaultValue={search} />
          <WordTable
            data={data || []}
            pageIndex={page - 1}
            pageSize={limit}
            pageCount={metadata?.totalPages || 0}
          />
        </CardContent>
      </Card>
    </div>
  );
}