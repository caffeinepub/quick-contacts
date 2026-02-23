import { useState, useEffect } from 'react';
import InviteLinks from '../components/InviteLinks';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link as LinkIcon, QrCode } from 'lucide-react';
import { useGenerateInviteCode } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InviteLinksPage() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const generateCode = useGenerateInviteCode();

  const handleGenerateForQR = () => {
    generateCode.mutate(undefined, {
      onSuccess: (code) => {
        setGeneratedCode(code);
      }
    });
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
          <LinkIcon className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Share & Connect</h1>
        <p className="text-muted-foreground">
          Generate invite links or QR codes to share with others
        </p>
      </div>

      <Tabs defaultValue="links" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl">
          <TabsTrigger value="links" className="rounded-xl gap-2">
            <LinkIcon className="w-4 h-4" />
            Invite Links
          </TabsTrigger>
          <TabsTrigger value="qr" className="rounded-xl gap-2">
            <QrCode className="w-4 h-4" />
            QR Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="links" className="mt-6">
          <InviteLinks />
        </TabsContent>
        <TabsContent value="qr" className="mt-6">
          {generatedCode ? (
            <QRCodeGenerator inviteCode={generatedCode} />
          ) : (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Generate QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Generate an invite code to create a QR code that others can scan
                </p>
                <Button
                  onClick={handleGenerateForQR}
                  disabled={generateCode.isPending}
                  className="w-full rounded-xl"
                >
                  {generateCode.isPending ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

