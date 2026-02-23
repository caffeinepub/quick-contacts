import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [username, setUsername] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    saveProfile.mutate(
      { username: username.trim(), contacts: [] },
      {
        onSuccess: () => {
          toast.success('Profile created successfully!');
        },
        onError: (error) => {
          toast.error(`Failed to create profile: ${error.message}`);
        }
      }
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md rounded-3xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Quick Contacts!</DialogTitle>
          <DialogDescription>
            Let's set up your profile. Choose a username that others can use to find you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="rounded-xl"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

