// lib/constants.ts

export const CEFR_LEVELS = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

export const LANGUAGES = [
  { id: "tr", name: "Türkçe" },
  { id: "en", name: "İngilizce" },
  { id: "de", name: "Almanca" },
  { id: "fr", name: "Fransızca" },
  { id: "es", name: "İspanyolca" },
  { id: "it", name: "İtalyanca" },
] as const;

export const VIDEO_TYPES = {
  LESSON: "lesson",
  CONVERSATION: "conversation",
  PRONUNCIATION: "pronunciation",
  VOCABULARY: "vocabulary",
  GRAMMAR: "grammar"
} as const;

export const VIDEO_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const MAX_VIDEO_DURATION = 30 * 60; // 30 minutes in seconds
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export const SUPPORTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/ogg"
] as const;

export const VIDEO_DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced"
} as const;

// Validation constants
export const TITLE_MIN_LENGTH = 5;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 20;

// API endpoints
export const API_ROUTES = {
  VIDEOS: "/api/videos",
  YOUTUBE: "/api/youtube",
  UPLOAD: "/api/upload"
} as const;