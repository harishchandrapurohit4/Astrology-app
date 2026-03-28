import { useState, useMemo } from 'react';
import { Star, Calendar, Clock, MapPin, Loader2, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareToWhatsApp from '../components/share/ShareToWhatsApp';
import AppQRCode from '../components/share/AppQRCode';
import NorthIndianChart from '../components/kundli/NorthIndianChart';

const RASHI_NAMES = [
  'Mesh', 'Vrishabh', 'Mithun', 'Kark',
  'Simha', 'Kanya', 'Tula', 'Vrischik',
  'Dhanu', 'Makar', 'Kumbh', 'Meen',
];

const PLANETS_DATA = [
  { name: 'Surya (Sun)', symbol: 'Su', fullSymbol: '☉' },
  { name: 'Chandra (Moon)', symbol: 'Mo', fullSymbol: '☽' },
  { name: 'Mangal (Mars)', symbol: 'Ma', fullSymbol: '♂' },
  { name: 'Budh (Mercury)', symbol: 'Me', fullSymbol: '☿' },
  { name: 'Guru (Jupiter)', symbol: 'Ju', fullSymbol: '♃' },
  { name: 'Shukra (Venus)', symbol: 'Ve', fullSymbol: '♀' },
  { name: 'Shani (Saturn)', symbol: 'Sa', fullSymbol: '♄' },
  { name: 'Rahu', symbol: 'Ra', fullSymbol: '☊' },
  { name: 'Ketu', symbol: 'Ke', fullSymbol: '☋' },
];

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateKundliData(birthDate: string, birthTime: string) {
  const seed = birthDate.split('-').join('') + birthTime.split(':').join('');
  const rand = seededRandom(parseInt(seed) || 19980101);

  const lagnaSign = Math.floor(rand() * 12) + 1;

  const planetHouses = PLANETS_DATA.map(() => Math.floor(rand() * 12) + 1);

  const planets = PLANETS_DATA.map((p, i) => ({
    name: p.name,
    symbol: p.symbol,
    fullSymbol: p.fullSymbol,
    house: planetHouses[i],
    rashi: RASHI_NAMES[((lagnaSign - 1 + planetHouses[i] - 1) % 12)],
  }));

  const karakas = [...planets]
    .sort((a, b) => b.house - a.house)
    .slice(0, 4);

  return { lagnaSign, planets, karakas };
}

export default function Kundli() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthCountry: 'India',
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const kundliData = useMemo(() => {
    if (!generated) return null;
    return generateKundliData(formData.birthDate, formData.birthTime);
  }, [generated, formData.birthDate, formData.birthTime]);

  const getWhatsAppMessage = () => {
    return `*Meri Janam Kundli - ${formData.name}*\n\nJanm Vivaran:\nTarikh: ${new Date(formData.birthDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}\nSamay: ${formData.birthTime}\nSthan: ${formData.birthCity}, ${formData.birthCountry}\n\nApni muft Kundli banaaein: ${window.location.origin}/kundli`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setGenerated(true);
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Muft Janam Kundli</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            North Indian Chart (Uttar Bhartiya) paddhati mein apni janma patrika banaaein.
            Grahon ki sthiti aur jeevan ka vistar se jaanen.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {!generated ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Janm Vivaran Bharein</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Poora Naam</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Apna naam likhein"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Calendar className="w-4 h-4 inline mr-1.5" />
                      Janm Tarikh
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Clock className="w-4 h-4 inline mr-1.5" />
                      Janm Samay
                    </label>
                    <input
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <MapPin className="w-4 h-4 inline mr-1.5" />
                      Janm Sthan (Shahar)
                    </label>
                    <input
                      type="text"
                      value={formData.birthCity}
                      onChange={(e) => setFormData({ ...formData, birthCity: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Jaise: Mumbai, Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Desh</label>
                    <select
                      value={formData.birthCountry}
                      onChange={(e) => setFormData({ ...formData, birthCountry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Kundli ban rahi hai...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5" />
                      Kundli Banaaein
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            kundliData && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{formData.name} ki Janam Kundli</h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {new Date(formData.birthDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })} • {formData.birthTime} • {formData.birthCity}, {formData.birthCountry}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setGenerated(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Nai Kundli
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <ShareToWhatsApp message={getWhatsAppMessage()} />
                  </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800">Uttar Bhartiya Kundli (Lagna Chart)</h3>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                        Lagna: {RASHI_NAMES[kundliData.lagnaSign - 1]}
                      </span>
                    </div>
                    <div className="aspect-square max-w-sm mx-auto">
                      <NorthIndianChart
                        planets={kundliData.planets}
                        lagnaSign={kundliData.lagnaSign}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      North Indian Chart • House 1 (Lagna) upar ke triangle mein
                    </p>
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-4">Graha Sthiti</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {kundliData.planets.map((planet) => (
                        <div key={planet.name} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-amber-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl w-7 text-center">{planet.fullSymbol}</span>
                            <div>
                              <p className="font-medium text-gray-800 text-sm leading-tight">{planet.name}</p>
                              <p className="text-xs text-gray-400">House {planet.house}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-amber-700 text-sm">{planet.rashi}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Jaimini Karakas</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Jaimini Jyotish ke anusaar aapke pramukh kaarak grah:
                  </p>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: 'Atmakaraka', desc: 'Aatma ka kaarak', planet: kundliData.karakas[0] },
                      { title: 'Amatyakaraka', desc: 'Vyavsay ka kaarak', planet: kundliData.karakas[1] },
                      { title: 'Bhratrukaraka', desc: 'Bhai-behen ka kaarak', planet: kundliData.karakas[2] },
                      { title: 'Matrukaraka', desc: 'Mata ka kaarak', planet: kundliData.karakas[3] },
                    ].map(({ title, desc, planet }) => (
                      <div key={title} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="font-semibold text-amber-800 text-sm">{title}</p>
                        <p className="text-lg font-bold text-gray-800 mt-1">{planet?.symbol || '-'}</p>
                        <p className="text-xs text-gray-500 mt-1">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
                  <div className="md:flex items-center justify-between gap-8">
                    <div className="mb-6 md:mb-0 flex-1">
                      <h3 className="text-xl font-bold mb-2">Vistar se Vishleshan Chahiye?</h3>
                      <p className="text-gray-300 mb-6 text-sm">
                        Hamare visheshagya Jyotishi aapki Chara Dasha, Grah Dasha, aur jeevan ke har pehlu ka vistar se vishleshan karenge.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to="/astrologers"
                          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          Jyotishi se Juden
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                        <ShareToWhatsApp
                          message={getWhatsAppMessage()}
                          label="Kundli Share Karen"
                          className="px-6 py-3"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <AppQRCode label="App share karen" size={110} />
                      <p className="text-xs text-gray-400">Dostion ke saath share karen</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
