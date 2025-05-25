
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          category: string;
          description: string | null;
          due_date: string | null;
          progress: number;
          total_tasks: number;
          completed_tasks: number;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          description?: string | null;
          due_date?: string | null;
          progress?: number;
          total_tasks?: number;
          completed_tasks?: number;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          description?: string | null;
          due_date?: string | null;
          progress?: number;
          total_tasks?: number;
          completed_tasks?: number;
          user_id?: string;
          created_at?: string;
        };
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          completed: boolean;
          due_date: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          completed?: boolean;
          due_date?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          completed?: boolean;
          due_date?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
      shopify_data: {
        Row: {
          id: string;
          user_id: string;
          shop_url: string;
          access_token: string;
          last_sync: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_url: string;
          access_token: string;
          last_sync?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_url?: string;
          access_token?: string;
          last_sync?: string | null;
          created_at?: string;
        };
      };
      shopify_sales: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          sales: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          sales: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          sales?: number;
          created_at?: string;
        };
      };
      shopify_products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          value?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
