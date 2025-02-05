import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentenceForm } from "@/components/content/sentences/sentence-form";
import { getSentence, updateSentenceAction } from "@/lib/api/sentences";
import { SentenceFormData } from "@/lib/types/sentence";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditSentencePageProps {
  params: {
    sentenceId: string;
  };
}

export default async function EditSentencePage({ params }: EditSentencePageProps) {
  const { data: sentence, error } = await getSentence(params.sentenceId);

  if (error || !sentence) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">📛 Cümle Bulunamadı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">📍 Konum:</h3>
            <p className="text-sm text-muted-foreground">Cümle Düzenleme Sayfası</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">❌ Hata Detayı:</h3>
            <p className="text-sm text-destructive">
              İstenen cümle bulunamadı veya erişim sırasında bir sorun oluştu.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">🔍 Kontrol Edilecek Noktalar:</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>URL'nin doğru olduğundan emin olun</li>
              <li>Cümlenin silinmemiş olduğunu kontrol edin</li>
              <li>Sayfayı yenileyin</li>
              <li>Cümleler listesine dönüp tekrar deneyin</li>
            </ul>
          </div>

          <div className="pt-4">
            <Button asChild variant="outline">
              <Link href="/admin/content/sentences">
                ← Cümleler Listesine Dön
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const initialData: SentenceFormData = {
    text: sentence.text,
    cefr_level: sentence.cefr_level || null,
    difficulty_level: sentence.difficulty_level || 1,
    language_id: sentence.language_id,
  };

  async function updateWithId(data: SentenceFormData) {
    "use server";
    await updateSentenceAction(params.sentenceId, data);
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cümle Düzenle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-4">
              <div>
                <p className="text-lg cursor-pointer">
                  {sentence.text.split(/\s+/).map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="hover:bg-primary/10 rounded px-1 py-0.5 transition-colors"
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <SentenceForm
            initialData={initialData}
            onSubmit={updateWithId}
            languages={[
              { id: "2201c7e1-50db-4711-af5a-c0fc254b6c39", name: "İngilizce" },
              { id: "b7f9a8e2-12cd-4c34-bf3a-a1d4e5c6f789", name: "Türkçe" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
