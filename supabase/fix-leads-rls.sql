-- META Pictures — public inquiry INSERT policies
-- Run in Supabase → SQL Editor if Start a Project / Book Consultation fail to save.
--
-- Anon and authenticated users may INSERT leads & consultations.
-- They must NOT SELECT them (staff-only). The app therefore inserts
-- without RETURNING (Prefer: return=minimal).

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT INSERT ON public.consultations TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can create a lead" ON public.leads;
CREATE POLICY "Anyone can create a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create a consultation" ON public.consultations;
CREATE POLICY "Anyone can create a consultation"
  ON public.consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
