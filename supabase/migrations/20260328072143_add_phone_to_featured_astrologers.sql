/*
  # Add Phone Number to Featured Astrologers

  1. Changes
    - Add phone column to featured_astrologers table
    - Update Harish Purohit's phone number

  2. Notes
    - Phone number for direct contact display
*/

ALTER TABLE featured_astrologers ADD COLUMN IF NOT EXISTS phone text;

UPDATE featured_astrologers 
SET phone = '9869151612'
WHERE is_owner = true;