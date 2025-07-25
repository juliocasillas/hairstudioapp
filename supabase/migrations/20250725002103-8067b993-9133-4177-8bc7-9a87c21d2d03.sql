-- Security Fix Migration: Address Critical Vulnerabilities
-- Fix 1: Create security definer function to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Fix 2: Create role validation function
CREATE OR REPLACE FUNCTION public.is_valid_role(role_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN role_input IN ('client', 'stylist', 'admin', 'receptionist', 'developer');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fix 3: Add role validation trigger
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent role changes for non-admin users
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    -- Only admins and developers can change roles
    IF NOT (public.get_current_user_role() IN ('admin', 'developer')) THEN
      RAISE EXCEPTION 'Only administrators can modify user roles';
    END IF;
  END IF;
  
  -- Validate role is in allowed enum values
  IF NOT public.is_valid_role(NEW.role::text) THEN
    RAISE EXCEPTION 'Invalid role: %', NEW.role;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add the validation trigger
DROP TRIGGER IF EXISTS validate_profile_role ON public.profiles;
CREATE TRIGGER validate_profile_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_role_assignment();

-- Fix 4: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Fix 5: Create secure, non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their profile but NOT their role
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND (OLD.role IS NOT DISTINCT FROM NEW.role OR public.get_current_user_role() IN ('admin', 'developer'))
);

-- Admins can view all profiles (using security definer function)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'developer'));

-- Admins can update all profiles (using security definer function)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.get_current_user_role() IN ('admin', 'developer'));

-- Fix 6: Create audit log table for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  changed_user_id UUID NOT NULL,
  old_role user_role,
  new_role user_role NOT NULL,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reason TEXT
);

-- Enable RLS on audit table
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view role audit logs" 
ON public.role_change_audit 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'developer'));

-- Create audit trigger for role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.role_change_audit (
      changed_user_id, 
      old_role, 
      new_role, 
      changed_by
    ) VALUES (
      NEW.user_id,
      OLD.role,
      NEW.role,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_profile_role_changes ON public.profiles;
CREATE TRIGGER audit_profile_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();