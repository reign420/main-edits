-- Complete Client Form Schema Migration
-- This migration ensures the database schema perfectly matches the ClientForm.tsx component
-- It handles all form fields including birthdate/age logic and spouse information

-- First, ensure the clients table exists (in case previous migrations weren't applied)
CREATE TABLE IF NOT EXISTS public.clients (
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
  age integer CHECK (age >= 18 AND age <= 85),
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
  notes text DEFAULT '',
  
  -- Birthdate fields (will be added below if not exists)
  birthdate date,
  spouse_birthdate date
);

-- Add any missing columns to the clients table (in case table already exists)
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS spouse_birthdate date;

-- Update the age column to be nullable since it can be calculated from birthdate
ALTER TABLE public.clients 
ALTER COLUMN age DROP NOT NULL;

-- Update spouse_age column to be nullable since it can be calculated from spouse_birthdate  
ALTER TABLE public.clients 
ALTER COLUMN spouse_age DROP NOT NULL;

-- Enable RLS on clients table (in case it wasn't enabled)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (in case they don't exist)
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can insert client data" ON public.clients;
  DROP POLICY IF EXISTS "Authenticated users can view all client data" ON public.clients;
  DROP POLICY IF EXISTS "Authenticated users can update client data" ON public.clients;
  DROP POLICY IF EXISTS "Authenticated users can delete client data" ON public.clients;
  
  -- Create RLS policies
  CREATE POLICY "Anyone can insert client data"
    ON public.clients
    FOR INSERT
    TO anon
    WITH CHECK (true);

  CREATE POLICY "Authenticated users can view all client data"
    ON public.clients
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Authenticated users can update client data"
    ON public.clients
    FOR UPDATE
    TO authenticated
    USING (true);

  CREATE POLICY "Authenticated users can delete client data"
    ON public.clients
    FOR DELETE
    TO authenticated
    USING (true);
END $$;

-- Create or replace the age calculation function
CREATE OR REPLACE FUNCTION public.calculate_age_from_birthdate(birth_date date)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN EXTRACT(YEAR FROM age(current_date, birth_date));
END;
$$;

-- Create or replace the trigger function to automatically set age when birthdate is provided
CREATE OR REPLACE FUNCTION public.set_age_from_birthdate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set client age from birthdate if birthdate is provided
  IF NEW.birthdate IS NOT NULL THEN
    NEW.age := public.calculate_age_from_birthdate(NEW.birthdate);
  END IF;
  
  -- Set spouse age from spouse_birthdate if spouse_birthdate is provided
  IF NEW.spouse_birthdate IS NOT NULL THEN
    NEW.spouse_age := public.calculate_age_from_birthdate(NEW.spouse_birthdate);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS trigger_set_age_from_birthdate ON public.clients;

-- Create trigger to automatically calculate ages
CREATE TRIGGER trigger_set_age_from_birthdate
  BEFORE INSERT OR UPDATE OF birthdate, spouse_birthdate ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_age_from_birthdate();

-- Add check constraints to ensure data integrity
-- These constraints match the validation logic in the ClientForm component

-- Ensure age is between 18-85 when provided
ALTER TABLE public.clients 
DROP CONSTRAINT IF EXISTS clients_age_check;

ALTER TABLE public.clients 
ADD CONSTRAINT clients_age_check 
CHECK (age IS NULL OR (age >= 18 AND age <= 85));

-- Ensure spouse_age is between 18-85 when provided
ALTER TABLE public.clients 
DROP CONSTRAINT IF EXISTS clients_spouse_age_check;

ALTER TABLE public.clients 
ADD CONSTRAINT clients_spouse_age_check 
CHECK (spouse_age IS NULL OR (spouse_age >= 18 AND spouse_age <= 85));

-- Ensure desired_coverage_amount is within valid range
ALTER TABLE public.clients 
DROP CONSTRAINT IF EXISTS clients_desired_coverage_amount_check;

ALTER TABLE public.clients 
ADD CONSTRAINT clients_desired_coverage_amount_check 
CHECK (desired_coverage_amount > 0 AND desired_coverage_amount <= 1000000);

-- Add validation function to ensure either age or birthdate is provided for primary client
CREATE OR REPLACE FUNCTION public.validate_client_age_or_birthdate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- For primary client: either age or birthdate must be provided
  IF NEW.age IS NULL AND NEW.birthdate IS NULL THEN
    RAISE EXCEPTION 'Either age or birthdate must be provided for the primary client';
  END IF;
  
  -- If both are provided, age should match calculated age from birthdate
  IF NEW.age IS NOT NULL AND NEW.birthdate IS NOT NULL THEN
    IF NEW.age != public.calculate_age_from_birthdate(NEW.birthdate) THEN
      RAISE EXCEPTION 'Provided age does not match calculated age from birthdate';
    END IF;
  END IF;
  
  -- For spouse (if married): either spouse_age or spouse_birthdate must be provided
  IF NEW.marital_status = 'married' THEN
    IF NEW.spouse_age IS NULL AND NEW.spouse_birthdate IS NULL THEN
      RAISE EXCEPTION 'Either spouse age or spouse birthdate must be provided when marital status is married';
    END IF;
    
    -- If both spouse fields are provided, they should match
    IF NEW.spouse_age IS NOT NULL AND NEW.spouse_birthdate IS NOT NULL THEN
      IF NEW.spouse_age != public.calculate_age_from_birthdate(NEW.spouse_birthdate) THEN
        RAISE EXCEPTION 'Provided spouse age does not match calculated age from spouse birthdate';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate age/birthdate logic
DROP TRIGGER IF EXISTS trigger_validate_age_or_birthdate ON public.clients;

CREATE TRIGGER trigger_validate_age_or_birthdate
  BEFORE INSERT OR UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_client_age_or_birthdate();

-- Create a view for easy querying of client data with calculated ages
CREATE OR REPLACE VIEW public.clients_with_calculated_ages AS
SELECT 
  *,
  CASE 
    WHEN birthdate IS NOT NULL THEN public.calculate_age_from_birthdate(birthdate)
    ELSE age
  END AS calculated_age,
  CASE 
    WHEN spouse_birthdate IS NOT NULL THEN public.calculate_age_from_birthdate(spouse_birthdate)
    ELSE spouse_age
  END AS calculated_spouse_age
FROM public.clients;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.clients_with_calculated_ages TO authenticated;

-- Create indexes for better performance on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_birthdate ON clients(birthdate);
CREATE INDEX IF NOT EXISTS idx_clients_spouse_birthdate ON clients(spouse_birthdate);
CREATE INDEX IF NOT EXISTS idx_clients_marital_status ON clients(marital_status);
CREATE INDEX IF NOT EXISTS idx_clients_desired_coverage ON clients(desired_coverage_amount);

-- Create a function to insert client data that matches the form submission logic
CREATE OR REPLACE FUNCTION public.insert_client_from_form(
  p_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_state text,
  p_zip_code text,
  p_gender text,
  p_height text,
  p_weight text,
  p_smoking_status text,
  p_occupation text,
  p_marital_status text,
  p_desired_coverage_amount integer,
  p_medical_issues text DEFAULT '',
  p_medications text DEFAULT '',
  p_birthdate date DEFAULT NULL,
  p_age integer DEFAULT NULL,
  p_spouse_name text DEFAULT NULL,
  p_spouse_email text DEFAULT NULL,
  p_spouse_phone text DEFAULT NULL,
  p_spouse_gender text DEFAULT NULL,
  p_spouse_height text DEFAULT NULL,
  p_spouse_weight text DEFAULT NULL,
  p_spouse_smoking_status text DEFAULT NULL,
  p_spouse_medical_issues text DEFAULT '',
  p_spouse_medications text DEFAULT '',
  p_spouse_birthdate date DEFAULT NULL,
  p_spouse_age integer DEFAULT NULL,
  p_spouse_occupation text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  client_id uuid;
BEGIN
  -- Insert the client data
  INSERT INTO public.clients (
    name, email, phone, address, city, state, zip_code,
    gender, height, weight, smoking_status, occupation, marital_status,
    desired_coverage_amount, medical_issues, medications,
    birthdate, age, spouse_name, spouse_email, spouse_phone, spouse_gender,
    spouse_height, spouse_weight, spouse_smoking_status,
    spouse_medical_issues, spouse_medications,
    spouse_birthdate, spouse_age, spouse_occupation
  ) VALUES (
    p_name, p_email, p_phone, p_address, p_city, p_state, p_zip_code,
    p_gender, p_height, p_weight, p_smoking_status, p_occupation, p_marital_status,
    p_desired_coverage_amount, p_medical_issues, p_medications,
    p_birthdate, p_age, p_spouse_name, p_spouse_email, p_spouse_phone, p_spouse_gender,
    p_spouse_height, p_spouse_weight, p_spouse_smoking_status,
    p_spouse_medical_issues, p_spouse_medications,
    p_spouse_birthdate, p_spouse_age, p_spouse_occupation
  ) RETURNING id INTO client_id;
  
  RETURN client_id;
END;
$$;

-- Grant execute permission on the function to anonymous users (for form submissions)
GRANT EXECUTE ON FUNCTION public.insert_client_from_form TO anon;
GRANT EXECUTE ON FUNCTION public.insert_client_from_form TO authenticated;

-- Create a function to get client statistics for dashboard
CREATE OR REPLACE FUNCTION public.get_client_stats()
RETURNS TABLE (
  total_clients bigint,
  new_clients bigint,
  contacted_clients bigint,
  qualified_clients bigint,
  total_coverage_requested numeric,
  avg_coverage_requested numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_clients,
    COUNT(*) FILTER (WHERE status = 'new') as new_clients,
    COUNT(*) FILTER (WHERE status = 'contacted') as contacted_clients,
    COUNT(*) FILTER (WHERE status = 'qualified') as qualified_clients,
    COALESCE(SUM(desired_coverage_amount), 0) as total_coverage_requested,
    COALESCE(AVG(desired_coverage_amount), 0) as avg_coverage_requested
  FROM public.clients;
END;
$$;

-- Grant execute permission on the stats function
GRANT EXECUTE ON FUNCTION public.get_client_stats TO authenticated;

-- Verify the migration was successful
DO $$
BEGIN
  -- Check if all required columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' 
    AND column_name = 'birthdate'
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'Failed to add birthdate column';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' 
    AND column_name = 'spouse_birthdate'
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'Failed to add spouse_birthdate column';
  END IF;
  
  -- Check if functions exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'calculate_age_from_birthdate'
    AND routine_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'Failed to create calculate_age_from_birthdate function';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'insert_client_from_form'
    AND routine_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'Failed to create insert_client_from_form function';
  END IF;
  
  RAISE NOTICE 'Client form schema migration completed successfully!';
  RAISE NOTICE 'All form fields are now properly mapped to the database schema.';
  RAISE NOTICE 'Birthdate/age logic is implemented with automatic calculations.';
  RAISE NOTICE 'Form submission function is available for use.';
END $$;
