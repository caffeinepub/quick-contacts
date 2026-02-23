import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ContactsListPage from './pages/ContactsListPage';
import SearchContactsPage from './pages/SearchContactsPage';
import InviteLinksPage from './pages/InviteLinksPage';
import QRScannerPage from './pages/QRScannerPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ContactsListPage
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchContactsPage
});

const inviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite',
  component: InviteLinksPage
});

const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan',
  component: QRScannerPage
});

const routeTree = rootRoute.addChildren([indexRoute, searchRoute, inviteRoute, scanRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center earth-gradient">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center earth-gradient p-4">
          <div className="text-center max-w-md">
            <h1 className="text-5xl font-bold mb-4 text-primary">Quick Contacts</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Manage your contacts seamlessly with invite links, QR codes, and username search
            </p>
            <LoginButton />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
      {showProfileSetup && <ProfileSetupModal />}
    </ThemeProvider>
  );
}

function LoginButton() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <button
      onClick={login}
      disabled={isLoggingIn}
      className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-warm"
    >
      {isLoggingIn ? 'Connecting...' : 'Get Started'}
    </button>
  );
}

