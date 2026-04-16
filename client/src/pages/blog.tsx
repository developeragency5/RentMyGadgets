import { useState } from "react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { safeFetch } from "@/lib/api";
import type { BlogPost } from "@shared/schema";
import { format } from "date-fns";

const categories = ["All", "Tech Tips", "Industry News", "How-To Guides", "Product Reviews", "Business"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog'],
    queryFn: async () => {
      const res = await safeFetch('/api/blog');
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      return res.json();
    }
  });

  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <Layout>
      <SeoHead 
        title="Tech Rental Blog"
        description="Expert tips, industry news, and guides for tech rentals. Learn how to choose the right equipment, maintenance tips, and business insights."
        keywords="tech rental tips, equipment rental guide, gadget rental blog, technology news, rental industry insights, how to rent tech, equipment maintenance"
      />
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Tech Rental <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest in tech rentals, equipment tips, and industry news to make the most of your rental experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((cat) => (
            <Button 
              key={cat} 
              variant={selectedCategory === cat ? "default" : "outline"} 
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory === "All" 
                ? "No blog posts yet. Check back soon!" 
                : `No articles found in "${selectedCategory}". Try another category.`}
            </p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`}>
                <Card className="mb-12 overflow-hidden border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow" data-testid={`featured-post-${featuredPost.slug}`}>
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto">
                      <img 
                        src={featuredPost.imageUrl || '/placeholder-blog.jpg'} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                        {featuredPost.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(featuredPost.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <Button className="w-fit" data-testid={`read-more-${featuredPost.slug}`}>
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer h-full" data-testid={`post-card-${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl || '/placeholder-blog.jpg'} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
