-- Create a function to update appointment status (admin only)
CREATE OR REPLACE FUNCTION update_appointment_status(appointment_id uuid, new_status text)
RETURNS void AS $$
BEGIN
  -- This function bypasses date validation by directly updating only the status field
  -- It should be called only by the admin account
  
  -- Verify the user is admin (additional security)
  IF auth.email() <> 'ykxglobal@gmail.com' THEN
    RAISE EXCEPTION 'Only admin can update appointment status';
  END IF;
  
  -- Update only the status field
  UPDATE appointments
  SET status = new_status::text
  WHERE id = appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set RLS policy to restrict this function to admin only
REVOKE ALL ON FUNCTION update_appointment_status FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_appointment_status TO authenticated;

COMMENT ON FUNCTION update_appointment_status IS 'Admin-only function to update appointment status without date validation';