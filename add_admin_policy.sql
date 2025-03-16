-- Add admin policy to allow ykxglobal@gmail.com to view all appointments
CREATE POLICY "Admin can view all appointments"
ON appointments FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE email = 'ykxglobal@gmail.com'
));

-- Admin can update any appointment
CREATE POLICY "Admin can update any appointment"
ON appointments FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE email = 'ykxglobal@gmail.com'
));

-- Admin can delete any appointment
CREATE POLICY "Admin can delete any appointment"
ON appointments FOR DELETE
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE email = 'ykxglobal@gmail.com'
));