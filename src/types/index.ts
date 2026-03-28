export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'astrologer';
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface BirthDetails {
  id: string;
  user_id: string;
  birth_date: string | null;
  birth_time: string | null;
  birth_city: string | null;
  birth_country: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
}

export interface AstrologerProfile {
  id: string;
  user_id: string;
  bio: string | null;
  specialties: string[];
  languages: string[];
  experience_years: number;
  rate_per_minute: number;
  is_available: boolean;
  is_verified: boolean;
  total_consultations: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: 'credit' | 'debit' | 'refund';
  description: string | null;
  created_at: string;
}

export interface ConsultationQueue {
  id: string;
  user_id: string;
  astrologer_id: string;
  queue_position: number;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  consultation_type: 'chat' | 'call' | 'video';
  created_at: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  astrologer_id: string;
  consultation_type: 'chat' | 'call' | 'video';
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  total_cost: number;
  rate_per_minute: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'system';
  created_at: string;
}

export interface Review {
  id: string;
  consultation_id: string;
  user_id: string;
  astrologer_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profile?: Profile;
}

export interface FeaturedAstrologer {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  specialties: string[];
  languages: string[];
  experience_years: number;
  rate_per_minute: number;
  is_available: boolean;
  is_verified: boolean;
  is_owner: boolean;
  total_consultations: number;
  rating: number;
  review_count: number;
  phone: string | null;
  created_at: string;
  updated_at: string;
}
