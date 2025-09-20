import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const SignInForm = lazy(() => import("@/components/auth/SignInForm").then(module => ({ default: module.SignInForm })));
const SignUpForm = lazy(() => import("@/components/auth/SignUpForm").then(module => ({ default: module.SignUpForm })));
const StoriesPage = lazy(() => import("./pages/Stories").then(module => ({ default: module.StoriesPage })));
const CreateStory = lazy(() => import("./pages/CreateStory").then(module => ({ default: module.CreateStory })));
const StoryDetail = lazy(() => import("./pages/StoryDetail").then(module => ({ default: module.StoryDetail })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/auth/signin" element={<SignInForm />} />
              <Route path="/auth/signup" element={<SignUpForm />} />
              <Route path="/" element={
                <AppLayout>
                  <Home />
                </AppLayout>
              } />
              <Route path="/stories" element={
                <AppLayout>
                  <StoriesPage />
                </AppLayout>
              } />
              <Route path="/create-story" element={
                <AppLayout>
                  <CreateStory />
                </AppLayout>
              } />
              <Route path="/story/:id" element={
                <AppLayout>
                  <StoryDetail />
                </AppLayout>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
