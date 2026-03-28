import { useEffect, useState } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { WalletTransaction } from '../types';

const RECHARGE_OPTIONS = [
  { amount: 100, bonus: 0 },
  { amount: 200, bonus: 10 },
  { amount: 500, bonus: 50 },
  { amount: 1000, bonus: 150 },
  { amount: 2000, bonus: 400 },
  { amount: 5000, bonus: 1250 },
];

export default function Wallet() {
  const { wallet, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (wallet) {
      fetchTransactions();
    }
  }, [wallet]);

  const fetchTransactions = async () => {
    if (!wallet) return;

    const { data } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(20);

    setTransactions(data || []);
    setLoading(false);
  };

  const handleRecharge = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount < 10 || !wallet) return;

    setProcessing(true);

    const bonus = RECHARGE_OPTIONS.find((o) => o.amount === amount)?.bonus || 0;
    const totalCredit = amount + bonus;

    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        amount: totalCredit,
        transaction_type: 'credit',
        description: bonus > 0 ? `Recharge of INR ${amount} + Bonus INR ${bonus}` : `Recharge of INR ${amount}`,
      });

    if (!transactionError) {
      await supabase
        .from('wallets')
        .update({ balance: wallet.balance + totalCredit })
        .eq('id', wallet.id);

      await refreshWallet();
      await fetchTransactions();
      setShowRecharge(false);
      setSelectedAmount(null);
      setCustomAmount('');
    }

    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Wallet</h1>
                <p className="text-gray-300">Manage your credits and transactions</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6">
                <p className="text-purple-200 mb-2">Available Balance</p>
                <p className="text-4xl font-bold mb-4">
                  {wallet?.currency || 'INR'} {wallet?.balance?.toFixed(2) || '0.00'}
                </p>
                <button
                  onClick={() => setShowRecharge(true)}
                  className="flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Money
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <p className="text-gray-300 mb-4">Quick Stats</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-green-400">
                      +{transactions.filter((t) => t.transaction_type === 'credit').reduce((sum, t) => sum + t.amount, 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-400">Total Credits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">
                      -{transactions.filter((t) => t.transaction_type === 'debit').reduce((sum, t) => sum + t.amount, 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-400">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : transactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.transaction_type === 'credit'
                          ? 'bg-green-100 text-green-600'
                          : transaction.transaction_type === 'refund'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.transaction_type === 'credit' ? (
                          <ArrowDownLeft className="w-6 h-6" />
                        ) : transaction.transaction_type === 'refund' ? (
                          <ArrowDownLeft className="w-6 h-6" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {transaction.description || `${transaction.transaction_type === 'credit' ? 'Money Added' : 'Consultation Payment'}`}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        transaction.transaction_type === 'debit' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.transaction_type === 'debit' ? '-' : '+'}
                        INR {transaction.amount.toFixed(2)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No transactions yet</p>
                <button
                  onClick={() => setShowRecharge(true)}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Money
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRecharge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recharge Wallet</h2>
              <p className="text-gray-500">Select an amount to add to your wallet</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {RECHARGE_OPTIONS.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => {
                      setSelectedAmount(option.amount);
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAmount === option.amount
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <p className="text-xl font-bold text-gray-800">INR {option.amount}</p>
                    {option.bonus > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        + INR {option.bonus} Bonus
                      </p>
                    )}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">INR</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter amount (min. 10)"
                    min="10"
                    className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment will be processed securely</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRecharge(false);
                    setSelectedAmount(null);
                    setCustomAmount('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={processing || (!selectedAmount && (!customAmount || parseFloat(customAmount) < 10))}
                  className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : `Pay INR ${selectedAmount || customAmount || 0}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
