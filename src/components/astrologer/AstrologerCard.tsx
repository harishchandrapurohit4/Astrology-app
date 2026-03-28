import { Star, MessageCircle, Phone, Video, Clock, CheckCircle, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AstrologerProfile, Profile } from '../../types';

interface AstrologerCardProps {
  astrologer: AstrologerProfile & { profile: Profile };
  onChat?: () => void;
  onCall?: () => void;
}

export default function AstrologerCard({ astrologer, onChat, onCall }: AstrologerCardProps) {
  const navigate = useNavigate();

  const handleAction = (type: 'chat' | 'call' | 'video') => {
    if (type === 'chat' && onChat) {
      onChat();
    } else if ((type === 'call' || type === 'video') && onCall) {
      onCall();
    } else {
      navigate(`/consultation/${astrologer.id}?type=${type}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-purple-600 to-purple-800" />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <img
              src={astrologer.profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.profile?.full_name || 'Astrologer')}&background=9333ea&color=fff&size=96`}
              alt={astrologer.profile?.full_name || 'Astrologer'}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            {astrologer.is_available && (
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 p-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-bold text-gray-800">
              {astrologer.profile?.full_name || 'Astrologer'}
            </h3>
            {astrologer.is_verified && (
              <CheckCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>

          <div className="flex items-center justify-center gap-1 mt-1">
            <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
            <span className="font-semibold text-gray-700">{astrologer.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({astrologer.review_count} reviews)</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {astrologer.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{astrologer.experience_years} years experience</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Languages className="w-4 h-4" />
            <span>{astrologer.languages.join(', ')}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-amber-600">
            INR {astrologer.rate_per_minute}
          </span>
          <span className="text-gray-500">/min</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAction('chat')}
            disabled={!astrologer.is_available}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
              astrologer.is_available
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          <button
            onClick={() => handleAction('call')}
            disabled={!astrologer.is_available}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
              astrologer.is_available
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-medium">Call</span>
          </button>
          <button
            onClick={() => handleAction('video')}
            disabled={!astrologer.is_available}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
              astrologer.is_available
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-xs font-medium">Video</span>
          </button>
        </div>

        {!astrologer.is_available && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Currently unavailable
          </p>
        )}
      </div>
    </div>
  );
}
