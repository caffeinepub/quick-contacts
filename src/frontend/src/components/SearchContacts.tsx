import { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useSearchUser, useAddContact } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SearchContacts() {
  const [searchInput, setSearchInput] = useState('');
  const [searchPrincipal, setSearchPrincipal] = useState<Principal | null>(null);
  const { data: searchResult, isLoading: isSearching, error: searchError } = useSearchUser(searchPrincipal);
  const addContact = useAddContact();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(searchInput.trim());
      setSearchPrincipal(principal);
    } catch (error) {
      toast.error('Invalid principal ID format');
      setSearchPrincipal(null);
    }
  };

  const handleAddContact = () => {
    if (!searchResult) return;

    addContact.mutate(
      {
        name: searchResult.username,
        email: '',
        phone: ''
      },
      {
        onSuccess: () => {
          toast.success(`Added ${searchResult.username} to your contacts!`);
          setSearchInput('');
          setSearchPrincipal(null);
        },
        onError: (error) => {
          toast.error(`Failed to add contact: ${error.message}`);
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter principal ID to search..."
              className="pl-10 rounded-xl"
            />
          </div>
          <Button type="submit" disabled={isSearching} className="rounded-xl">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
      </form>

      {searchError && (
        <Card className="rounded-2xl border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <p className="text-destructive text-center">
              User not found or error occurred
            </p>
          </CardContent>
        </Card>
      )}

      {searchResult && (
        <Card className="rounded-2xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1">@{searchResult.username}</h3>
                <p className="text-sm text-muted-foreground">
                  {searchResult.contacts.length} contacts
                </p>
              </div>
              <Button
                onClick={handleAddContact}
                disabled={addContact.isPending}
                className="rounded-xl gap-2"
              >
                {addContact.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add Contact
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

