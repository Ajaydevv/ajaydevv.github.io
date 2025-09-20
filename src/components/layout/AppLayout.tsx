import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isAdmin } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-blog-surface-elevated border-b border-border backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg blog-gradient flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blog-primary to-blog-accent bg-clip-text text-transparent">
                  AJ Writes
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <PenTool className="w-4 h-4 mr-2" />
                  Write Story
                </Button>
              )}
              <UserMenu />
            </div>
          </div>
        </header>

        <AppSidebar />
        
        <main className="flex-1 pt-16 min-h-screen bg-gradient-to-br from-blog-surface via-background to-blog-muted/20">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="border-t border-border bg-blog-surface-elevated/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4 max-w-7xl">
              <div className="text-center text-sm text-muted-foreground">
                Made with ❤️ by{" "}
                <a 
                  href="https://github.com/jayadevvasudevan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blog-primary hover:text-blog-accent transition-colors font-medium"
                >
                  jayadev
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}