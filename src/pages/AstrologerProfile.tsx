import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, Phone, MessageCircle, Video, CheckCircle, Crown,
  Clock, Languages, BookOpen, Award, Users, ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FeaturedAstrologer } from '../types';

export default function AstrologerProfile() {
  const { id } = useParams();
  const [astrologer, setAstrologer] = useState<FeaturedAstrologer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAstrologer(id);
  }, [id]);

  const fetchAstrologer = async (astrologerId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('featured_astrologers')
      .select('*')
      .eq('id', astrologerId)
      .maybeSingle();

    if (data) setAstrologer(data as FeaturedAstrologer);
    setLoading(false);
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Namaste ${name} ji, mujhe aapsi consultation chahiye. Kripya samay bataaein.`);
    return `https://wa.me/91${phone.replace(/\D/g, '')}?text=${msg}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Star className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Jyotishi nahi mila</p>
          <Link to="/astrologers" className="text-amber-600 hover:underline mt-2 inline-block">Wapas jaaein</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/astrologers" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            Sabhi Jyotishi
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8">
            <div className="relative flex-shrink-0">
              <img
                src={astrologer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.full_name)}&background=d97706&color=fff&size=128`}
                alt={astrologer.full_name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-amber-400/50 shadow-xl"
              />
              {astrologer.is_available && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
                  Online
                </span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                {astrologer.is_owner && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                    <Crown className="w-3.5 h-3.5" />
                    App Owner
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{astrologer.full_name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                {astrologer.is_verified && (
                  <div className="flex items-center gap-1 text-blue-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </div>
                )}
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="font-bold">{Number(astrologer.rating).toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({astrologer.review_count.toLocaleString()} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {astrologer.specialties.map((s) => (
                  <span key={s} className="bg-white/10 text-gray-200 px-3 py-1 rounded-full text-sm">{s}</span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {astrologer.experience_years} saal anubhav
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  {astrologer.total_consultations.toLocaleString()} consultations
                </div>
                <div className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-amber-400" />
                  {astrologer.languages.join(', ')}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white/10 rounded-2xl p-5 text-center min-w-[160px]">
              <p className="text-gray-400 text-sm mb-1">Rate</p>
              <p className="text-3xl font-bold text-amber-400">&#8377;{astrologer.rate_per_minute}</p>
              <p className="text-gray-400 text-sm">per minute</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {astrologer.bio && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <h2 className="font-bold text-gray-800 text-lg">Parichay</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{astrologer.bio}</p>
              </div>
            )}
            

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-gray-800 text-lg">Visheshagytaen</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {astrologer.specialties.map((s) => (
                  <span key={s} className="px-4 py-2 bg-amber-50 text-amber-800 rounded-xl text-sm font-medium border border-amber-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-gray-800 text-lg">Bhaashaen</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {astrologer.languages.map((l) => (
                  <span key={l} className="px-4 py-2 bg-blue-50 text-blue-800 rounded-xl text-sm font-medium border border-blue-100">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Anubhav', value: `${astrologer.experience_years} Saal`, icon: Clock },
                { label: 'Consultations', value: astrologer.total_consultations.toLocaleString(), icon: Users },
                { label: 'Rating', value: `${Number(astrologer.rating).toFixed(1)} / 5`, icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <Icon className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-800">{value}</p>
                  <p className="text-gray-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Seedha Juden</h3>

              {astrologer.is_available ? (
                <div className="space-y-3">
                  {astrologer.phone && (
                    <>
                      <a
                        href={`tel:${astrologer.phone}`}
                        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        Call Karen: {astrologer.phone}
                      </a>

                      <a
                        href={getWhatsAppLink(astrologer.phone, astrologer.full_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bf5b] text-white py-3.5 rounded-xl font-semibold transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp Karen
                        <ExternalLink className="w-4 h-4 opacity-70" />
                      </a>
                    </>
                  )}

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 text-center mb-3">Ya App ke zariye:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/consultation/${astrologer.id}?type=chat`}
                        className="flex flex-col items-center gap-1 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </Link>
                      <Link
                        to={`/consultation/${astrologer.id}?type=video`}
                        className="flex flex-col items-center gap-1 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        <Video className="w-4 h-4" />
                        Video
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Abhi Offline</p>
                  <p className="text-gray-400 text-sm mt-1">Baad mein dobara try karen</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rate:</span>
                  <span className="font-bold text-amber-600 text-lg">&#8377;{astrologer.rate_per_minute}/min</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-gray-800 text-sm">Kyon Chunein?</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  {astrologer.experience_years}+ saal ka anubhav
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  {astrologer.total_consultations.toLocaleString()}+ satisfied clients
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  {Number(astrologer.rating).toFixed(1)} star rating
                </li>
                {astrologer.is_verified && (
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    Verified Jyotishi
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
