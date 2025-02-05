import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentenceForm } from "@/components/content/sentences/sentence-form";
import { createSentenceAction } from "@/lib/api/sentences";

export default function CreateSentencePage() {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Cümle</CardTitle>
        </CardHeader>
        <CardContent>
          <SentenceForm
            onSubmit={createSentenceAction}
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
