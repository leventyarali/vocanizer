"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface Sentence {
  id: string;
  sentence: string;
  translation: string;
  cefr_level: string;
  difficulty_score: number;
  created_at: string;
}

export default function SentencesPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      const { data, error } = await supabase
        .from("sentences")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSentences(data || []);
    } catch (error) {
      console.error("Error fetching sentences:", error);
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
        <h2 className="text-3xl font-bold tracking-tight">Cümleler</h2>
        <Button onClick={() => router.push("/admin/content/sentences/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Cümle
        </Button>
      </div>

      <DataTable columns={columns} data={sentences} />
    </div>
  );
}
