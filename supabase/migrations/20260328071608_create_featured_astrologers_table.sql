/*
  # Featured Astrologers Table

  1. Purpose
    - Store featured/showcase astrologers for display on the homepage
    - No dependency on auth.users, allowing owner to add astrologers directly
    - Includes Jyotish Rishi Harish Purohit as the app owner

  2. New Table
    - `featured_astrologers` - Display-only astrologer profiles
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `avatar_url` (text)
      - `bio` (text)
      - `specialties` (text array)
      - `languages` (text array)
      - `experience_years` (integer)
      - `rate_per_minute` (decimal)
      - `is_available` (boolean)
      - `is_verified` (boolean)
      - `is_owner` (boolean) - marks app owner
      - `total_consultations` (integer)
      - `rating` (decimal)
      - `review_count` (integer)

  3. Security
    - Enable RLS
    - Public read access for display
*/

CREATE TABLE IF NOT EXISTS featured_astrologers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{Hindi}',
  experience_years integer DEFAULT 0,
  rate_per_minute decimal(10, 2) DEFAULT 10.00,
  is_available boolean DEFAULT true,
  is_verified boolean DEFAULT true,
  is_owner boolean DEFAULT false,
  total_consultations integer DEFAULT 0,
  rating decimal(3, 2) DEFAULT 5.00,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE featured_astrologers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view featured astrologers"
  ON featured_astrologers FOR SELECT
  USING (true);

-- Insert Jyotish Rishi Harish Purohit as the owner
INSERT INTO featured_astrologers (
  full_name,
  avatar_url,
  bio,
  specialties,
  languages,
  experience_years,
  rate_per_minute,
  is_available,
  is_verified,
  is_owner,
  total_consultations,
  rating,
  review_count
) VALUES (
  'Jyotish Rishi Harish Purohit',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  'App ke sansthapak aur pramukh Jyotishi. 10,000+ Kundli nirman ka anubhav. Vedic, Jaimini, aur Parashari Jyotish mein visheshagya. Chara Dasha, Atmakaraka, aur Amatyakaraka vishleshan mein nipun.',
  ARRAY['Vedic Astrology', 'Jaimini Astrology', 'Kundli Making', 'Chara Dasha', 'Atmakaraka Analysis', 'Marriage', 'Career Guidance'],
  ARRAY['Hindi', 'English', 'Sanskrit'],
  15,
  50.00,
  true,
  true,
  true,
  10000,
  4.95,
  8750
);

-- Add more sample astrologers
INSERT INTO featured_astrologers (full_name, avatar_url, bio, specialties, languages, experience_years, rate_per_minute, is_available, is_verified, total_consultations, rating, review_count) VALUES
  ('Dr. Priya Sharma', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', 'PhD in Astrology from BHU. Career guidance aur relationship compatibility mein expert. Traditional wisdom ko modern counseling ke saath combine karti hain.', ARRAY['Career Guidance', 'Love & Relationships', 'Numerology', 'Vedic Astrology'], ARRAY['English', 'Hindi'], 12, 30.00, true, true, 5432, 4.8, 3210),
  ('Acharya Krishna Das', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'Spiritual guide aur Vedic astrologer. Renowned Guru ke shishya. Spiritual remedies aur Puja recommendations mein visheshagya.', ARRAY['Vedic Astrology', 'Vastu', 'Spiritual Guidance', 'Remedies'], ARRAY['Hindi', 'English', 'Bengali'], 18, 25.00, true, true, 7654, 4.7, 4567),
  ('Tarot Queen Meera', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150', 'Celebrity Tarot reader. Bollywood stars ki trusted advisor. Accurate predictions aur empathetic readings ke liye jaani jaati hain.', ARRAY['Tarot Reading', 'Numerology', 'Love & Relationships', 'Face Reading'], ARRAY['English', 'Hindi', 'Gujarati'], 10, 35.00, true, true, 4321, 4.9, 2876),
  ('Pandit Sunil Joshi', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150', 'Teesri peedhi ke Jyotish Acharya. Kundli matching aur Muhurat selection mein expert. Hazaron parivaron ka vishwas.', ARRAY['Marriage', 'Kundli Matching', 'Muhurat', 'Vedic Astrology'], ARRAY['Hindi', 'Marathi', 'English'], 22, 22.00, false, true, 9876, 4.85, 6543),
  ('Jyotishi Lakshmi Devi', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', 'Jaimini Sutra interpretation aur Karakamsha analysis mein visheshagya. Bestselling book ki lekhika.', ARRAY['Jaimini Astrology', 'Atmakaraka Analysis', 'Career Guidance', 'Vedic Astrology'], ARRAY['English', 'Hindi', 'Tamil'], 16, 28.00, true, true, 6789, 4.88, 4123);