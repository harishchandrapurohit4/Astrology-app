/*
  # Astrology Marketplace Database Schema

  1. New Tables
    - `profiles` - User profiles with birth details and role (user/astrologer)
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `role` (text) - 'user' or 'astrologer'
      - `phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `birth_details` - User birth information for Kundli
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `birth_date` (date)
      - `birth_time` (time)
      - `birth_city` (text)
      - `birth_country` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `timezone` (text)
    
    - `astrologer_profiles` - Extended astrologer information
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `bio` (text)
      - `specialties` (text array)
      - `languages` (text array)
      - `experience_years` (integer)
      - `rate_per_minute` (decimal)
      - `is_available` (boolean)
      - `is_verified` (boolean)
      - `total_consultations` (integer)
      - `rating` (decimal)
      - `review_count` (integer)
    
    - `wallets` - User wallet for credits
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `balance` (decimal)
      - `currency` (text)
    
    - `wallet_transactions` - Transaction history
      - `id` (uuid, primary key)
      - `wallet_id` (uuid, references wallets)
      - `amount` (decimal)
      - `transaction_type` (text) - 'credit', 'debit', 'refund'
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `consultation_queue` - Queue for waiting users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `astrologer_id` (uuid, references astrologer_profiles)
      - `queue_position` (integer)
      - `status` (text) - 'waiting', 'active', 'completed', 'cancelled'
      - `consultation_type` (text) - 'chat', 'call', 'video'
      - `created_at` (timestamptz)
    
    - `consultations` - Active/completed consultations
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `astrologer_id` (uuid, references astrologer_profiles)
      - `consultation_type` (text)
      - `status` (text) - 'active', 'completed', 'cancelled'
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `duration_minutes` (integer)
      - `total_cost` (decimal)
      - `rate_per_minute` (decimal)
    
    - `chat_messages` - Real-time chat messages
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `sender_id` (uuid, references profiles)
      - `message` (text)
      - `message_type` (text) - 'text', 'image', 'system'
      - `created_at` (timestamptz)
    
    - `reviews` - User reviews for astrologers
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `user_id` (uuid, references profiles)
      - `astrologer_id` (uuid, references astrologer_profiles)
      - `rating` (integer)
      - `review_text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to access their own data
    - Astrologer profiles are publicly readable
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'astrologer')),
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Birth details table
CREATE TABLE IF NOT EXISTS birth_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  birth_date date,
  birth_time time,
  birth_city text,
  birth_country text,
  latitude decimal(10, 7),
  longitude decimal(10, 7),
  timezone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE birth_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own birth details"
  ON birth_details FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own birth details"
  ON birth_details FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own birth details"
  ON birth_details FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Astrologer profiles table
CREATE TABLE IF NOT EXISTS astrologer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio text,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{English}',
  experience_years integer DEFAULT 0,
  rate_per_minute decimal(10, 2) DEFAULT 10.00,
  is_available boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  total_consultations integer DEFAULT 0,
  rating decimal(3, 2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE astrologer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view astrologer profiles"
  ON astrologer_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Astrologers can update own profile"
  ON astrologer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Astrologers can insert own profile"
  ON astrologer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance decimal(12, 2) DEFAULT 0.00,
  currency text DEFAULT 'INR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  amount decimal(12, 2) NOT NULL,
  transaction_type text CHECK (transaction_type IN ('credit', 'debit', 'refund')) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON wallet_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM wallets
      WHERE wallets.id = wallet_transactions.wallet_id
      AND wallets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions"
  ON wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallets
      WHERE wallets.id = wallet_transactions.wallet_id
      AND wallets.user_id = auth.uid()
    )
  );

-- Consultation queue table
CREATE TABLE IF NOT EXISTS consultation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  astrologer_id uuid REFERENCES astrologer_profiles(id) ON DELETE CASCADE NOT NULL,
  queue_position integer DEFAULT 0,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  consultation_type text CHECK (consultation_type IN ('chat', 'call', 'video')) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own queue entries"
  ON consultation_queue FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM astrologer_profiles
    WHERE astrologer_profiles.id = consultation_queue.astrologer_id
    AND astrologer_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own queue entries"
  ON consultation_queue FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own queue entries"
  ON consultation_queue FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM astrologer_profiles
    WHERE astrologer_profiles.id = consultation_queue.astrologer_id
    AND astrologer_profiles.user_id = auth.uid()
  ))
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM astrologer_profiles
    WHERE astrologer_profiles.id = consultation_queue.astrologer_id
    AND astrologer_profiles.user_id = auth.uid()
  ));

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  astrologer_id uuid REFERENCES astrologer_profiles(id) ON DELETE CASCADE NOT NULL,
  consultation_type text CHECK (consultation_type IN ('chat', 'call', 'video')) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer DEFAULT 0,
  total_cost decimal(12, 2) DEFAULT 0.00,
  rate_per_minute decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM astrologer_profiles
    WHERE astrologer_profiles.id = consultations.astrologer_id
    AND astrologer_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM astrologer_profiles
    WHERE astrologer_profiles.id = consultations.astrologer_id
    AND astrologer_profiles.user_id = auth.uid()
  ))
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM astrologer_profiles
    WHERE astrologer_profiles.id = consultations.astrologer_id
    AND astrologer_profiles.user_id = auth.uid()
  ));

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their consultations"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultations
      WHERE consultations.id = chat_messages.consultation_id
      AND (consultations.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM astrologer_profiles
        WHERE astrologer_profiles.id = consultations.astrologer_id
        AND astrologer_profiles.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can send messages in their consultations"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM consultations
      WHERE consultations.id = chat_messages.consultation_id
      AND (consultations.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM astrologer_profiles
        WHERE astrologer_profiles.id = consultations.astrologer_id
        AND astrologer_profiles.user_id = auth.uid()
      ))
    )
  );

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  astrologer_id uuid REFERENCES astrologer_profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_astrologer_profiles_available ON astrologer_profiles(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_consultation_queue_status ON consultation_queue(status);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_consultation ON chat_messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_astrologer ON reviews(astrologer_id);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE consultation_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE consultations;