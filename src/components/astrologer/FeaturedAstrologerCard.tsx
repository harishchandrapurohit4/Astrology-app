import { Star, MessageCircle, Phone, Video, CheckCircle, Crown, ExternalLink } from 'lucide-react';
import { FeaturedAstrologer } from '../../types';

interface FeaturedAstrologerCardProps {
  astrologer: FeaturedAstrologer;
}

export default function FeaturedAstrologerCard({ astrologer }: FeaturedAstrologerCardProps) {
  const getWhatsAppLink = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Namaste ${name} ji, mujhe aapsi consultation chahiye. Kripya samay bataaein.`);
    return `https://wa.me/91${phone.replace(/\D/g, '')}?text=${msg}`;
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full ${astrologer.is_owner ? 'ring-2 ring-amber-400' : 'border border-gray-100'}`}>
      {astrologer.is_owner && (
        <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold py-1.5 px-3 rounded-full mb-4 -mt-2 mx-auto w-fit">
          <Crown className="w-3.5 h-3.5" />
          App Owner
        </div>
      )}

      <div className="relative mx-auto w-24 h-24 mb-4">
        <img
          src={astrologer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.full_name)}&background=d97706&color=fff&size=96`}
          alt={astrologer.full_name}
          className="w-full h-full rounded-full object-cover border-4 border-amber-100"
        />
        {astrologer.is_verified && (
          <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-blue-500 bg-white rounded-full" />
        )}
        {astrologer.is_available && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-800 text-center mb-1">
        {astrologer.full_name}
      </h3>

      <div className="flex items-center justify-center gap-1 mb-3">
        <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
        <span className="font-semibold text-gray-800">{Number(astrologer.rating).toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({astrologer.review_count.toLocaleString()})</span>
      </div>

      <div className="flex flex-wrap justify-center gap-1 mb-4">
        {astrologer.specialties.slice(0, 3).map((specialty) => (
          <span key={specialty} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs border border-amber-100">
            {specialty}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{astrologer.experience_years} saal anubhav</span>
        <span className="font-bold text-amber-600">&#8377;{astrologer.rate_per_minute}/min</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4">
        <span>{astrologer.languages.slice(0, 3).join(' · ')}</span>
      </div>

      {astrologer.is_available ? (
        <div className="space-y-2" onClick={stopPropagation}>
          {astrologer.phone && (
            <>
              <a
                href={`tel:${astrologer.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call: {astrologer.phone}
              </a>
              <a
                href={getWhatsAppLink(astrologer.phone, astrologer.full_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20bf5b] text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center gap-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium">
              <Phone className="w-4 h-4" />
              App Call
            </div>
            <div className="flex flex-col items-center gap-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-medium">
              <Video className="w-4 h-4" />
              App Video
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 bg-gray-100 text-gray-500 rounded-xl text-sm">
          Abhi Offline
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-3">
        {astrologer.total_consultations.toLocaleString()} consultations
      </p>
    </div>
  );
}
