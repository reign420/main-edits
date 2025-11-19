-- Migration to add birthdate fields to existing clients table
-- This migration adds birthdate functionality to work with the updated ClientForm

-- Add birthdate columns to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS spouse_birthdate date;

-- Create function to calculate age from birthdate
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

-- Create trigger function to automatically set age when birthdate is provided
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_set_age_from_birthdate ON public.clients;

-- Create trigger to automatically calculate ages
CREATE TRIGGER trigger_set_age_from_birthdate
  BEFORE INSERT OR UPDATE OF birthdate, spouse_birthdate ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_age_from_birthdate();

-- Update RLS policies to ensure birthdate fields are accessible
-- (The existing policies should already cover this, but let's make sure)

-- Verify the columns were added successfully
DO $$
BEGIN
  -- Check if birthdate column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' 
    AND column_name = 'birthdate'
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'Failed to add birthdate column';
  END IF;
  
  -- Check if spouse_birthdate column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' 
    AND column_name = 'spouse_birthdate'
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'Failed to add spouse_birthdate column';
  END IF;
  
  RAISE NOTICE 'Successfully added birthdate and spouse_birthdate columns to clients table';
END $$;
