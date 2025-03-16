-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;
DROP POLICY IF EXISTS "Admin can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Admin can update any appointment" ON appointments;
DROP POLICY IF EXISTS "Admin can delete any appointment" ON appointments;
DROP POLICY IF EXISTS "Admin can create any appointment" ON appointments;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.appointments;
DROP POLICY IF EXISTS "Enable update for admin only" ON public.appointments;

-- Re-create more permissive user policies
CREATE POLICY "Users can create their own appointments"
ON appointments FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own appointments"
ON appointments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
ON appointments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
ON appointments FOR DELETE
USING (auth.uid() = user_id);

-- Create admin policies with clear email specification
CREATE POLICY "Admin can view all appointments"
ON appointments FOR SELECT
USING (
  auth.email() = 'ykxglobal@gmail.com'
);

CREATE POLICY "Admin can update any appointment"
ON appointments FOR UPDATE
USING (
  auth.email() = 'ykxglobal@gmail.com'
);

CREATE POLICY "Admin can delete any appointment"
ON appointments FOR DELETE
USING (
  auth.email() = 'ykxglobal@gmail.com'
);

-- Create policy for admin appointment creation
CREATE POLICY "Admin can create any appointment"
ON appointments FOR INSERT
WITH CHECK (
  auth.email() = 'ykxglobal@gmail.com'
);

-- Create new policies
CREATE POLICY "Enable read access for all users" 
ON public.appointments FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.appointments FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Admin-only update policy with email check
CREATE POLICY "Enable update for admin only" 
ON public.appointments FOR UPDATE 
TO authenticated 
USING (auth.email() = 'ykxglobal@gmail.com')
WITH CHECK (auth.email() = 'ykxglobal@gmail.com');

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;