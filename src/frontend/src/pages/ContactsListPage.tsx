import ContactsList from '../components/ContactsList';

export default function ContactsListPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Contacts</h1>
        <p className="text-muted-foreground">
          Manage and view all your saved contacts
        </p>
      </div>
      <ContactsList />
    </div>
  );
}

