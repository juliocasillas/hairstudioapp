-- Fix search path security warnings
-- Update all functions to set secure search_path

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_valid_role(role_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN role_input IN ('client', 'stylist', 'admin', 'receptionist', 'developer');
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = '';

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';