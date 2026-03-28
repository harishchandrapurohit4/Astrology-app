import { TrendingUp, TrendingDown, Minus, Sun, Moon, Star, AlertTriangle, Info } from 'lucide-react';

const PLANET_MARKET_DATA = [
  {
    planet: 'Sun',
    symbol: '☉',
    position: 'Aries (Exalted)',
    influence: 'bullish',
    sectors: ['Government Stocks', 'Gold', 'Energy'],
    insight: 'Surya uchch mein hai — sarkar aur energy sector mein taakat dikhne ki sambhavna. Market mein confidence bana rahega.',
    strength: 85,
  },
  {
    planet: 'Moon',
    symbol: '☽',
    position: 'Taurus',
    influence: 'bullish',
    sectors: ['FMCG', 'Real Estate', 'Silver'],
    insight: 'Chandra sthir rashi mein hai — FMCG aur real estate mein stability. Retail investors ka mood positive.',
    strength: 72,
  },
  {
    planet: 'Mars',
    symbol: '♂',
    position: 'Gemini',
    influence: 'neutral',
    sectors: ['Tech', 'Automobiles', 'Defence'],
    insight: 'Mangal dual rashi mein — tech sector mein volatility sambhav. Short-term trades mein caution.',
    strength: 55,
  },
  {
    planet: 'Mercury',
    symbol: '☿',
    position: 'Pisces (Debilitated)',
    influence: 'bearish',
    sectors: ['IT', 'Media', 'Banking'],
    insight: 'Budh neech rashi mein — communication aur IT stocks mein confusion. Nifty IT index par nazar rakhen.',
    strength: 30,
  },
  {
    planet: 'Jupiter',
    symbol: '♃',
    position: 'Taurus',
    influence: 'bullish',
    sectors: ['Finance', 'Education', 'Pharma'],
    insight: 'Guru sthir rashi mein — long-term investments ke liye shubh. Pharma aur finance mein growth dikh sakta hai.',
    strength: 78,
  },
  {
    planet: 'Venus',
    symbol: '♀',
    position: 'Pisces (Exalted)',
    influence: 'bullish',
    sectors: ['Luxury', 'Entertainment', 'Hospitality'],
    insight: 'Shukra uchch rashi mein — luxury brands, hospitality aur entertainment sector mein tej chaal sambhav.',
    strength: 90,
  },
  {
    planet: 'Saturn',
    symbol: '♄',
    position: 'Aquarius',
    influence: 'neutral',
    sectors: ['Infrastructure', 'Oil & Gas', 'Iron/Steel'],
    insight: 'Shani swagruhi — infrastructure mein dheemi lekin mazboot growth. Long-term investors ke liye uchit.',
    strength: 60,
  },
  {
    planet: 'Rahu',
    symbol: '☊',
    position: 'Pisces',
    influence: 'bearish',
    sectors: ['Chemicals', 'Speculation', 'Crypto'],
    insight: 'Rahu Meen mein — speculative trades mein bharosa na kare. Unexpected news se market disrupt ho sakta hai.',
    strength: 25,
  },
];

const WEEKLY_OUTLOOK = [
  { day: 'Monday', ruler: 'Moon', mood: 'bullish', note: 'Trading shuru karne ke liye shubh din' },
  { day: 'Tuesday', ruler: 'Mars', mood: 'volatile', note: 'High risk — caution zaroori' },
  { day: 'Wednesday', ruler: 'Mercury', mood: 'bearish', note: 'IT & media stocks mein pressure' },
  { day: 'Thursday', ruler: 'Jupiter', mood: 'bullish', note: 'Finance & pharma ke liye accha din' },
  { day: 'Friday', ruler: 'Venus', mood: 'bullish', note: 'Luxury & FMCG mein positive movement' },
  { day: 'Saturday', ruler: 'Saturn', mood: 'neutral', note: 'Infra stocks stable rahenge' },
  { day: 'Sunday', ruler: 'Sun', mood: 'neutral', note: 'Market band — analysis ka din' },
];

const NIFTY_ZONES = [
  { label: 'Strong Support', level: '21,800', type: 'support' },
  { label: 'Support', level: '22,150', type: 'support' },
  { label: 'Current Zone', level: '22,500', type: 'current' },
  { label: 'Resistance', level: '22,850', type: 'resistance' },
  { label: 'Strong Resistance', level: '23,200', type: 'resistance' },
];

function InfluenceBadge({ influence }: { influence: string }) {
  if (influence === 'bullish') {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <TrendingUp className="w-3 h-3" /> Bullish
      </span>
    );
  }
  if (influence === 'bearish') {
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
        <TrendingDown className="w-3 h-3" /> Bearish
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <Minus className="w-3 h-3" /> Neutral
    </span>
  );
}

