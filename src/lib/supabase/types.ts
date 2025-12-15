export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string
          tweet_id: string
          tweet_text: string
          tweet_url: string
          author_username: string
          author_display_name: string
          author_profile_image_url: string | null
          media_urls: Json | null
          retweet_count: number | null
          like_count: number | null
          bookmarked_at: string
          imported_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tweet_id: string
          tweet_text: string
          tweet_url: string
          author_username: string
          author_display_name: string
          author_profile_image_url?: string | null
          media_urls?: Json | null
          retweet_count?: number | null
          like_count?: number | null
          bookmarked_at: string
          imported_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tweet_id?: string
          tweet_text?: string
          tweet_url?: string
          author_username?: string
          author_display_name?: string
          author_profile_image_url?: string | null
          media_urls?: Json | null
          retweet_count?: number | null
          like_count?: number | null
          bookmarked_at?: string
          imported_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookmark_categories: {
        Row: {
          bookmark_id: string
          category_id: string
        }
        Insert: {
          bookmark_id: string
          category_id: string
        }
        Update: {
          bookmark_id?: string
          category_id?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      bookmark_tags: {
        Row: {
          bookmark_id: string
          tag_id: string
        }
        Insert: {
          bookmark_id: string
          tag_id: string
        }
        Update: {
          bookmark_id?: string
          tag_id?: string
        }
      }
      search_history: {
        Row: {
          id: string
          query: string
          filters: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          query: string
          filters?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          query?: string
          filters?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

