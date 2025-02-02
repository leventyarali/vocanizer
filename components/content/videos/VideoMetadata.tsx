"use client";

// components/videos/VideoMetadata.tsx

import React, { useState, useEffect } from "react";

interface VideoMetadataProps {
    metadata: {
      youtubeId: string;
      viewCount?: number;
      tags?: string[];
      notes?: string;
    };
    onUpdate: (metadata: any) => void;
   }
   
   export function VideoMetadata({ metadata, onUpdate }: VideoMetadataProps) {
    const [notes, setNotes] = useState(metadata.notes || '');
    const [tags, setTags] = useState(metadata.tags || []);
   
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value);
      onUpdate({ ...metadata, notes: e.target.value });
    };
   
    const handleTagsChange = (newTags: string[]) => {
      setTags(newTags);
      onUpdate({ ...metadata, tags: newTags });
    };
   
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Video Notları</h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            className="w-full border rounded p-2 min-h-[100px]"
            placeholder="Video hakkında notlar ekleyin..."
          />
        </div>
   
        <div>
          <h3 className="font-medium mb-2">Etiketler</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                {tag}
                <button
                  onClick={() => handleTagsChange(tags.filter(t => t !== tag))}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
   
        {metadata.viewCount && (
          <div className="text-sm text-gray-600">
            Görüntülenme: {metadata.viewCount.toLocaleString()}
          </div>
        )}
      </div>
    );
   }