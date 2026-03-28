import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Phone, Video, Users, Award, Clock, ArrowRight, Sparkles, Youtube, Facebook, Linkedin, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FeaturedAstrologer } from '../types';
import FeaturedAstrologerCard from '../components/astrologer/FeaturedAstrologerCard';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' },
];

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Chat with Astrologers',
    description: 'Get instant answers through real-time chat with verified astrologers',
  },
  {
    icon: Phone,
    title: 'Voice Consultations',
    description: 'Connect via voice calls for in-depth astrological guidance',
  },
  {
    icon: Video,
    title: 'Video Sessions',
    description: 'Face-to-face consultations for a personal touch',
  },
];

const STATS = [
  { icon: Users, value: '10M+', label: 'Happy Users' },
  { icon: Award, value: '5000+', label: 'Expert Astrologers' },
  { icon: Clock, value: '24/7', label: 'Available' },
  { icon: Star, value: '4.8', label: 'Average Rating' },
];

export default function Home() {
  const [astrologers, setAstrologers] = useState<FeaturedAstrologer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    const { data } = await supabase
      .from('featured_astrologers')
      .select('*')
      .order('is_owner', { ascending: false })
      .order('rating', { ascending: false })
      .limit(6);

    if (data) {
      setAstrologers(data as FeaturedAstrologer[]);
    }
    setLoading(false);
  };

  return (
    <div>
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-medium">India's #1 Astrology Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Cosmic Destiny
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with expert Vedic & Jaimini astrologers for personalized guidance on love, career, health, and spiritual growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/astrologers"
                className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                Talk to Astrologer
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/kundli"
                className="bg-white/10 backdrop-blur px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
              >
                Get Free Kundli
                <Star className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="py-12 bg-gray-50 -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get astrological guidance in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-amber-50 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Top Astrologers
              </h2>
              <p className="text-gray-600">
                Connect with our verified expert astrologers
              </p>
            </div>
            <Link
              to="/astrologers"
              className="hidden md:flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : astrologers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {astrologers.map((astrologer) => (
                <FeaturedAstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No astrologers available at the moment.</p>
              <Link
                to="/signup?role=astrologer"
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                Become an Astrologer
              </Link>
            </div>
          )}

          <div className="md:hidden text-center mt-8">
            <Link
              to="/astrologers"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold"
            >
              View All Astrologers
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Daily Horoscope
            </h2>
            <p className="text-gray-600">
              Select your zodiac sign to read today's horoscope
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {ZODIAC_SIGNS.map((sign) => (
              <Link
                key={sign.name}
                to={`/horoscope/${sign.name.toLowerCase()}`}
                className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <span className="text-4xl block mb-2">{sign.symbol}</span>
                <h3 className="font-semibold text-gray-800">{sign.name}</h3>
                <p className="text-xs text-gray-500">{sign.dates}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Star className="w-8 h-8 text-amber-400" fill="currentColor" />
              </div>
              <div>
                <p className="font-bold text-xl text-white">Harish Purohit Talk</p>
                <p className="text-gray-400 text-sm">Jyotish, Dharma, Adhyatm aur Astro-Trading ke liye follow karen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href="https://www.youtube.com/@harishpurohittalk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                <Youtube className="w-4 h-4" />
                YouTube
              </a>
              <a
                href="https://www.facebook.com/harishchandra.purohit.2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/in/harish-chandra-purohit-339a5427/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gradient-to-r from-slate-800 to-amber-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-xl text-white">Astro-Trading Insights</p>
                <p className="text-gray-300 text-sm">Grahon ki chaal ke hisaab se Nifty/Sensex market ka mood — exclusive astro analysis</p>
              </div>
            </div>
            <Link
              to="/astro-trading"
              className="flex-shrink-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              Dekhein Insights
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Discover Your Destiny?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of users who have found clarity and guidance through our expert astrologers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://www.youtube.com/@harishpurohittalk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full font-semibold text-lg transition-all"
            >
              <Youtube className="w-5 h-5" />
              Watch on YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
