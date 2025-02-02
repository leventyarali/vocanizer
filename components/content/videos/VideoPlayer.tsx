"use client";

// components/content/videos/VideoPlayer.tsx
import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({ url, onTimeUpdate }: VideoPlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const videoId = url.includes('youtube.com') 
    ? new URL(url).searchParams.get('v')
    : url.split('/').pop();

  useEffect(() => {
    // YouTube Player API'sini yükle
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Player'ı oluştur
    let player: any;
    (window as any).onYouTubeIframeAPIReady = () => {
      player = new (window as any).YT.Player(`youtube-player-${videoId}`, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              // Her saniye zaman güncellemesi gönder
              setInterval(() => {
                const currentTime = player.getCurrentTime();
                onTimeUpdate?.(currentTime);
              }, 1000);
            }
          },
        },
      });
    };

    return () => {
      // Player'ı temizle
      if (player) {
        player.destroy();
      }
    };
  }, [videoId, onTimeUpdate]);

  return (
    <div className="relative pt-[56.25%]">
      <div id={`youtube-player-${videoId}`} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
