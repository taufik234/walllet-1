-- Function to allow a user to delete their own account
-- Run this in the Supabase SQL Editor

create or replace function delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Delete the user from auth.users table
  delete from auth.users where id = auth.uid();
end;
$$;

-- Grant functionality to authenticated users (logged in users)
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user() TO service_role;

-- IMPORTANT: After running this, go to Project Settings > API > Refresh Schema Cache
-- in the Supabase Dashboard if the function is still not found.
