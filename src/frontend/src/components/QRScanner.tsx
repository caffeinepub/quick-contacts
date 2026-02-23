import { useEffect } from 'react';
import { useQRScanner } from '../qr-code/useQRScanner';
import { useAcceptInvite } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, SwitchCamera, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function QRScanner() {
  const {
    qrResults,
    isScanning,
    isActive,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 5
  });

  const acceptInvite = useAcceptInvite();
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (qrResults.length > 0) {
      const latestResult = qrResults[0];
      try {
        const url = new URL(latestResult.data);
        const code = url.searchParams.get('code');
        if (code) {
          acceptInvite.mutate(
            { inviteCode: code },
            {
              onSuccess: () => {
                toast.success('Contact added from QR code!');
                clearResults();
                stopScanning();
              },
              onError: (error) => {
                toast.error(`Failed to add contact: ${error.message}`);
              }
            }
          );
        } else {
          toast.error('Invalid QR code: No invite code found');
        }
      } catch (e) {
        toast.error('Invalid QR code format');
      }
    }
  }, [qrResults]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Scan QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.type === 'permission'
                  ? 'Camera permission denied. Please allow camera access in your browser settings.'
                  : error.type === 'not-supported'
                  ? 'Camera is not supported on this device.'
                  : error.type === 'not-found'
                  ? 'No camera found on this device.'
                  : error.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ display: isActive ? 'block' : 'none' }}
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/assets/generated/qr-placeholder.dim_128x128.png"
                  alt="QR Scanner"
                  className="w-32 h-32 opacity-30"
                />
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-2">
            {!isActive ? (
              <Button
                onClick={startScanning}
                disabled={!canStartScanning || isLoading}
                className="flex-1 rounded-xl gap-2"
              >
                <Camera className="w-4 h-4" />
                {isLoading ? 'Starting...' : 'Start Scanning'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopScanning}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 rounded-xl gap-2"
                >
                  <CameraOff className="w-4 h-4" />
                  Stop
                </Button>
                {isMobile && (
                  <Button
                    onClick={switchCamera}
                    disabled={isLoading}
                    variant="outline"
                    className="rounded-xl"
                    size="icon"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>

          {isScanning && (
            <p className="text-sm text-center text-muted-foreground">
              Point your camera at a QR code to scan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

