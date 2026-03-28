import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Star, MessageCircle, Settings, Wallet, History, Users, CheckCircle, ToggleLeft, ToggleRight, IndianRupee, CreditCard as Edit2, Save, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AstrologerProfile, Consultation, ConsultationQueue, Review } from '../../types';

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
  'Chara Dasha',
  'Atmakaraka Analysis',
];

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada'];

export default function AstrologerDashboard() {
  const { profile, wallet } = useAuth();
  const [astrologerProfile, setAstrologerProfile] = useState<AstrologerProfile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [queue, setQueue] = useState<ConsultationQueue[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'consultations' | 'reviews' | 'settings'>('overview');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    specialties: [] as string[],
    languages: [] as string[],
    experience_years: 0,
    rate_per_minute: 10,
  });

  useEffect(() => {
    if (profile) {
      fetchAstrologerProfile();
      fetchConsultations();
      fetchQueue();
      fetchReviews();
    }
  }, [profile]);

  const fetchAstrologerProfile = async () => {
    const { data } = await supabase
      .from('astrologer_profiles')
      .select('*')
      .eq('user_id', profile?.id)
      .maybeSingle();

    if (data) {
      setAstrologerProfile(data);
      setEditForm({
        bio: data.bio || '',
        specialties: data.specialties || [],
        languages: data.languages || [],
        experience_years: data.experience_years || 0,
        rate_per_minute: data.rate_per_minute || 10,
      });
    }
  };

  const fetchConsultations = async () => {
    if (!astrologerProfile?.id) return;
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('astrologer_id', astrologerProfile.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setConsultations(data || []);
  };

  const fetchQueue = async () => {
    if (!astrologerProfile?.id) return;
    const { data } = await supabase
      .from('consultation_queue')
      .select('*')
      .eq('astrologer_id', astrologerProfile.id)
      .eq('status', 'waiting')
      .order('queue_position', { ascending: true });
    setQueue(data || []);
  };

  const fetchReviews = async () => {
    if (!astrologerProfile?.id) return;
    const { data } = await supabase
      .from('reviews')
      .select(`*, profile:profiles(full_name)`)
      .eq('astrologer_id', astrologerProfile.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setReviews(data || []);
  };

  useEffect(() => {
    if (astrologerProfile?.id) {
      fetchConsultations();
      fetchQueue();
      fetchReviews();
    }
  }, [astrologerProfile?.id]);

  const toggleAvailability = async () => {
    if (!astrologerProfile) return;

    const { error } = await supabase
      .from('astrologer_profiles')
      .update({ is_available: !astrologerProfile.is_available })
      .eq('id', astrologerProfile.id);

    if (!error) {
      setAstrologerProfile({
        ...astrologerProfile,
        is_available: !astrologerProfile.is_available,
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!astrologerProfile) return;
    setSaving(true);

    const { error } = await supabase
      .from('astrologer_profiles')
      .update({
        bio: editForm.bio,
        specialties: editForm.specialties,
        languages: editForm.languages,
        experience_years: editForm.experience_years,
        rate_per_minute: editForm.rate_per_minute,
      })
      .eq('id', astrologerProfile.id);

    if (!error) {
      await fetchAstrologerProfile();
      setEditing(false);
    }
    setSaving(false);
  };

  const toggleSpecialty = (specialty: string) => {
    setEditForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const toggleLanguage = (language: string) => {
    setEditForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const totalEarnings = consultations.reduce((sum, c) => sum + (c.total_cost || 0), 0);
  const completedConsultations = consultations.filter((c) => c.status === 'completed').length;
  const totalMinutes = consultations.reduce((sum, c) => sum + (c.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  {profile?.full_name?.charAt(0) || 'A'}
                </div>
                {astrologerProfile?.is_verified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-blue-400 bg-white rounded-full" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile?.full_name || 'Astrologer'}</h1>
                <p className="text-gray-300">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                  <span className="font-semibold">{astrologerProfile?.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-400">({astrologerProfile?.review_count || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:ml-auto">
              <button
                onClick={toggleAvailability}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  astrologerProfile?.is_available
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {astrologerProfile?.is_available ? (
                  <>
                    <ToggleRight className="w-6 h-6" />
                    Online
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-6 h-6" />
                    Offline
                  </>
                )}
              </button>

              <Link
                to="/wallet"
                className="flex items-center gap-2 bg-amber-500/20 px-6 py-3 rounded-xl hover:bg-amber-500/30 transition-colors"
              >
                <Wallet className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-300">Earnings</p>
                  <p className="text-xl font-bold text-amber-300">
                    INR {totalEarnings.toFixed(2)}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: User },
            { key: 'queue', label: 'Queue', icon: Users, badge: queue.length },
            { key: 'consultations', label: 'Consultations', icon: History },
            { key: 'reviews', label: 'Reviews', icon: Star },
            { key: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                    <span className="text-3xl font-bold text-gray-800">{completedConsultations}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Consultations</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <span className="text-3xl font-bold text-gray-800">{totalMinutes}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Minutes</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <IndianRupee className="w-8 h-8 text-green-600" />
                    <span className="text-3xl font-bold text-gray-800">{totalEarnings.toFixed(0)}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Earnings</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-amber-600" />
                    <span className="text-3xl font-bold text-gray-800">{queue.length}</span>
                  </div>
                  <p className="text-gray-500 text-sm">In Queue</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bio</p>
                    <p className="text-gray-700">{astrologerProfile?.bio || 'No bio added yet'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {astrologerProfile?.specialties?.length ? (
                        astrologerProfile.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No specialties added</span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-800">{astrologerProfile?.experience_years || 0} years</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Rate</p>
                      <p className="font-semibold text-gray-800">INR {astrologerProfile?.rate_per_minute || 0}/min</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Languages</p>
                      <p className="font-semibold text-gray-800">{astrologerProfile?.languages?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {queue.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-amber-800 mb-2">Users Waiting</h3>
                  <p className="text-4xl font-bold text-amber-600 mb-2">{queue.length}</p>
                  <p className="text-amber-700 text-sm">
                    {queue.length} user{queue.length > 1 ? 's' : ''} waiting in queue
                  </p>
                  <button
                    onClick={() => setActiveTab('queue')}
                    className="mt-4 w-full bg-amber-500 text-white py-2 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                  >
                    View Queue
                  </button>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Recent Reviews</h3>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'text-amber-400' : 'text-gray-300'
                              }`}
                              fill={star <= review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Consultation Queue</h2>
            </div>
            {queue.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {queue.map((item, index) => (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">
                          {item.consultation_type} Request
                        </p>
                        <p className="text-sm text-gray-500">
                          Waiting since {new Date(item.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <button className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users in queue</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Consultation History</h2>
            </div>
            {consultations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        consultation.consultation_type === 'chat'
                          ? 'bg-green-100 text-green-600'
                          : consultation.consultation_type === 'call'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">
                          {consultation.consultation_type} Consultation
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(consultation.started_at).toLocaleDateString()} at{' '}
                          {new Date(consultation.started_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : consultation.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {consultation.status}
                      </span>
                      <p className="mt-2 font-semibold text-gray-800">
                        {consultation.duration_minutes} min | INR {consultation.total_cost?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No consultations yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
            </div>
            {reviews.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating ? 'text-amber-400' : 'text-gray-300'
                            }`}
                            fill={star <= review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.review_text || 'No comment'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell clients about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">
                      {astrologerProfile?.bio || 'No bio added'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  {editing ? (
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES.map((specialty) => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            editForm.specialties.includes(specialty)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {astrologerProfile?.specialties?.map((specialty) => (
                        <span key={specialty} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                          {specialty}
                        </span>
                      )) || <span className="text-gray-400">No specialties</span>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                  {editing ? (
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleLanguage(language)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            editForm.languages.includes(language)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">{astrologerProfile?.languages?.join(', ') || 'Not specified'}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                    {editing ? (
                      <input
                        type="number"
                        min="0"
                        value={editForm.experience_years}
                        onChange={(e) => setEditForm({ ...editForm, experience_years: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">
                        {astrologerProfile?.experience_years || 0} years
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate per Minute (INR)</label>
                    {editing ? (
                      <input
                        type="number"
                        min="1"
                        value={editForm.rate_per_minute}
                        onChange={(e) => setEditForm({ ...editForm, rate_per_minute: parseFloat(e.target.value) || 10 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">
                        INR {astrologerProfile?.rate_per_minute || 10}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
