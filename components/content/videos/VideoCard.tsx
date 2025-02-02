//components/videos/VideoCard.tsx
import Link from "next/link";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Video } from "@/lib/types/video";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/admin/content/videos/${video.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="aspect-video relative">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <Badge 
              className="absolute top-2 right-2"
              variant={video.status === "published" ? "default" : "secondary"}
            >
              {video.status}
            </Badge>
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate">{video.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDistance(new Date(video.createdAt), new Date(), { 
                addSuffix: true,
                locale: tr 
              })}
            </p>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t flex justify-between">
          <Badge variant="outline">{video.language}</Badge>
          <Badge variant="outline">{video.level}</Badge>
          <Badge variant="outline">{video.type}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}