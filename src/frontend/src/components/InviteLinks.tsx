import { useState, useEffect } from 'react';
import { useGenerateInviteCode, useAcceptInvite } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getUrlParameter } from '../utils/urlParams';

export default function InviteLinks() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [acceptCode, setAcceptCode] = useState('');
  const generateCode = useGenerateInviteCode();
  const acceptInvite = useAcceptInvite();

  useEffect(() => {
    const codeFromUrl = getUrlParameter('code');
    if (codeFromUrl) {
      setAcceptCode(codeFromUrl);
    }
  }, []);

  const handleGenerate = () => {
    generateCode.mutate(undefined, {
      onSuccess: (code) => {
        setInviteCode(code);
        toast.success('Invite code generated!');
      },
      onError: (error) => {
        toast.error(`Failed to generate code: ${error.message}`);
      }
    });
  };

  const getInviteLink = () => {
    if (!inviteCode) return '';
    return `${window.location.origin}?code=${inviteCode}`;
  };

  const handleCopy = async () => {
    const link = getInviteLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    acceptInvite.mutate(
      { inviteCode: acceptCode.trim() },
      {
        onSuccess: () => {
          toast.success('Invite accepted! Contact added.');
          setAcceptCode('');
        },
        onError: (error) => {
          toast.error(`Failed to accept invite: ${error.message}`);
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Generate Invite Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create a unique invite link to share with others. They can use it to add you as a contact.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={generateCode.isPending}
            className="w-full rounded-xl"
          >
            {generateCode.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Invite Link'
            )}
          </Button>

          {inviteCode && (
            <div className="space-y-2 animate-fade-in">
              <Label>Your Invite Link</Label>
              <div className="flex gap-2">
                <Input
                  value={getInviteLink()}
                  readOnly
                  className="rounded-xl font-mono text-sm"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="icon"
                  className="rounded-xl flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Accept Invite</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccept} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="acceptCode">Invite Code</Label>
              <Input
                id="acceptCode"
                value={acceptCode}
                onChange={(e) => setAcceptCode(e.target.value)}
                placeholder="Enter invite code"
                className="rounded-xl"
              />
            </div>
            <Button
              type="submit"
              disabled={acceptInvite.isPending}
              className="w-full rounded-xl"
            >
              {acceptInvite.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Invite'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

