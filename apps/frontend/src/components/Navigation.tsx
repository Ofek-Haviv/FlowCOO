import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckCircle, FolderKanban, CalendarDays, Wallet, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notifications } from '@/components/Notifications';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      // Focus the first nav item when menu opens
      const firstNavItem = mobileMenuRef.current.querySelector('a');
      firstNavItem?.focus();
    } else if (!isMobileMenuOpen && menuButtonRef.current) {
      // Return focus to menu button when menu closes
      menuButtonRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckCircle },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Calendar", path: "/calendar", icon: CalendarDays },
    { name: "Finances", path: "/finances", icon: Wallet },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          aria-label={item.name}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isActive 
              ? "bg-primary text-primary-foreground font-medium" 
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
          aria-current={(window.location.pathname === item.path ? 'page' : undefined)}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <item.icon className="h-5 w-5" aria-hidden="true" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-20 p-2" role="navigation" aria-label="Mobile navigation">
            <div className="flex justify-around items-center">
              {navItems.slice(0, 4).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex flex-col items-center p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground"
                  )}
                  aria-label={item.name}
                  aria-current={(window.location.pathname === item.path ? 'page' : undefined)}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs mt-1">{item.name}</span>
                </NavLink>
              ))}
              <div className="flex items-center gap-2">
                <Notifications />
                <Button
                  ref={menuButtonRef}
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs mt-1">More</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              ref={mobileMenuRef}
              id="mobile-menu"
              className="fixed inset-0 bg-background/95 z-30 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              <nav className="flex-1 flex flex-col items-center justify-center gap-6 text-xl" aria-label="Main navigation">
                {renderNavItems()}
              </nav>
            </div>
          )}
        </>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="w-64 border-r h-screen fixed left-0 top-0 p-6" role="navigation" aria-label="Main navigation">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold">FlowCOO</h1>
            <p className="text-xs text-muted-foreground mt-1">Your creative assistant</p>
          </div>
          <nav className="space-y-2" aria-label="Navigation links">
            {renderNavItems()}
          </nav>
          <div className="absolute bottom-6 left-6 right-6">
            <Notifications />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
