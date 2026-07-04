import React, { useState } from 'react';
import { Bell, Menu, Moon, Sun, X, Wheat } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useUserStore } from '../stores/userStore';

type MainLayoutProps = {
  children: React.ReactNode;
  currentRoute: string;
  onRouteChange: (route: string) => void;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentRoute, onRouteChange }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { currentUser } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Donor Operations', path: '/donor/dashboard' },
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-7 min-w-0">
            <button onClick={() => handleNav('/')} className="flex shrink-0 items-center gap-2" aria-label="FoodBridge home">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Wheat className="h-5 w-5" />
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-base font-extrabold tracking-tight">FoodBridge</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Powered by Gemma</span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`rounded-md px-3 py-2 transition-colors ${
                    isActive(item.path)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleTheme} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-warning" />
            </button>
            {currentUser && (
              <button
                onClick={() => handleNav(currentUser.role === 'RECEIVER' ? '/receiver/dashboard' : '/donor/dashboard')}
                className="hidden sm:flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 hover:bg-muted"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {currentUser.name[0]}
                </span>
                <span className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold">{currentUser.name}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{currentUser.role?.toLowerCase()} representative</span>
                </span>
              </button>
            )}
            <button className="lg:hidden rounded-md p-2 hover:bg-muted" onClick={() => setMobileMenuOpen((o) => !o)} aria-label="Toggle navigation">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold ${
                  isActive(item.path) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <main className="flex min-h-[calc(100vh-12rem)] flex-1 flex-col">{children}</main>
      </div>

      <footer className="border-t border-border bg-card/70 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="font-bold text-foreground">FoodBridge</span>
            <span>Humanitarian surplus food coordination</span>
            <span className="rounded-full border border-border px-2 py-0.5 font-semibold">Powered by Gemma</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleNav('/about')} className="hover:text-primary">Mission</button>
            <button onClick={() => handleNav('/contact')} className="hover:text-primary">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
