import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModernButton } from "@/components/ui/modern-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DarkVeil from "@/components/ui/DarkVeil";
import SplitText from "@/components/ui/SplitText";
import { useAuth } from "@/hooks/useAuth";
import { storiesService, type Story } from "@/lib/database";
import { PenTool, Heart, MessageCircle, TrendingUp, Clock, User, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalStories: number;
  totalLikes: number;
  totalComments: number;
  totalUsers: number;
}

export default function Home() {
  const { user } = useAuth();
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalLikes: 0,
    totalComments: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load recent stories (limit to 3)
      const stories = await storiesService.getStories(user?.id);
      setRecentStories(stories.slice(0, 3));

      // Calculate stats from stories data
      const totalStories = stories.length;
      const totalLikes = stories.reduce((sum, story) => sum + (story.likes_count || 0), 0);
      const totalComments = stories.reduce((sum, story) => sum + (story.comments_count || 0), 0);
      const uniqueAuthors = new Set(stories.map(story => story.author_id)).size;

      setStats({
        totalStories,
        totalLikes,
        totalComments,
        totalUsers: uniqueAuthors,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const dashboardCards = [
    { 
      label: "Total Stories", 
      value: stats.totalStories.toString(), 
      icon: BookOpen,
      color: "text-blue-600"
    },
    { 
      label: "Total Likes", 
      value: stats.totalLikes.toString(), 
      icon: Heart,
      color: "text-red-500"
    },
    { 
      label: "Total Comments", 
      value: stats.totalComments.toString(), 
      icon: MessageCircle,
      color: "text-green-600"
    },
    { 
      label: "Active Writers", 
      value: stats.totalUsers.toString(), 
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* DarkVeil Neural Network Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DarkVeil
          hueShift={270}
          noiseIntensity={0.05}
          scanlineIntensity={0.05}
          speed={0.4}
          scanlineFrequency={1.0}
          warpAmount={0.15}
          resolutionScale={1.0}
        />
        {/* Enhanced overlay for dark purple background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blog-primary/10 via-transparent to-blog-accent/8 mix-blend-screen" />
      </div>
      
      {/* Content with relative positioning */}
      <div className="relative z-10 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <SplitText
            text="Welcome to AjayDev's Stories App"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            tag="h1"
            splitType="chars"
            delay={300}
            duration={0.6}
            ease="back.out(1.7)"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
          />
          <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-2xl mx-auto font-medium drop-shadow-sm">
            Discover amazing stories from our community. Feel free to leave comments and likes 
            to show your appreciation for great storytelling!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton asChild size="lg">
              <Link to="/stories">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore All Stories
              </Link>
            </ModernButton>
            {user ? (
              user.role === 'admin' ? (
                <Button asChild variant="outline" size="lg" className="border-blog-primary/20 hover:bg-blog-primary/5">
                  <Link to="/create-story">
                    <PenTool className="mr-2 h-5 w-5" />
                    Write Your Story
                  </Link>
                </Button>
              ) : null
            ) : (
              <ModernButton asChild variant="outline" size="lg">
                <Link to="/auth/signup">
                  Join Our Community
                </Link>
              </ModernButton>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Community Dashboard</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="text-center animate-pulse">
                <CardContent className="pt-6">
                  <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardCards.map((stat, index) => (
              <Card key={stat.label} className="text-center shadow-blog-card hover:shadow-blog-elegant transition-all duration-300 hover:scale-105 animate-fade-in backdrop-blur-sm bg-card/90 border-border/50" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-blog-primary">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent Stories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recent Stories</h2>
          <Button asChild variant="outline">
            <Link to="/stories">View All Stories</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentStories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentStories.map((story, index) => (
              <Card key={story.id} className="story-card overflow-hidden group animate-fade-in hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-card/90 border-border/50" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Story
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {story.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {story.comments_count || 0}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-blog-primary transition-colors">
                    <Link to="/stories" className="hover:underline">
                      {story.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {story.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {story.author_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(story.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Stories Yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share a story with our community!</p>
              {user && (
                <Button asChild>
                  <Link to="/create-story">
                    <PenTool className="mr-2 h-4 w-4" />
                    Write the First Story
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 px-4 bg-gradient-to-r from-blog-primary/10 via-blog-surface to-blog-primary/5 rounded-2xl backdrop-blur-sm border border-blog-primary/20 shadow-[0_0_50px_rgba(139,95,255,0.15)]">
        {user ? (
          user.role === 'admin' ? (
            <>
              <h3 className="text-2xl font-bold mb-4">Ready to Share Your Story?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                As an administrator, you can create and share stories with the community!
              </p>
              <ModernButton asChild size="lg">
                <Link to="/create-story">
                  <PenTool className="mr-2 h-5 w-5" />
                  Create New Story
                </Link>
              </ModernButton>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-4">Welcome to Our Community!</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Enjoy reading amazing stories, leave likes and comments to show your appreciation!
              </p>
              <ModernButton asChild size="lg">
                <Link to="/stories">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Stories
                </Link>
              </ModernButton>
            </>
          )
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">Join to like and comment on Ajaydev's stories</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Sign up today to share your thoughts, connect with other Ajaydev, and engage with amazing content!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton asChild size="lg">
                <Link to="/auth/signup">
                  Get Started Today
                </Link>
              </ModernButton>
              <ModernButton asChild variant="outline" size="lg">
                <Link to="/auth/signin">
                  Already have an account?
                </Link>
              </ModernButton>
            </div>
          </>
        )}
      </section>
      </div>
    </div>
  );
}