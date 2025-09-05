// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Tipos TypeScript para la base de datos
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string | null;
          currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string | null;
          currency?: string | null;
        };
        Update: {
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string | null;
          currency?: string | null;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name?: string;
          description?: string | null;
          is_default?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_default?: boolean;
        };
      };
      holdings: {
        Row: {
          id: string;
          portfolio_id: string;
          symbol: string;
          name: string;
          amount: string;
          average_price: string;
          purchase_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          portfolio_id: string;
          symbol: string;
          name: string;
          amount: string;
          average_price: string;
          purchase_date: string;
          notes?: string | null;
        };
        Update: {
          symbol?: string;
          name?: string;
          amount?: string;
          average_price?: string;
          purchase_date?: string;
          notes?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          portfolio_id: string;
          type: "buy" | "sell";
          symbol: string;
          amount: string;
          price: string;
          fees: string;
          exchange: string | null;
          transaction_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          portfolio_id: string;
          type: "buy" | "sell";
          symbol: string;
          amount: string;
          price: string;
          fees?: string;
          exchange?: string | null;
          transaction_date: string;
          notes?: string | null;
        };
      };
      price_alerts: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          name: string;
          type: "above" | "below";
          target_price: string;
          status: "active" | "triggered" | "dismissed";
          created_at: string;
          triggered_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          symbol: string;
          name: string;
          type: "above" | "below";
          target_price: string;
          status?: "active" | "triggered" | "dismissed";
        };
        Update: {
          status?: "active" | "triggered" | "dismissed";
          triggered_at?: string | null;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: "dark" | "light";
          default_currency: string;
          price_change_notifications: boolean;
          alert_notifications: boolean;
          email_notifications: boolean;
          sound_notifications: boolean;
          auto_refresh_interval: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: "dark" | "light";
          default_currency?: string;
          price_change_notifications?: boolean;
          alert_notifications?: boolean;
          email_notifications?: boolean;
          sound_notifications?: boolean;
          auto_refresh_interval?: number;
        };
        Update: {
          theme?: "dark" | "light";
          default_currency?: string;
          price_change_notifications?: boolean;
          alert_notifications?: boolean;
          email_notifications?: boolean;
          sound_notifications?: boolean;
          auto_refresh_interval?: number;
        };
      };
    };
  };
}
