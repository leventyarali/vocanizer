"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string
  role: string
}

const columns = [
  {
    accessorKey: "email",
    header: "E-posta",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "created_at",
    header: "Kayıt Tarihi",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString("tr-TR")
    },
  },
  {
    accessorKey: "last_sign_in_at",
    header: "Son Giriş",
    cell: ({ row }) => {
      const date = row.getValue("last_sign_in_at")
      return date ? new Date(date).toLocaleDateString("tr-TR") : "-"
    },
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Kullanıcı Yönetimi</h1>
      <p>Bu sayfa yapım aşamasındadır.</p>
      <DataTable columns={columns} data={users} loading={loading} />
    </div>
  )
} 