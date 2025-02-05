import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function SentenceDetailLoading() {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Cümle Detayı</CardTitle>
          <Skeleton className="h-10 w-[100px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[200px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[200px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 