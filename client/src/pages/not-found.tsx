import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";

export default function NotFound() {
  return (
    <Layout>
      <SeoHead 
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved. Browse our tech rental catalog to find laptops, cameras, and more."
        keywords="404, page not found, error page, RentMyGadgets"
      />
      <div className="container mx-auto px-4 py-20">
        <Card className="w-full max-w-lg mx-auto">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-muted-foreground mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto" data-testid="button-go-home">
                  <Home className="h-4 w-4 mr-2" /> Go to Homepage
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto" data-testid="button-go-back">
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
