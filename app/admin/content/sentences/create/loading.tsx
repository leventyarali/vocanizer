import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateSentenceLoading() {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Cümle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 