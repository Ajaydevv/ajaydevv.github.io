import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { PenTool, Home, BookOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Stories", url: "/stories", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-header">
        <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg blog-gradient flex items-center justify-center shadow-lg">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blog-primary to-blog-accent bg-clip-text text-transparent">
              AJ Writes
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg glass-nav-item ${
                    isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            ))}
            
            {isAdmin && (
              <NavLink
                to="/create-story"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg glass-nav-item ${
                    isActive
                      ? "bg-blog-primary/20 text-blog-primary shadow-md"
                      : "text-blog-primary/80 hover:text-blog-primary hover:bg-blog-primary/10"
                  }`
                }
              >
                <PenTool className="w-4 h-4" />
                <span className="font-medium">Create Story</span>
              </NavLink>
            )}
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end={item.url === "/"}
                  className={({ isActive }) =>
                    `p-2 rounded-lg glass-nav-item ${
                      isActive
                        ? "bg-white/20 text-white shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                </NavLink>
              ))}
              
              {isAdmin && (
                <NavLink
                  to="/create-story"
                  className={({ isActive }) =>
                    `p-2 rounded-lg glass-nav-item ${
                      isActive
                        ? "bg-blog-primary/20 text-blog-primary shadow-md"
                        : "text-blog-primary/80 hover:text-blog-primary hover:bg-blog-primary/10"
                    }`
                  }
                >
                  <PenTool className="w-4 h-4" />
                </NavLink>
              )}
            </div>
            
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 min-h-screen bg-gradient-to-br from-blog-surface via-background to-blog-muted/20">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-blog-primary/30 bg-gradient-to-r from-blog-surface via-blog-surface-elevated to-blog-surface backdrop-blur-sm shadow-[0_-10px_40px_rgba(139,95,255,0.1)]">
          <div className="container mx-auto px-6 py-6 max-w-7xl">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Made with ❤️ by{" "}
                <a 
                  href="https://github.com/jayadevvasudevan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blog-primary hover:text-blog-accent transition-colors font-medium hover:underline"
                >
                  jayadev
                </a>
              </div>
              <div className="text-xs text-muted-foreground/70">
                Powered by creativity and built with passion ✨
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}