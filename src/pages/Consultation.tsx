import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Phone, Video, Clock, Wallet, X, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AstrologerProfile, Profile, ChatMessage, Consultation as ConsultationType } from '../types';

export default function Consultation() {
  const { astrologerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile, wallet, refreshWallet } = useAuth();
  const consultationType = searchParams.get('type') as 'chat' | 'call' | 'video' || 'chat';

  const [astrologer, setAstrologer] = useState<(AstrologerProfile & { profile: Profile }) | null>(null);
  const [consultation, setConsultation] = useState<ConsultationType | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cost, setCost] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAstrologer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [astrologerId]);

  useEffect(() => {
    if (consultation?.status === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          setCost((newTime / 60) * (astrologer?.rate_per_minute || 0));
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [consultation?.status, astrologer?.rate_per_minute]);

  useEffect(() => {
    if (consultation?.id) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [consultation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAstrologer = async () => {
    const { data } = await supabase
      .from('astrologer_profiles')
      .select(`*, profile:profiles(*)`)
      .eq('id', astrologerId)
      .maybeSingle();

    if (data) {
      setAstrologer(data as AstrologerProfile & { profile: Profile });
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!consultation?.id) return;

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('consultation_id', consultation.id)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  const subscribeToMessages = () => {
    if (!consultation?.id) return;

    const channel = supabase
      .channel(`chat:${consultation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `consultation_id=eq.${consultation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const startConsultation = async () => {
    if (!astrologer || !profile || !wallet) return;

    if (wallet.balance < astrologer.rate_per_minute * 5) {
      alert('Insufficient balance. Please recharge your wallet.');
      navigate('/wallet');
      return;
    }

    setStarting(true);

    const { data, error } = await supabase
      .from('consultations')
      .insert({
        user_id: profile.id,
        astrologer_id: astrologer.id,
        consultation_type: consultationType,
        status: 'active',
        rate_per_minute: astrologer.rate_per_minute,
      })
      .select()
      .single();

    if (!error && data) {
      setConsultation(data);

      await supabase.from('chat_messages').insert({
        consultation_id: data.id,
        sender_id: profile.id,
        message: `${consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} session started`,
        message_type: 'system',
      });
    }

    setStarting(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !consultation || !profile) return;

    const message = newMessage.trim();
    setNewMessage('');

    await supabase.from('chat_messages').insert({
      consultation_id: consultation.id,
      sender_id: profile.id,
      message,
      message_type: 'text',
    });
  };

  const endConsultation = async () => {
    if (!consultation || !wallet || !astrologer) return;

    const durationMinutes = Math.ceil(elapsedTime / 60);
    const totalCost = durationMinutes * astrologer.rate_per_minute;

    await supabase
      .from('consultations')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
        total_cost: totalCost,
      })
      .eq('id', consultation.id);

    await supabase
      .from('wallets')
      .update({ balance: wallet.balance - totalCost })
      .eq('id', wallet.id);

    await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      amount: totalCost,
      transaction_type: 'debit',
      description: `Consultation with ${astrologer.profile?.full_name} (${durationMinutes} min)`,
    });

    await supabase.from('chat_messages').insert({
      consultation_id: consultation.id,
      sender_id: profile!.id,
      message: `Session ended. Duration: ${durationMinutes} minutes. Cost: INR ${totalCost.toFixed(2)}`,
      message_type: 'system',
    });

    if (timerRef.current) clearInterval(timerRef.current);
    await refreshWallet();
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Astrologer not found</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <img
              src={astrologer.profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.profile?.full_name || 'Astrologer')}&background=9333ea&color=fff&size=96`}
              alt={astrologer.profile?.full_name || 'Astrologer'}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-100"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {astrologer.profile?.full_name}
            </h2>
            <p className="text-gray-500 mb-6">{astrologer.specialties.slice(0, 2).join(', ')}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Rate</span>
                <span className="font-bold text-gray-800">INR {astrologer.rate_per_minute}/min</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Type</span>
                <span className="font-bold text-gray-800 capitalize flex items-center gap-2">
                  {consultationType === 'chat' ? (
                    <Send className="w-4 h-4" />
                  ) : consultationType === 'call' ? (
                    <Phone className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  {consultationType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Your Balance</span>
                <span className="font-bold text-green-600">INR {wallet?.balance?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            {wallet && wallet.balance < astrologer.rate_per_minute * 5 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Low balance. Minimum INR {(astrologer.rate_per_minute * 5).toFixed(0)} required.
                </p>
              </div>
            )}

            <button
              onClick={startConsultation}
              disabled={starting || !wallet || wallet.balance < astrologer.rate_per_minute * 5}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {starting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Start {consultationType.charAt(0).toUpperCase() + consultationType.slice(1)}
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/astrologers')}
              className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={astrologer.profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.profile?.full_name || 'A')}&background=9333ea&color=fff&size=40`}
              alt={astrologer.profile?.full_name || 'Astrologer'}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="font-semibold">{astrologer.profile?.full_name}</h1>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">INR {cost.toFixed(2)}</span>
            </div>
            <button
              onClick={endConsultation}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              End
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === profile?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.message_type === 'system' ? (
                <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                  {message.message}
                </div>
              ) : (
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    message.sender_id === profile?.id
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow'
                  }`}
                >
                  <p>{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === profile?.id ? 'text-purple-200' : 'text-gray-400'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
