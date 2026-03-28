import { QrCode } from 'lucide-react';

interface AppQRCodeProps {
  url?: string;
  size?: number;
  label?: string;
}

export default function AppQRCode({ url, size = 120, label = 'Scan to open app' }: AppQRCodeProps) {
  const appUrl = url || window.location.origin;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(appUrl)}&color=1a1a2e&bgcolor=ffffff&qzone=1`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <img
          src={qrApiUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="rounded-lg"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          style={{ display: 'none', width: size, height: size }}
          className="items-center justify-center bg-gray-100 rounded-lg"
        >
          <QrCode className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      {label && (
        <p className="text-xs text-gray-500 text-center font-medium">{label}</p>
      )}
    </div>
  );
}
