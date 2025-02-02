"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"

interface Tag {
  id: string
  name: string
  description: string
  created_at: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name")

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Etiketler"
        description={`Toplam ${tags.length} etiket`}
      >
        <Button onClick={() => router.push("/admin/content/tags/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etiket
        </Button>
      </PageHeader>

      <DataTable 
        columns={columns} 
        data={tags} 
        loading={loading}
        onRowClick={(row) => router.push(`/admin/content/tags/${row.id}`)}
      />
    </div>
  )
} 