function MoodIcon({ mood }: { mood: string }) {
  if (mood === 'bullish') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (mood === 'bearish') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <AlertTriangle className="w-4 h-4 text-amber-500" />;
}

export default function AstroTrading() {
  const today = new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const bullishCount = PLANET_MARKET_DATA.filter(p => p.influence === 'bullish').length;
  const bearishCount = PLANET_MARKET_DATA.filter(p => p.influence === 'bearish').length;
  const overallMood = bullishCount > bearishCount ? 'Bullish' : bearishCount > bullishCount ? 'Bearish' : 'Neutral';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">Acharya Harish Purohit ke anubhav par aadharit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Astro-Trading{' '}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-2">
            Grahon ki chaal ke hisaab se Nifty/Sensex market ka mood samjhen
          </p>
          <p className="text-amber-400/70 text-sm">{today}</p>

          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{bullishCount}</div>
              <div className="text-xs text-gray-400">Bullish Planets</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{bearishCount}</div>
              <div className="text-xs text-gray-400">Bearish Planets</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className={`text-2xl font-bold ${overallMood === 'Bullish' ? 'text-emerald-400' : overallMood === 'Bearish' ? 'text-red-400' : 'text-amber-400'}`}>
                {overallMood}
              </div>
              <div className="text-xs text-gray-400">Overall Mood</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="container mx-auto px-4 flex items-start gap-2 text-amber-800 text-sm">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            <strong>Disclaimer:</strong> Yeh insights keval jyotish shastra ke siddhanton par aadharit hain. Yeh financial advice nahi hai. Kisi bhi investment se pehle apne financial advisor se salah len.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-500" />
            Graha Prabhav — Sector-wise Analysis
          </h2>
          <p className="text-gray-500 mb-6">Aaj ke grahon ki sthiti aur unka market par prabhav</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PLANET_MARKET_DATA.map((item) => (
              <div
                key={item.planet}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.symbol}</span>
                    <div>
                      <div className="font-bold text-gray-800">{item.planet}</div>
                      <div className="text-xs text-gray-400">{item.position}</div>
                    </div>
                  </div>
                  <InfluenceBadge influence={item.influence} />
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Bal (Strength)</span>
                    <span>{item.strength}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        item.strength >= 70 ? 'bg-emerald-500' :
                        item.strength >= 45 ? 'bg-amber-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${item.strength}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{item.insight}</p>

                <div className="flex flex-wrap gap-1">
                  {item.sectors.map(s => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Moon className="w-5 h-5 text-slate-600" />
              Saptah ka Outlook
            </h2>
            <p className="text-gray-500 text-sm mb-5">Har din ke raajadhipati grah ke anusaar market mood</p>
            <div className="space-y-3">
              {WEEKLY_OUTLOOK.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <MoodIcon mood={day.mood} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">{day.day}</span>
                      <span className="text-xs text-gray-400">({day.ruler})</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{day.note}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    day.mood === 'bullish' ? 'bg-emerald-100 text-emerald-700' :
                    day.mood === 'bearish' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {day.mood === 'bullish' ? 'Shubh' : day.mood === 'bearish' ? 'Ashubh' : 'Volatile'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Nifty 50 — Jyotish Zones
            </h2>
            <p className="text-gray-500 text-sm mb-5">Grahon ke aadhar par support aur resistance levels</p>
            <div className="space-y-3">
              {NIFTY_ZONES.map((zone) => (
                <div
                  key={zone.label}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    zone.type === 'current'
                      ? 'bg-amber-50 border-amber-200'
                      : zone.type === 'support'
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-red-50 border-red-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      zone.type === 'current' ? 'bg-amber-500' :
                      zone.type === 'support' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-700">{zone.label}</span>
                  </div>
                  <span className={`font-bold text-sm ${
                    zone.type === 'current' ? 'text-amber-700' :
                    zone.type === 'support' ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {zone.level}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong className="text-gray-700">Astro Note:</strong> Jupiter aur Venus ka bullish prabhav market ko 22,850 ke upar le ja sakta hai. Lekin Rahu aur neech Budh ke kaaran sudden dip ka darr bana rahega. Stop-loss zaroor lagaen.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-amber-900 rounded-2xl p-8 text-white text-center">
          <Star className="w-10 h-10 text-amber-400 mx-auto mb-4" fill="currentColor" />
          <h3 className="text-2xl font-bold mb-2">Personal Trading Muhurat Janein</h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Acharya Harish Purohit se apni janam kundli ke aadhar par personal trading muhurat aur planetary dasha analysis prapt karen.
          </p>
          <a
            href="/astrologers"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg"
          >
            Consultation Book Karen
            <TrendingUp className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
