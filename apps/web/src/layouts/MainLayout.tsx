import React, { useMemo, useState } from 'react';
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useUserStore } from '../stores/userStore';

type MainLayoutProps = {
  children: React.ReactNode;
  currentRoute: string;
  onRouteChange: (route: string) => void;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentRoute, onRouteChange }) => {
  const { theme, setTheme } = useThemeStore();
  const { currentUser } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardRoute = useMemo(
    () => currentRoute === '/dashboard' || currentRoute.startsWith('/donor/dashboard') || currentRoute.startsWith('/receiver/dashboard'),
    [currentRoute],
  );

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Donor Operations', path: '/donor/dashboard' },
    { label: 'Receiver Dashboard', path: '/receiver/dashboard' },
    { label: 'Food Intake', path: '/donate' },
    { label: 'NGO Network', path: '/organizations' },
    { label: 'Appeals', path: '/requests' },
    { label: 'Admin', path: '/admin' },
  ];

  const handleNav = (path: string) => {
    onRouteChange(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) =>
    currentRoute === path ||
    (path === '/organizations' && currentRoute.startsWith('/organizations')) ||
    (path === '/donor/dashboard' && currentRoute === '/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
          <button onClick={() => handleNav('/')} className="flex items-center gap-3" aria-label="FoodBridge home">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
              <img src="/logo.png" alt="FoodBridge logo" className="h-full w-full object-cover" />
            </span>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-base font-bold tracking-tight">FoodBridge</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Powered by Gemma</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <button className="lg:hidden rounded-md border border-border bg-card p-2 hover:bg-muted" onClick={() => setMobileMenuOpen((o) => !o)} aria-label="Toggle navigation">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-card px-4 py-3 md:px-8 lg:hidden">
            <div className="grid gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`rounded-md border px-3 py-2 text-left text-sm font-medium ${
                    isActive(item.path) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        {isDashboardRoute && (
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-border bg-muted/30 md:flex md:flex-col">
            <div className="px-6 py-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">FoodBridge</p>
              <p className="mt-2 text-sm font-semibold text-foreground">Operations Portal</p>
            </div>

            <nav className="flex-1 px-3">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex w-full items-center gap-3 rounded-r-md border-l-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="px-4 py-4">
              <button
                onClick={() => handleNav(currentUser?.role === 'RECEIVER' ? '/receiver/dashboard' : '/donor/dashboard')}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Search className="h-4 w-4" /> New Donation
              </button>
            </div>
          </aside>
        )}

        <main className={`flex min-h-[calc(100vh-4rem)] flex-1 flex-col ${isDashboardRoute ? 'px-4 py-4 md:px-6 md:py-6' : 'px-4 py-6 md:px-8 md:py-8'}`}>
          {children}
        </main>
      </div>

      {!isDashboardRoute && (
        <footer className="border-t border-border bg-card/80 py-6">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground md:flex-row md:px-8">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <img src="/logo.png" alt="FoodBridge logo" className="h-4 w-4 rounded-sm object-cover" />
                FoodBridge
              </span>
              <span>Humanitarian surplus food coordination</span>
              <span className="rounded-md border border-border px-2 py-0.5 font-medium">Powered by Gemma</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleNav('/about')} className="text-primary hover:text-warning transition-colors font-semibold">Mission</button>
              <button onClick={() => handleNav('/contact')} className="text-primary hover:text-warning transition-colors font-semibold">Support</button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
