import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Clock, Star, MessageCircle, Settings, Wallet, History, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BirthDetails, Consultation } from '../../types';
import BirthDetailsForm from '../../components/forms/BirthDetailsForm';

export default function UserDashboard() {
  const { profile, wallet } = useAuth();
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [showBirthForm, setShowBirthForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'settings'>('overview');

  useEffect(() => {
    if (profile) {
      fetchBirthDetails();
      fetchConsultations();
    }
  }, [profile]);

  const fetchBirthDetails = async () => {
    const { data } = await supabase
      .from('birth_details')
      .select('*')
      .eq('user_id', profile?.id)
      .maybeSingle();
    setBirthDetails(data);
  };

  const fetchConsultations = async () => {
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setConsultations(data || []);
  };

  const completedConsultations = consultations.filter(c => c.status === 'completed').length;
  const totalSpent = consultations.reduce((sum, c) => sum + (c.total_cost || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-gray-300">{profile?.email}</p>
            </div>
            <div className="ml-auto">
              <Link
                to="/wallet"
                className="flex items-center gap-2 bg-amber-500/20 px-6 py-3 rounded-xl hover:bg-amber-500/30 transition-colors"
              >
                <Wallet className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-300">Balance</p>
                  <p className="text-xl font-bold text-amber-300">
                    {wallet?.currency || 'INR'} {wallet?.balance?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'consultations'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <History className="w-5 h-5" />
            Consultations
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                    <span className="text-3xl font-bold text-gray-800">{completedConsultations}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Total Consultations</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <span className="text-3xl font-bold text-gray-800">
                      {consultations.reduce((sum, c) => sum + (c.duration_minutes || 0), 0)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">Total Minutes</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-8 h-8 text-amber-600" />
                    <span className="text-3xl font-bold text-gray-800">
                      {totalSpent.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">INR Spent</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Birth Details</h2>
                  <button
                    onClick={() => setShowBirthForm(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    {birthDetails ? 'Edit' : 'Add Details'}
                  </button>
                </div>

                {birthDetails ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Birth Date</p>
                        <p className="font-medium text-gray-800">{birthDetails.birth_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Birth Time</p>
                        <p className="font-medium text-gray-800">{birthDetails.birth_time || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl sm:col-span-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Birth Place</p>
                        <p className="font-medium text-gray-800">
                          {birthDetails.birth_city}, {birthDetails.birth_country}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">Add your birth details to get personalized readings</p>
                    <button
                      onClick={() => setShowBirthForm(true)}
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Birth Details
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Consultations</h2>
                {consultations.length > 0 ? (
                  <div className="space-y-4">
                    {consultations.slice(0, 5).map((consultation) => (
                      <div
                        key={consultation.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            consultation.consultation_type === 'chat'
                              ? 'bg-green-100 text-green-600'
                              : consultation.consultation_type === 'call'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 capitalize">
                              {consultation.consultation_type} Session
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(consultation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {consultation.duration_minutes} min
                          </p>
                          <p className="text-sm text-gray-500">
                            INR {consultation.total_cost?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No consultations yet</p>
                    <Link
                      to="/astrologers"
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Find an Astrologer
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Get Personalized Insights</h3>
                <p className="text-purple-200 text-sm mb-4">
                  Connect with expert astrologers for guidance on your life journey
                </p>
                <Link
                  to="/astrologers"
                  className="block text-center bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Talk to Astrologer
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/kundli"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Star className="w-5 h-5 text-amber-500" />
                    <span className="text-gray-700">Generate Kundli</span>
                  </Link>
                  <Link
                    to="/horoscope"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Daily Horoscope</span>
                  </Link>
                  <Link
                    to="/wallet"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Wallet className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Recharge Wallet</span>
                  </Link>
                </div>
              </div>
            </div>
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
                <p className="text-gray-500 mb-4">You haven't had any consultations yet</p>
                <Link
                  to="/astrologers"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Find an Astrologer
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={profile?.full_name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={profile?.phone || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showBirthForm && (
        <BirthDetailsForm
          existingDetails={birthDetails}
          onClose={() => setShowBirthForm(false)}
          onSave={() => {
            setShowBirthForm(false);
            fetchBirthDetails();
          }}
        />
      )}
    </div>
  );
}
