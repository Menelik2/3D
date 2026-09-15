-- Run in Supabase SQL Editor (optional but recommended)
-- Enables admin toggle for customer self-upload on private galleries.

ALTER TABLE client_galleries
  ADD COLUMN IF NOT EXISTS allow_client_upload BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN client_galleries.allow_client_upload IS
  'When true, anyone with the private /g/[token] link can upload photos.';
