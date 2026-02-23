import SearchContacts from '../components/SearchContacts';
import { Search } from 'lucide-react';

export default function SearchContactsPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Search Contacts</h1>
        <p className="text-muted-foreground">
          Find and add contacts by searching their principal ID
        </p>
      </div>
      <SearchContacts />
    </div>
  );
}

