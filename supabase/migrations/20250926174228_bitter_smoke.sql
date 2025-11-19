/*
  # Life Insurance Business Database Schema

  1. New Tables
    - `clients`
      - Client personal information, medical details, and coverage preferences
      - Spouse information when married
      - Contact details and preferences
    - `job_applicants` 
      - Applicant personal information
      - Resume file path and licensing status
      - Application timestamp and status
    - `users` (extends Supabase auth.users)
      - Admin user management
      - Role-based access control

  2. Security
    - Enable RLS on all tables
    - Admin-only access to client and applicant data
    - Public insert access for form submissions
    - Secure file upload policies

  3. Indexes
    - Search optimization for names, emails, and dates
    - Performance indexes for dashboard queries
*/

-- Create clients table for life insurance leads
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  
  -- Primary client information
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height text NOT NULL,
  weight text NOT NULL,
  smoking_status text NOT NULL CHECK (smoking_status IN ('never', 'former', 'current')),
  medical_issues text DEFAULT '',
  medications text DEFAULT '',
  age integer NOT NULL CHECK (age >= 18 AND age <= 85),
  occupation text NOT NULL,
  marital_status text NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  
  -- Spouse information (when married)
  spouse_name text,
  spouse_email text,
  spouse_phone text,
  spouse_gender text CHECK (spouse_gender IN ('male', 'female', 'other')),
  spouse_height text,
  spouse_weight text,
  spouse_smoking_status text CHECK (spouse_smoking_status IN ('never', 'former', 'current')),
  spouse_medical_issues text DEFAULT '',
  spouse_medications text DEFAULT '',
  spouse_age integer CHECK (spouse_age >= 18 AND spouse_age <= 85),
  spouse_occupation text,
  
  -- Coverage details
  desired_coverage_amount integer NOT NULL CHECK (desired_coverage_amount <= 1000000),
  
  -- Status tracking
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'rejected')),
  notes text DEFAULT ''
);

-- Create job_applicants table
CREATE TABLE IF NOT EXISTS job_applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  resume_file_path text,
  is_licensed boolean DEFAULT false,
  
  -- Status tracking
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interview', 'hired', 'rejected')),
  notes text DEFAULT ''
);

-- Create admin users profile table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin'))
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Anyone can insert client data"
  ON clients
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all client data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update client data"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete client data"
  ON clients
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for job_applicants table
CREATE POLICY "Anyone can insert job applications"
  ON job_applicants
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all job applications"
  ON job_applicants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update job applications"
  ON job_applicants
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete job applications"
  ON job_applicants
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

CREATE INDEX IF NOT EXISTS idx_job_applicants_created_at ON job_applicants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applicants_email ON job_applicants(email);
CREATE INDEX IF NOT EXISTS idx_job_applicants_name ON job_applicants(full_name);
CREATE INDEX IF NOT EXISTS idx_job_applicants_status ON job_applicants(status);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes bucket
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can view resumes"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resumes"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');