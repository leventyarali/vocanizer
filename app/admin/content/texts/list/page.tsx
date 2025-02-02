"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { Text } from "./columns";

export default function TextListPage() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      logger.info("Metinler yükleniyor");

      const { data, error } = await createClient()
        .from("texts")
        .select(`
          *,
          language:languages(name),
          language_variant:language_variants(variant_name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Metinler yüklenirken hata oluştu", { error });
        throw error;
      }

      setTexts(data || []);
      logger.info("Metinler başarıyla yüklendi", { count: data?.length });
    } catch (error) {
      toast.error("Metinler yüklenirken bir hata oluştu");
      console.error("Error fetching texts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Metin Yönetimi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Toplam {texts.length} metin bulundu
          </p>
        </div>
        <Button 
          onClick={() => {
            logger.info("Yeni metin ekleme sayfasına yönlendiriliyor");
            router.push("/admin/content/texts/create");
          }}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Metin
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <DataTable columns={columns} data={texts} loading={loading} />
      </div>
    </div>
  );
}
