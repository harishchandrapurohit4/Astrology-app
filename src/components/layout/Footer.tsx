import { Star, Phone, Mail, MapPin, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                AstroConnect
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Connect with expert astrologers for personalized guidance on love, career, health, and more.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-300 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/astrologers" className="hover:text-white transition-colors">Find Astrologers</Link></li>
              <li><Link to="/horoscope" className="hover:text-white transition-colors">Daily Horoscope</Link></li>
              <li><Link to="/kundli" className="hover:text-white transition-colors">Free Kundli</Link></li>
              <li><Link to="/compatibility" className="hover:text-white transition-colors">Compatibility</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-300 mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/services/vedic" className="hover:text-white transition-colors">Vedic Astrology</Link></li>
              <li><Link to="/services/jaimini" className="hover:text-white transition-colors">Jaimini Astrology</Link></li>
              <li><Link to="/services/numerology" className="hover:text-white transition-colors">Numerology</Link></li>
              <li><Link to="/services/tarot" className="hover:text-white transition-colors">Tarot Reading</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-300 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:9869151612" className="hover:text-white transition-colors">+91 9869151612</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@astroconnect.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </li>
              <li className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://www.youtube.com/@harishpurohittalk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                  >
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </a>
                  <a
                    href="https://www.facebook.com/harishchandra.purohit.2025/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a
                    href="https://www.linkedin.com/in/harish-chandra-purohit-339a5427/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AstroConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
