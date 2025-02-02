"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Stats {
  words: {
    total: number;
    byLevel: { [key: string]: number };
    byType: { [key: string]: number };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const WORD_TYPES: { [key: string]: string } = {
  '1': 'İsim',
  '2': 'Fiil',
  '3': 'Sıfat',
  '4': 'Zarf',
  '5': 'Zamir',
  '6': 'Edat',
  '7': 'Bağlaç',
  '8': 'Ünlem'
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    words: { 
      total: 0, 
      byLevel: {},
      byType: {}
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        
        // Kelime istatistikleri
        const { data: words, error } = await supabase
          .from('v_word_list')
          .select('word_type_id, word_type_name, cefr_level')
          .is('deleted_at', null);

        if (error) throw error;
        
        const wordLevels = (words || []).reduce((acc: { [key: string]: number }, word) => {
          if (word.cefr_level) {
            acc[word.cefr_level] = (acc[word.cefr_level] || 0) + 1;
          }
          return acc;
        }, {});

        const wordTypes = (words || []).reduce((acc: { [key: string]: number }, word) => {
          if (word.word_type_id) {
            acc[word.word_type_id] = (acc[word.word_type_id] || 0) + 1;
          }
          return acc;
        }, {});

        setStats({
          words: {
            total: words?.length || 0,
            byLevel: wordLevels,
            byType: wordTypes
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const levelChartData = Object.entries(stats.words.byLevel)
    .sort((a, b) => {
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      return levels.indexOf(a[0]) - levels.indexOf(b[0]);
    })
    .map(([level, count]) => ({
      name: level,
      value: count
    }));

  const typeChartData = Object.entries(stats.words.byType)
    .map(([type, count]) => ({
      name: WORD_TYPES[type] || type,
      value: count
    }));

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Yönetim Paneli"
          description="Sistem istatistikleri ve özet bilgiler"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yönetim Paneli"
        description="Sistem istatistikleri ve özet bilgiler"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CEFR Seviyelerine Göre Kelime Dağılımı</CardTitle>
            <div className="text-sm text-muted-foreground">
              Toplam {stats.words.total} kelime
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {levelChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Kelime Sayısı']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sözcük Türlerine Göre Kelime Dağılımı</CardTitle>
            <div className="text-sm text-muted-foreground">
              Toplam {stats.words.total} kelime
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Kelime Sayısı']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 