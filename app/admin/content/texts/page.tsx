"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface Text {
  id: string;
  title: string;
  content: string;
  cefr_level: string;
  difficulty_score: number;
  created_at: string;
}

export default function TextsPage() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const { data, error } = await supabase
        .from("texts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTexts(data || []);
    } catch (error) {
      console.error("Error fetching texts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Metinler</h2>
        <Button onClick={() => router.push("/admin/content/texts/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Metin
        </Button>
      </div>

      <DataTable columns={columns} data={texts} />
    </div>
  );
} 