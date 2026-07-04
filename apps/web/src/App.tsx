import { useState, useEffect, Suspense, lazy } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { PageContainer } from './layouts/PageContainer';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';

// Eager-loaded (fast first paint)
import { Home } from './pages/Home';
import { RoleSelection } from './pages/RoleSelection';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

// Lazy-loaded (heavy pages)
const Dashboard        = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const ReceiverDashboard = lazy(() => import('./pages/ReceiverDashboard').then((m) => ({ default: m.ReceiverDashboard })));
const DonationDetails  = lazy(() => import('./pages/DonationDetails').then((m) => ({ default: m.DonationDetails })));
const DonateNew        = lazy(() => import('./pages/DonateNew').then((m) => ({ default: m.DonateNew })));
const OrgDiscover      = lazy(() => import('./pages/OrgDiscover').then((m) => ({ default: m.OrgDiscover })));
const OrgDetails       = lazy(() => import('./pages/OrgDetails').then((m) => ({ default: m.OrgDetails })));
const Admin            = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })));
const Profile          = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const Requests         = lazy(() => import('./pages/Requests').then((m) => ({ default: m.Requests })));

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-xs text-slate-400 font-semibold">Loading…</p>
    </div>
  </div>
);

export default function App() {
  const [route, setRoute] = useState<string>('/');

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    const path = window.location.pathname;
    if (path) setRoute(path);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    // Dynamic: /organizations/:id
    if (route.startsWith('/organizations/')) {
      const parts = route.split('/');
      if (parts.length === 3) {
        const id = parts[2];
        if (id === 'discover') return <OrgDiscover onNavigate={navigate} />;
        return <OrgDetails orgId={id} onBack={() => navigate('/organizations/discover')} />;
      }
    }

    // Dynamic: /donations/:id
    if (route.startsWith('/donations/')) {
      const parts = route.split('/');
      if (parts.length === 3) {
        const id = parts[2];
        return (
          <DonationDetails
            listingId={id}
            onBack={() => navigate('/donor/dashboard')}
            onNavigate={navigate}
          />
        );
      }
    }

    switch (route) {
      case '/':                   return <Home onNavigate={navigate} />;
      case '/role-selection':     return <RoleSelection onNavigate={navigate} />;
      case '/donor/dashboard':
      case '/dashboard':          return <Dashboard onNavigate={navigate} />;
      case '/receiver/dashboard': return <ReceiverDashboard onNavigate={navigate} />;
      case '/about':              return <About />;
      case '/contact':            return <Contact />;
      case '/donate':
      case '/donate/new':         return <DonateNew />;
      case '/organizations':
      case '/organizations/discover': return <OrgDiscover onNavigate={navigate} />;
      case '/requests':           return <Requests />;
      case '/profile':            return <Profile />;
      case '/admin':              return <Admin />;
      default:                    return <NotFound onRouteChange={navigate} />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <MainLayout currentRoute={route} onRouteChange={navigate}>
          <PageContainer>
            <Suspense fallback={<PageLoader />}>
              {renderPage()}
            </Suspense>
          </PageContainer>
        </MainLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}
