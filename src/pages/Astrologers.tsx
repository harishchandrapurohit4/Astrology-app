import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FeaturedAstrologer, AstrologerProfile, Profile } from '../types';
import FeaturedAstrologerCard from '../components/astrologer/FeaturedAstrologerCard';
import AstrologerCard from '../components/astrologer/AstrologerCard';

const SPECIALTIES = [
  'Vedic Astrology',
  'Jaimini Astrology',
  'Numerology',
  'Tarot Reading',
  'Palmistry',
  'Vastu',
  'Face Reading',
  'Career Guidance',
  'Love & Relationships',
  'Marriage',
  'Puja',
  'Havan',
  'Spiritual Guidance',
];

const LANGUAGES = ['English', 'Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'];

export default function Astrologers() {
  const [featuredAstrologers, setFeaturedAstrologers] = useState<FeaturedAstrologer[]>([]);
  const [astrologers, setAstrologers] = useState<(AstrologerProfile & { profile: Profile })[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price'>('rating');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchFeatured();
  }, []);

  useEffect(() => {
    fetchAstrologers();
  }, [selectedSpecialty, selectedLanguage, sortBy, onlineOnly]);

  const fetchFeatured = async () => {
    setLoadingFeatured(true);
    const { data } = await supabase
      .from('featured_astrologers')
      .select('*')
      .order('is_owner', { ascending: false });
    if (data) setFeaturedAstrologers(data as FeaturedAstrologer[]);
    setLoadingFeatured(false);
  };

  const fetchAstrologers = async () => {
    setLoadingAll(true);
    let query = supabase.from('astrologer_profiles').select('*, profile:profiles(*)');

    if (onlineOnly) query = query.eq('is_available', true);
    if (selectedSpecialty) query = query.contains('specialties', [selectedSpecialty]);
    if (selectedLanguage) query = query.contains('languages', [selectedLanguage]);

    if (sortBy === 'rating') query = query.order('rating', { ascending: false });
    else if (sortBy === 'experience') query = query.order('experience_years', { ascending: false });
    else if (sortBy === 'price') query = query.order('rate_per_minute', { ascending: true });

    const { data } = await query;
    if (data) {
      let filtered = data as (AstrologerProfile & { profile: Profile })[];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.profile?.full_name?.toLowerCase().includes(q) ||
            a.specialties.some((s) => s.toLowerCase().includes(q)) ||
            a.bio?.toLowerCase().includes(q)
        );
      }
      setAstrologers(filtered);
    }
    setLoadingAll(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAstrologers();
  };

  const filteredFeatured = featuredAstrologers.filter((a) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !a.full_name.toLowerCase().includes(q) &&
        !a.specialties.some((s) => s.toLowerCase().includes(q)) &&
        !a.bio?.toLowerCase().includes(q)
      ) return false;
    }
    if (selectedSpecialty && !a.specialties.includes(selectedSpecialty)) return false;
    if (selectedLanguage && !a.languages.includes(selectedLanguage)) return false;
    if (onlineOnly && !a.is_available) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Apna Jyotishi Chunein</h1>
          <p className="text-gray-300 mb-8">
            Visheshagya jyotishion se seedha juden — Chat, Call ya Video se
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Naam, visheshagyta se dhundhen..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Khojein
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border transition-colors ${showFilters ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-gray-200 hover:border-amber-300'}`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="rounded text-amber-500"
            />
            <span className="text-sm">Online Only</span>
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'price')}
              className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm"
            >
              <option value="rating">Sabse Zyada Rated</option>
              <option value="experience">Zyada Anubhav</option>
              <option value="price">Kam Rate</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visheshagyta</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Sabhi Visheshagytaen</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bhaasha</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Sabhi Bhaashaen</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={() => { setSelectedSpecialty(''); setSelectedLanguage(''); setOnlineOnly(false); }}
              className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Sabhi Filters Hataaein
            </button>
          </div>
        )}

        {(loadingFeatured ? true : filteredFeatured.length > 0) && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Hamare Visheshagya Jyotishi</h2>
                <p className="text-gray-500 text-sm">Direct connect karen — Call, Chat ya WhatsApp se</p>
              </div>
            </div>

            {loadingFeatured ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-12 bg-gray-200 rounded-xl" />
                      <div className="h-12 bg-gray-200 rounded-xl" />
                      <div className="h-12 bg-gray-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeatured.map((astrologer) => (
                  <Link key={astrologer.id} to={`/astrologer/${astrologer.id}`} className="block hover:no-underline">
                    <FeaturedAstrologerCard astrologer={astrologer} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {astrologers.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Anya Jyotishi</h2>
                <p className="text-gray-500 text-sm">App ke zariye connect karen</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {astrologers.map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          </div>
        )}

        {!loadingFeatured && !loadingAll && filteredFeatured.length === 0 && astrologers.length === 0 && (
          <div className="text-center py-20">
            <Star className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Koi jyotishi nahi mila</h3>
            <p className="text-gray-400">Filters ya search badlein</p>
          </div>
        )}
      </div>
    </div>
  );
}
