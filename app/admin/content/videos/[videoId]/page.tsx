import { useVideo } from "@/hooks/videos/useVideo";
import { VideoPlayer } from "@/components/content/videos/VideoPlayer";
import { VideoMetadata } from "@/components/content/videos/VideoMetadata";

export default function VideoDetailPage({ params }: { params: { videoId: string } }) {
  const { video, loading } = useVideo(params.videoId);

  if (loading) return <div>Yükleniyor...</div>;
  if (!video) return <div>Video bulunamadı</div>;

  return (
    <div className="p-6">
      <VideoPlayer videoId={video.metadata.youtubeId} title={video.title} />
      <div className="mt-6">
        <VideoMetadata 
          metadata={video.metadata}
          onUpdate={(newMetadata) => {
            // Update logic
          }}
        />
      </div>
    </div>
  );
} 