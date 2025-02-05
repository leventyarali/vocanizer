export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      adaptive_recommendations: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          is_shown: boolean | null
          priority: number | null
          reason: string | null
          user_id: string
          valid_until: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_shown?: boolean | null
          priority?: number | null
          reason?: string | null
          user_id: string
          valid_until?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_shown?: boolean | null
          priority?: number | null
          reason?: string | null
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      daily_statistics: {
        Row: {
          created_at: string | null
          date: string
          details: Json | null
          exercises_completed: number | null
          id: string
          minutes_studied: number | null
          streak_days: number | null
          updated_at: string | null
          user_id: string
          words_learned: number | null
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          details?: Json | null
          exercises_completed?: number | null
          id?: string
          minutes_studied?: number | null
          streak_days?: number | null
          updated_at?: string | null
          user_id: string
          words_learned?: number | null
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          details?: Json | null
          exercises_completed?: number | null
          id?: string
          minutes_studied?: number | null
          streak_days?: number | null
          updated_at?: string | null
          user_id?: string
          words_learned?: number | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      exercise_responses: {
        Row: {
          attempts: number | null
          created_at: string | null
          exercise_id: string
          feedback_given: string | null
          id: string
          is_correct: boolean | null
          points_earned: number | null
          response_data: Json
          response_time: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          exercise_id: string
          feedback_given?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          response_data: Json
          response_time?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          exercise_id?: string
          feedback_given?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          response_data?: Json
          response_time?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_responses_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "learning_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_templates: {
        Row: {
          category: Database["public"]["Enums"]["exercise_template_category"]
          created_at: string | null
          feedback_templates: Json
          id: string
          instruction_template: string
          points: number | null
          subcategory: Database["public"]["Enums"]["exercise_template_subcategory"]
          template_structure: Json
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["exercise_template_category"]
          created_at?: string | null
          feedback_templates: Json
          id?: string
          instruction_template: string
          points?: number | null
          subcategory: Database["public"]["Enums"]["exercise_template_subcategory"]
          template_structure: Json
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["exercise_template_category"]
          created_at?: string | null
          feedback_templates?: Json
          id?: string
          instruction_template?: string
          points?: number | null
          subcategory?: Database["public"]["Enums"]["exercise_template_subcategory"]
          template_structure?: Json
          title?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          content_structure: Json
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          id: string
          instructions: string | null
          is_active: boolean | null
          success_threshold: number | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          content_structure: Json
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          success_threshold?: number | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          content_structure?: Json
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          success_threshold?: number | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "exercise_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      external_references: {
        Row: {
          created_at: string | null
          error_log: string | null
          external_url: string | null
          id: string
          is_active: boolean | null
          language_id: string
          last_synced_at: string | null
          reference_data: Json | null
          source_type: Database["public"]["Enums"]["external_source_type"]
          sync_status: Database["public"]["Enums"]["sync_status_type"] | null
          updated_at: string | null
          word_id: string
        }
        Insert: {
          created_at?: string | null
          error_log?: string | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          language_id: string
          last_synced_at?: string | null
          reference_data?: Json | null
          source_type: Database["public"]["Enums"]["external_source_type"]
          sync_status?: Database["public"]["Enums"]["sync_status_type"] | null
          updated_at?: string | null
          word_id: string
        }
        Update: {
          created_at?: string | null
          error_log?: string | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          language_id?: string
          last_synced_at?: string | null
          reference_data?: Json | null
          source_type?: Database["public"]["Enums"]["external_source_type"]
          sync_status?: Database["public"]["Enums"]["sync_status_type"] | null
          updated_at?: string | null
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_language_id"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_word_id"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "fk_word_id"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "v_word_list"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "fk_word_id"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      idioms: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          created_at: string | null
          created_by: string | null
          figurative_meaning: string | null
          id: string
          language_id: string
          literal_meaning: string | null
          text: string
          updated_at: string | null
          usage_notes: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          created_at?: string | null
          created_by?: string | null
          figurative_meaning?: string | null
          id?: string
          language_id: string
          literal_meaning?: string | null
          text: string
          updated_at?: string | null
          usage_notes?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          created_at?: string | null
          created_by?: string | null
          figurative_meaning?: string | null
          id?: string
          language_id?: string
          literal_meaning?: string | null
          text?: string
          updated_at?: string | null
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idioms_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_members: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_institution"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_members_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string | null
          code: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          native_name: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          native_name?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          native_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_goals: {
        Row: {
          completion_date: string | null
          created_at: string | null
          end_date: string | null
          goal_type: string
          id: string
          is_completed: boolean | null
          start_date: string
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          end_date?: string | null
          goal_type: string
          id?: string
          is_completed?: boolean | null
          start_date: string
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          end_date?: string | null
          goal_type?: string
          id?: string
          is_completed?: boolean | null
          start_date?: string
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          end_time: string | null
          exercises_completed: number | null
          id: string
          session_duration: number | null
          session_goals: Json | null
          start_time: string
          user_id: string
          words_studied: number | null
          wrong_answers: number | null
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          end_time?: string | null
          exercises_completed?: number | null
          id?: string
          session_duration?: number | null
          session_goals?: Json | null
          start_time?: string
          user_id: string
          words_studied?: number | null
          wrong_answers?: number | null
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          end_time?: string | null
          exercises_completed?: number | null
          id?: string
          session_duration?: number | null
          session_goals?: Json | null
          start_time?: string
          user_id?: string
          words_studied?: number | null
          wrong_answers?: number | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration: number | null
          file_name: string
          file_size: number | null
          file_type: string
          height: number | null
          id: string
          mime_type: string | null
          storage_path: string
          updated_at: string | null
          width: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          file_name: string
          file_size?: number | null
          file_type: string
          height?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      media_relations: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          media_id: string
          related_id: string
          related_type: string
          relation_type: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_id: string
          related_id: string
          related_type: string
          relation_type: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_id?: string
          related_id?: string
          related_type?: string
          relation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_relations_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_goal: number | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          native_language_id: string | null
          native_language_id_temp: number | null
          preferred_cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          target_language_id: string | null
          target_language_id_temp: number | null
          temp_role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_goal?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          native_language_id?: string | null
          native_language_id_temp?: number | null
          preferred_cefr_level?:
            | Database["public"]["Enums"]["cefr_level"]
            | null
          target_language_id?: string | null
          target_language_id_temp?: number | null
          temp_role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_goal?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          native_language_id?: string | null
          native_language_id_temp?: number | null
          preferred_cefr_level?:
            | Database["public"]["Enums"]["cefr_level"]
            | null
          target_language_id?: string | null
          target_language_id_temp?: number | null
          temp_role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      repetition_settings: {
        Row: {
          created_at: string | null
          ease_factor: number | null
          id: string
          max_interval: number
          min_interval: number
          proficiency_level: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          max_interval: number
          min_interval: number
          proficiency_level: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          max_interval?: number
          min_interval?: number
          proficiency_level?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sentence_words: {
        Row: {
          created_at: string | null
          id: string
          position: number
          sentence_id: string
          word_meaning_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position: number
          sentence_id: string
          word_meaning_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number
          sentence_id?: string
          word_meaning_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentence_words_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "sentences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentence_words_word_meaning_id_fkey"
            columns: ["word_meaning_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["meaning_id"]
          },
          {
            foreignKeyName: "sentence_words_word_meaning_id_fkey"
            columns: ["word_meaning_id"]
            isOneToOne: false
            referencedRelation: "word_meanings"
            referencedColumns: ["id"]
          },
        ]
      }
      sentences: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          difficulty_level: number | null
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          id: string
          language_id: string
          original_sentence_id: string | null
          source_text_id: string | null
          text: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: number | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          id?: string
          language_id: string
          original_sentence_id?: string | null
          source_text_id?: string | null
          text: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: number | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          id?: string
          language_id?: string
          original_sentence_id?: string | null
          source_text_id?: string | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentences_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentences_original_sentence_id_fkey"
            columns: ["original_sentence_id"]
            isOneToOne: false
            referencedRelation: "sentences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentences_source_text_id_fkey"
            columns: ["source_text_id"]
            isOneToOne: false
            referencedRelation: "texts"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      taggable_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          tag_id: string
          taggable_id: string
          taggable_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag_id: string
          taggable_id: string
          taggable_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag_id?: string
          taggable_id?: string
          taggable_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "taggable_items_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean
          name: string
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tag_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_import: {
        Row: {
          cefr_level: string | null
          language_id: string | null
          link: string | null
          word: string | null
          word_lists: string | null
          word_type_id: string | null
        }
        Insert: {
          cefr_level?: string | null
          language_id?: string | null
          link?: string | null
          word?: string | null
          word_lists?: string | null
          word_type_id?: string | null
        }
        Update: {
          cefr_level?: string | null
          language_id?: string | null
          link?: string | null
          word?: string | null
          word_lists?: string | null
          word_type_id?: string | null
        }
        Relationships: []
      }
      texts: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          language_id: string
          source_name: string | null
          source_url: string | null
          summary: string | null
          title: string
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          language_id: string
          source_name?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          content?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          language_id?: string
          source_name?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "texts_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          created_at: string | null
          id: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
          is_content_creator: boolean
          role_type: Database["public"]["Enums"]["user_role_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean
          is_content_creator?: boolean
          role_type?: Database["public"]["Enums"]["user_role_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
          is_content_creator?: boolean
          role_type?: Database["public"]["Enums"]["user_role_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          notification_email: boolean | null
          notification_web: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_email?: boolean | null
          notification_web?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_email?: boolean | null
          notification_web?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      word_forms: {
        Row: {
          created_at: string | null
          form_text: string
          form_type: Database["public"]["Enums"]["word_form_type"]
          id: string
          is_irregular: boolean | null
          notes: string | null
          updated_at: string | null
          word_id: string
        }
        Insert: {
          created_at?: string | null
          form_text: string
          form_type: Database["public"]["Enums"]["word_form_type"]
          id?: string
          is_irregular?: boolean | null
          notes?: string | null
          updated_at?: string | null
          word_id: string
        }
        Update: {
          created_at?: string | null
          form_text?: string
          form_type?: Database["public"]["Enums"]["word_form_type"]
          id?: string
          is_irregular?: boolean | null
          notes?: string | null
          updated_at?: string | null
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_forms_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "word_forms_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "v_word_list"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "word_forms_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      word_learning_status: {
        Row: {
          created_at: string | null
          id: string
          last_seen_at: string | null
          learning_context: Json | null
          next_review_at: string | null
          notes: string | null
          proficiency_level: number | null
          status:
            | Database["public"]["Enums"]["word_learning_status_type"]
            | null
          times_correct: number | null
          times_encountered: number | null
          times_wrong: number | null
          updated_at: string | null
          user_id: string
          word_meaning_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          learning_context?: Json | null
          next_review_at?: string | null
          notes?: string | null
          proficiency_level?: number | null
          status?:
            | Database["public"]["Enums"]["word_learning_status_type"]
            | null
          times_correct?: number | null
          times_encountered?: number | null
          times_wrong?: number | null
          updated_at?: string | null
          user_id: string
          word_meaning_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          learning_context?: Json | null
          next_review_at?: string | null
          notes?: string | null
          proficiency_level?: number | null
          status?:
            | Database["public"]["Enums"]["word_learning_status_type"]
            | null
          times_correct?: number | null
          times_encountered?: number | null
          times_wrong?: number | null
          updated_at?: string | null
          user_id?: string
          word_meaning_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_learning_status_word_meaning_id_fkey"
            columns: ["word_meaning_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["meaning_id"]
          },
          {
            foreignKeyName: "word_learning_status_word_meaning_id_fkey"
            columns: ["word_meaning_id"]
            isOneToOne: false
            referencedRelation: "word_meanings"
            referencedColumns: ["id"]
          },
        ]
      }
      word_meaning_definitions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string
          created_at: string | null
          created_by: string | null
          cultural_notes: string | null
          definition_type: Database["public"]["Enums"]["definition_type"]
          grammar_notes: string | null
          id: string
          language_id: string
          meaning_id: string
          updated_at: string | null
          usage_notes: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          cultural_notes?: string | null
          definition_type: Database["public"]["Enums"]["definition_type"]
          grammar_notes?: string | null
          id?: string
          language_id: string
          meaning_id: string
          updated_at?: string | null
          usage_notes?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          cultural_notes?: string | null
          definition_type?: Database["public"]["Enums"]["definition_type"]
          grammar_notes?: string | null
          id?: string
          language_id?: string
          meaning_id?: string
          updated_at?: string | null
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "word_meaning_definitions_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "word_meaning_definitions_meaning_id_fkey"
            columns: ["meaning_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["meaning_id"]
          },
          {
            foreignKeyName: "word_meaning_definitions_meaning_id_fkey"
            columns: ["meaning_id"]
            isOneToOne: false
            referencedRelation: "word_meanings"
            referencedColumns: ["id"]
          },
        ]
      }
      word_meanings: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          collocations: Json | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          domain: string[] | null
          etymology: string | null
          id: string
          is_active: boolean | null
          notes: Json | null
          register_type: Database["public"]["Enums"]["register_type"] | null
          updated_at: string | null
          usage_examples: Json | null
          usage_frequency: number | null
          word_id: string
          word_lists: Database["public"]["Enums"]["word_list_type"][] | null
          word_type_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          collocations?: Json | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          domain?: string[] | null
          etymology?: string | null
          id?: string
          is_active?: boolean | null
          notes?: Json | null
          register_type?: Database["public"]["Enums"]["register_type"] | null
          updated_at?: string | null
          usage_examples?: Json | null
          usage_frequency?: number | null
          word_id: string
          word_lists?: Database["public"]["Enums"]["word_list_type"][] | null
          word_type_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
          collocations?: Json | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          domain?: string[] | null
          etymology?: string | null
          id?: string
          is_active?: boolean | null
          notes?: Json | null
          register_type?: Database["public"]["Enums"]["register_type"] | null
          updated_at?: string | null
          usage_examples?: Json | null
          usage_frequency?: number | null
          word_id?: string
          word_lists?: Database["public"]["Enums"]["word_list_type"][] | null
          word_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_meanings_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "word_meanings_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "v_word_list"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "word_meanings_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "word_meanings_word_type_id_fkey"
            columns: ["word_type_id"]
            isOneToOne: false
            referencedRelation: "word_types"
            referencedColumns: ["id"]
          },
        ]
      }
      word_relations: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          relation_type: string
          source_meaning_id: string
          target_meaning_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          relation_type: string
          source_meaning_id: string
          target_meaning_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          relation_type?: string
          source_meaning_id?: string
          target_meaning_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_relations_source_meaning_id_fkey"
            columns: ["source_meaning_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["meaning_id"]
          },
          {
            foreignKeyName: "word_relations_source_meaning_id_fkey"
            columns: ["source_meaning_id"]
            isOneToOne: false
            referencedRelation: "word_meanings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "word_relations_target_meaning_id_fkey"
            columns: ["target_meaning_id"]
            isOneToOne: false
            referencedRelation: "v_word_base_detail"
            referencedColumns: ["meaning_id"]
          },
          {
            foreignKeyName: "word_relations_target_meaning_id_fkey"
            columns: ["target_meaning_id"]
            isOneToOne: false
            referencedRelation: "word_meanings"
            referencedColumns: ["id"]
          },
        ]
      }
      word_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      words: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          is_active: boolean | null
          is_public: boolean
          language_id: string
          slug: string | null
          updated_at: string | null
          updated_by: string | null
          word: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean
          language_id: string
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
          word: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean
          language_id?: string
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "words_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_word_base_detail: {
        Row: {
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          created_at: string | null
          definition_en: string | null
          definition_tr: string | null
          deleted_at: string | null
          is_active: boolean | null
          is_public: boolean | null
          meaning_id: string | null
          updated_at: string | null
          word: string | null
          word_id: string | null
          word_type_id: string | null
          word_type_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "word_meanings_word_type_id_fkey"
            columns: ["word_type_id"]
            isOneToOne: false
            referencedRelation: "word_types"
            referencedColumns: ["id"]
          },
        ]
      }
      v_word_list: {
        Row: {
          cefr_level: Database["public"]["Enums"]["cefr_level"] | null
          created_at: string | null
          definition_en: string | null
          definition_tr: string | null
          is_active: boolean | null
          is_public: boolean | null
          updated_at: string | null
          word: string | null
          word_id: string | null
          word_type_id: string | null
          word_type_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "word_meanings_word_type_id_fkey"
            columns: ["word_type_id"]
            isOneToOne: false
            referencedRelation: "word_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_exercise: {
        Args: {
          p_exercise_id: string
          p_approved_by: string
        }
        Returns: undefined
      }
      check_user_role: {
        Args: {
          check_user_id: string
          required_role: Database["public"]["Enums"]["user_role_type"]
        }
        Returns: boolean
      }
      generate_exercise_content: {
        Args: {
          p_template_id: string
          p_word_ids: string[]
          p_difficulty_level: number
          p_cefr_level: Database["public"]["Enums"]["cefr_level"]
        }
        Returns: Json
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      is_admin: {
        Args: {
          check_user_id: string
        }
        Returns: boolean
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      slugify: {
        Args: {
          "": string
        }
        Returns: string
      }
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NONE"
      content_type: "article" | "story" | "exercise" | "quiz" | "vocabulary"
      definition_type: "basic" | "detailed" | "academic" | "translation"
      exercise_template_category:
        | "matching"
        | "selection"
        | "word_finding"
        | "fill_blank"
        | "writing"
      exercise_template_subcategory:
        | "tr_en_match"
        | "synonym_match"
        | "antonym_match"
        | "en_def_select"
        | "tr_def_select"
        | "listen_select"
        | "tr_def_find"
        | "synonym_find"
        | "antonym_find"
        | "multiple_choice_fill"
        | "listen_fill"
        | "listen_write"
        | "word_write"
      external_source_type:
        | "oxford"
        | "cambridge"
        | "collins"
        | "merriam_webster"
        | "longman"
      register_type:
        | "formal"
        | "informal"
        | "slang"
        | "vulgar"
        | "archaic"
        | "technical"
      sync_status_type: "pending" | "success" | "failed" | "in_progress"
      user_role: "student" | "teacher" | "admin"
      user_role_type:
        | "admin"
        | "moderator"
        | "content_creator"
        | "premium_user"
        | "basic_user"
      word_form_type:
        | "base"
        | "singular"
        | "plural"
        | "past_simple"
        | "past_participle"
        | "present_participle"
        | "comparative"
        | "superlative"
      word_learning_status_type: "unlearned" | "learning" | "learned" | "review"
      word_list_type:
        | "oxford_3000"
        | "oxford_5000"
        | "academic_word_list"
        | "toefl_essential"
        | "ielts_essential"
        | "business_english"
      word_relation_type:
        | "synonym"
        | "antonym"
        | "hypernym"
        | "hyponym"
        | "holonym"
        | "meronym"
        | "derivative"
        | "root"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
