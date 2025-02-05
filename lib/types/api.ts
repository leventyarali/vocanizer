import { PostgrestError } from "@supabase/supabase-js";

export interface ApiResponse<T> {
  data?: T;
  error?: PostgrestError;
  metadata?: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
} 