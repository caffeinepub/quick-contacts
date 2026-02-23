import QRScanner from '../components/QRScanner';
import { QrCode } from 'lucide-react';

export default function QRScannerPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
        <p className="text-muted-foreground">
          Scan a contact's QR code to add them instantly
        </p>
      </div>
      <QRScanner />
    </div>
  );
}

