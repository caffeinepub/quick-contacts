import { useGetContacts } from '../hooks/useQueries';
import ContactCard from './ContactCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

export default function ContactsList() {
  const { data: contacts, isLoading } = useGetContacts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <img
            src="/assets/generated/contacts-hero.dim_400x300.png"
            alt="No contacts"
            className="w-64 h-48 mx-auto object-contain opacity-60"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">No contacts yet</h3>
        <p className="text-muted-foreground mb-6">
          Start adding contacts by searching usernames, scanning QR codes, or sharing invite links
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">
          {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
        </h2>
      </div>
      {contacts.map((contact, index) => (
        <ContactCard key={index} contact={contact} />
      ))}
    </div>
  );
}

