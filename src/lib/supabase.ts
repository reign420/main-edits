import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          gender: 'male' | 'female' | 'other';
          height: string;
          weight: string;
          smoking_status: 'never' | 'former' | 'current';
          medical_issues: string;
          medications: string;
          birthdate?: string | null;
          age: number;
          occupation: string;
          marital_status: 'single' | 'married' | 'divorced' | 'widowed';
          spouse_name?: string;
          spouse_email?: string;
          spouse_phone?: string;
          spouse_gender?: 'male' | 'female' | 'other';
          spouse_height?: string;
          spouse_weight?: string;
          spouse_smoking_status?: 'never' | 'former' | 'current';
          spouse_medical_issues?: string;
          spouse_medications?: string;
          spouse_birthdate?: string | null;
          spouse_age?: number;
          spouse_occupation?: string;
          desired_coverage_amount: number;
          status: 'new' | 'contacted' | 'qualified' | 'closed' | 'rejected';
          notes: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      job_applicants: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          phone_number: string;
          email: string;
          resume_file_path?: string;
          is_licensed: boolean;
          status: 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected';
          notes: string;
        };
        Insert: Omit<Database['public']['Tables']['job_applicants']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['job_applicants']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name?: string;
          role: 'admin' | 'super_admin';
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
    };
  };
};