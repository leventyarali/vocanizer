import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function SentencesLoading() {
  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Cümleler</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm cümleleri yönetin
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Cümle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Skeleton className="h-10 w-[250px]" />
          </div>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Skeleton className="h-4 w-[100px]" />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Skeleton className="h-4 w-[80px]" />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Skeleton className="h-4 w-[120px]" />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Skeleton className="h-4 w-[100px]" />
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">
                        <Skeleton className="h-4 w-[300px]" />
                      </td>
                      <td className="p-4 align-middle">
                        <Skeleton className="h-4 w-[80px]" />
                      </td>
                      <td className="p-4 align-middle">
                        <Skeleton className="h-4 w-[100px]" />
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
