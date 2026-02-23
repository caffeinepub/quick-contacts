import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  inviteCode: string;
}

export default function QRCodeGenerator({ inviteCode }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!inviteCode) return;

    const generateQR = async () => {
      setIsGenerating(true);
      try {
        // Load QR code library from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js';
        
        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load QR code library'));
        });

        // Check if already loaded
        if (!(window as any).QRCode) {
          document.head.appendChild(script);
          await loadPromise;
        }

        const QRCode = (window as any).QRCode;
        const inviteLink = `${window.location.origin}?code=${inviteCode}`;
        
        const dataUrl = await QRCode.toDataURL(inviteLink, {
          width: 300,
          margin: 2,
          color: {
            dark: '#E07856',
            light: '#FFFFFF'
          }
        });
        
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        toast.error('Failed to generate QR code');
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [inviteCode]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `invite-qr-${inviteCode}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success('QR code downloaded!');
  };

  if (isGenerating || !qrDataUrl) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Generating QR code...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Your QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-6 rounded-2xl flex items-center justify-center">
          <img src={qrDataUrl} alt="QR Code" className="w-full max-w-[300px]" />
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <Button onClick={handleDownload} className="w-full rounded-xl gap-2">
          <Download className="w-4 h-4" />
          Download QR Code
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Share this QR code for others to scan and add you as a contact
        </p>
      </CardContent>
    </Card>
  );
}

