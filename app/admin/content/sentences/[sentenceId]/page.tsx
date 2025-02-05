import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { getSentence } from "@/lib/api/sentences";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_LEVELS } from "@/lib/types/sentence";

interface SentenceDetailPageProps {
  params: {
    sentenceId: string;
  };
}

export default async function SentenceDetailPage({ params }: SentenceDetailPageProps) {
  const { data: sentence, error } = await getSentence(params.sentenceId);

  if (error || !sentence) {
    notFound();
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Cümle Detayı</CardTitle>
          <Button asChild>
            <Link href={`/admin/content/sentences/${sentence.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cümle</h3>
                <p className="mt-1 text-lg">{sentence.text}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Çeviri</h3>
                <p className="mt-1 text-lg">{sentence.translation}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CEFR Seviyesi</h3>
                <div className="mt-1">
                  {sentence.cefr_level ? (
                    <Badge variant="outline">{sentence.cefr_level}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Belirtilmemiş</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Zorluk Seviyesi</h3>
                <div className="mt-1">
                  {sentence.difficulty_level ? (
                    <Badge variant="outline">
                      {DIFFICULTY_LEVELS[sentence.difficulty_level]}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Belirtilmemiş</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Oluşturulma Tarihi</h3>
                <p className="mt-1">
                  {sentence.created_at ? new Date(sentence.created_at).toLocaleString('tr-TR') : 'Belirtilmemiş'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Son Güncelleme</h3>
                <p className="mt-1">
                  {sentence.updated_at ? new Date(sentence.updated_at).toLocaleString('tr-TR') : 'Belirtilmemiş'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
