DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = 'manager@gmail.com'
  ) THEN
    UPDATE public.profiles
    SET role = 'manager'
    WHERE user_id = (
      SELECT id FROM auth.users
      WHERE email = 'manager@gmail.com'
      LIMIT 1
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
