import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "wouter";
import { Calendar, User, ArrowLeft, Clock, Facebook, Twitter, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { safeFetch } from "@/lib/api";
import type { BlogPost } from "@shared/schema";
import { format } from "date-fns";

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await safeFetch(`/api/blog/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch blog post');
      return res.json();
    },
    enabled: !!slug
  });

  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['blog', 'related', post?.category],
    queryFn: async () => {
      const res = await safeFetch(`/api/blog?category=${post?.category}`);
      if (!res.ok) return [];
      const posts = await res.json();
      return posts.filter((p: BlogPost) => p.id !== post?.id).slice(0, 3);
    },
    enabled: !!post?.category
  });

  if (isLoading) {
    return (
      <Layout>
        <SeoHead title="Loading Article..." description="Loading blog article. Please wait." />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading article...
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <SeoHead title="Article Not Found" description="The requested blog article could not be found." />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const readTime = Math.max(1, Math.ceil(post.content.length / 1500));

  return (
    <Layout>
      <SeoHead 
        title={post.title}
        description={post.excerpt}
        image={post.imageUrl || undefined}
        keywords={`${post.category}, tech rental tips, ${post.title.toLowerCase().split(' ').slice(0, 3).join(', ')}, rental guide`}
        article={{
          author: post.author,
          publishedTime: post.createdAt.toString()
        }}
      />
      <StructuredData type="blog" post={post} />
      
      <article className="blog-article">
        {/* Hero Section with Featured Image */}
        {post.imageUrl && (
          <div className="w-full bg-gradient-to-b from-secondary/40 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-[960px] mx-auto pt-8 sm:pt-12">
                <div className="aspect-[2/1] sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    data-testid="post-image"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className={`${post.imageUrl ? 'pt-10 sm:pt-14' : 'pt-12 sm:pt-20'} pb-6 sm:pb-10`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mx-auto">
              {/* Back Link */}
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="mb-6 sm:mb-8 -ml-3 text-muted-foreground hover:text-foreground transition-colors" data-testid="back-to-blog">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Button>
              </Link>

              {/* Category Badge */}
              <Badge className="mb-5 sm:mb-6 bg-primary/10 text-primary hover:bg-primary/20 font-medium px-3 py-1">
                {post.category}
              </Badge>

              {/* Article Title */}
              <h1 
                className="text-[1.75rem] sm:text-4xl lg:text-[2.625rem] font-heading font-bold leading-[1.2] tracking-[-0.02em] text-foreground mb-6 sm:mb-8" 
                data-testid="post-title"
              >
                {post.title}
              </h1>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-8 gap-y-4 text-[0.9375rem] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-base" data-testid="post-author">{post.author}</div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-60" />
                  <span data-testid="post-date">{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-60" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px] mx-auto">
            <hr className="border-border/50 mb-10 sm:mb-14" />
          </div>
        </div>

        {/* Article Body */}
        <section className="pb-12 sm:pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mx-auto">
              <div 
                className="article-content"
                data-testid="post-content"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="border-t border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mx-auto py-8 sm:py-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-foreground text-lg">Enjoyed this article?</span>
                  <p className="text-muted-foreground text-sm mt-1">Share it with your network</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-11 w-11 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200" 
                    data-testid="share-facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-11 w-11 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-500 transition-all duration-200" 
                    data-testid="share-twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-11 w-11 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200" 
                    data-testid="share-linkedin"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-14 sm:py-20 bg-secondary/30 border-t border-border/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-[1100px] mx-auto">
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 sm:mb-10 text-center">
                  Related Articles
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {relatedPosts.map((relPost) => (
                    <Link key={relPost.id} href={`/blog/${relPost.slug}`}>
                      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-0 shadow-md" data-testid={`related-post-${relPost.slug}`}>
                        <div className="aspect-[16/10] overflow-hidden">
                          <img 
                            src={relPost.imageUrl || '/placeholder-blog.jpg'} 
                            alt={relPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-5 sm:p-6">
                          <Badge variant="outline" className="mb-3 text-xs font-medium">
                            {relPost.category}
                          </Badge>
                          <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                            {relPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(relPost.createdAt), 'MMM d, yyyy')}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </article>

      {/* 
        Article Typography Styles
        -------------------------
        Modern, readable blog typography following best practices:
        - Max-width: 800px for comfortable line length
        - Font size: 18px (1.125rem) for body text
        - Line height: 1.75-1.8 for optimal readability
        - Paragraph spacing: 1.5em between paragraphs
        - Clear heading hierarchy with proper spacing
      */}
      <style>{`
        /* Base article content styles */
        .article-content {
          font-size: 1.125rem;
          line-height: 1.75;
          color: hsl(var(--foreground));
          letter-spacing: -0.01em;
        }
        
        /* Paragraph styles */
        .article-content p {
          margin-bottom: 1.5em;
          color: hsl(var(--muted-foreground));
        }
        
        .article-content p:last-child {
          margin-bottom: 0;
        }
        
        /* First paragraph emphasis */
        .article-content p:first-of-type {
          font-size: 1.1875rem;
          line-height: 1.7;
          color: hsl(var(--foreground) / 0.85);
        }
        
        /* H2 Heading styles */
        .article-content h2 {
          font-size: 1.625rem;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 2.75em;
          margin-bottom: 0.875em;
          color: hsl(var(--foreground));
          letter-spacing: -0.025em;
          position: relative;
        }
        
        .article-content h2:first-child {
          margin-top: 0;
        }
        
        /* H3 Heading styles */
        .article-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 2.25em;
          margin-bottom: 0.75em;
          color: hsl(var(--foreground));
          letter-spacing: -0.015em;
        }
        
        /* List styles */
        .article-content ul,
        .article-content ol {
          margin: 1.75em 0;
          padding-left: 1.5em;
        }
        
        .article-content ul {
          list-style-type: disc;
        }
        
        .article-content ol {
          list-style-type: decimal;
        }
        
        .article-content li {
          margin-bottom: 0.625em;
          padding-left: 0.375em;
          color: hsl(var(--muted-foreground));
          line-height: 1.7;
        }
        
        .article-content li::marker {
          color: hsl(var(--primary));
        }
        
        /* Nested lists */
        .article-content li ul,
        .article-content li ol {
          margin: 0.5em 0;
        }
        
        /* Strong/bold text */
        .article-content strong,
        .article-content b {
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        
        /* Italic/emphasis text */
        .article-content em,
        .article-content i {
          font-style: italic;
        }
        
        /* Blockquote styles */
        .article-content blockquote {
          margin: 2.25em 0;
          padding: 1.5em 1.75em;
          border-left: 4px solid hsl(var(--primary));
          background: hsl(var(--secondary) / 0.4);
          border-radius: 0 0.75rem 0.75rem 0;
          font-size: 1.0625rem;
          font-style: italic;
          color: hsl(var(--foreground));
          line-height: 1.7;
        }
        
        .article-content blockquote p {
          margin-bottom: 0;
          color: inherit;
        }
        
        /* Link styles */
        .article-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
          transition: all 0.2s ease;
        }
        
        .article-content a:hover {
          text-decoration-thickness: 2px;
          opacity: 0.85;
        }
        
        /* Inline code */
        .article-content code {
          background: hsl(var(--secondary));
          padding: 0.2em 0.45em;
          border-radius: 0.3rem;
          font-size: 0.875em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          color: hsl(var(--foreground));
        }
        
        /* Code blocks */
        .article-content pre {
          background: hsl(var(--secondary));
          padding: 1.5em;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2em 0;
          font-size: 0.875rem;
          line-height: 1.65;
        }
        
        .article-content pre code {
          background: none;
          padding: 0;
          font-size: inherit;
        }
        
        /* Image styles */
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2.5em auto;
          display: block;
          box-shadow: 0 4px 20px hsl(var(--foreground) / 0.08);
        }
        
        /* Horizontal rule */
        .article-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, hsl(var(--border)), transparent);
          margin: 3.5em 0;
        }
        
        /* Table styles */
        .article-content table {
          width: 100%;
          margin: 2em 0;
          border-collapse: collapse;
          font-size: 0.9375rem;
        }
        
        .article-content th,
        .article-content td {
          padding: 0.875em 1em;
          border: 1px solid hsl(var(--border));
          text-align: left;
        }
        
        .article-content th {
          background: hsl(var(--secondary) / 0.5);
          font-weight: 600;
        }
        
        /* Mobile responsive typography */
        @media (max-width: 640px) {
          .article-content {
            font-size: 1.0625rem;
            line-height: 1.7;
          }
          
          .article-content p:first-of-type {
            font-size: 1.125rem;
          }
          
          .article-content h2 {
            font-size: 1.375rem;
            margin-top: 2.25em;
          }
          
          .article-content h3 {
            font-size: 1.1875rem;
            margin-top: 1.875em;
          }
          
          .article-content blockquote {
            padding: 1.25em 1.25em;
            margin: 1.75em 0;
          }
          
          .article-content ul,
          .article-content ol {
            padding-left: 1.25em;
          }
        }
        
        /* Tablet adjustments */
        @media (min-width: 641px) and (max-width: 1024px) {
          .article-content {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </Layout>
  );
}

/**
 * Format raw content into semantic HTML
 * Supports: headings, bold, italic, blockquotes, lists, paragraphs
 */
function formatContent(content: string): string {
  let html = content
    .replace(/^### (.+)$/gm, '</p><h3>$1</h3><p>')
    .replace(/^## (.+)$/gm, '</p><h2>$1</h2><p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '</p><blockquote><p>$1</p></blockquote><p>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23]>)/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>)/g, '$1')
    .replace(/(<\/blockquote>)<\/p>/g, '$1');
  
  html = html.replace(/(<li>[^<]*<\/li>)+/g, '<ul>$&</ul>');
  
  return html;
}
