import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, Settings, LogOut, User as UserIcon, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { safeFetch } from "@/lib/api";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  pricePerMonth: string;
  rentalPeriod: string;
  subtotal: string;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  createdAt: string;
  items?: OrderItem[];
}

async function fetchOrders(): Promise<Order[]> {
  const res = await safeFetch("/api/orders", {
    credentials: 'include'
  });
  if (!res.ok) return [];
  return res.json();
}

async function fetchOrderDetails(orderId: string): Promise<Order | null> {
  const res = await safeFetch(`/api/orders/${orderId}`, {
    credentials: 'include'
  });
  if (!res.ok) return null;
  return res.json();
}

// Helper to display friendly name for guest users
const getDisplayName = (username: string, fullName?: string | null) => {
  if (fullName) return fullName;
  return username.startsWith('guest_') ? 'Guest' : username;
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, isLoading: authLoading } = useAuth();

  const { data: orders = [], isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: !!user
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in to view your dashboard.</p>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'active');
  const pastOrders = orders.filter(o => o.status === 'returned' || o.status === 'cancelled');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      returned: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full font-medium text-sm ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <SeoHead title="My Dashboard" description="Manage your tech rentals, view order history, and update your profile settings." keywords="rental dashboard, order history, manage rentals, user account, rental profile, track orders" />
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white" data-testid="avatar-initials">
              {getInitials(getDisplayName(user.username, user.fullName))}
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-welcome">Welcome back, {getDisplayName(user.username, user.fullName)}!</h1>
              <p className="text-muted-foreground" data-testid="text-email">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleLogout} data-testid="button-signout">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="rentals" className="w-full">
          <TabsList className="mb-8 w-full md:w-auto grid grid-cols-3 md:flex">
            <TabsTrigger value="rentals" className="gap-2" data-testid="tab-rentals">
              <Clock className="h-4 w-4" /> Active Rentals
              {activeOrders.length > 0 && (
                <span className="ml-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{activeOrders.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
              <Package className="h-4 w-4" /> Order History
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2" data-testid="tab-settings">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rentals" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Currently Rented Items</h2>
            
            {ordersLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </CardContent>
              </Card>
            ) : activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No active rentals</p>
                  <Link href="/categories">
                    <Button>Browse Gadgets</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map(order => (
                <Card key={order.id} data-testid={`order-${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Total: <strong>${order.totalAmount}</strong></p>
                          <p>Rental Period: {formatDate(order.startDate)} - {formatDate(order.endDate)}</p>
                          <p>Delivery: {order.deliveryAddress.split(',')[0]}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history">
            <h2 className="text-xl font-bold mb-4">Past Orders</h2>
            
            {ordersLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </CardContent>
              </Card>
            ) : pastOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No past orders yet</p>
                </CardContent>
              </Card>
            ) : (
              pastOrders.map(order => (
                <Card key={order.id} className="mb-4" data-testid={`past-order-${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold">Order #{order.id.slice(0, 8)}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)} • ${order.totalAmount}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" /> Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="font-medium">{user.username.startsWith('guest_') ? 'Guest' : user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{user.fullName || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline">Edit Profile</Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
