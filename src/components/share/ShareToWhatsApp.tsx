import { MessageCircle } from 'lucide-react';

interface ShareToWhatsAppProps {
  message: string;
  className?: string;
  label?: string;
}

export default function ShareToWhatsApp({ message, className = '', label = 'Share on WhatsApp' }: ShareToWhatsAppProps) {
  const handleShare = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold px-4 py-2 rounded-xl transition-all ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      {label}
    </button>
  );
}
