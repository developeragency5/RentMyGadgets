import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Loader2, User } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, loginAsGuest, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginForm.username, loginForm.password);
      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      setLocation("/");
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (registerForm.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        fullName: registerForm.fullName || undefined
      });
      toast({ title: "Welcome!", description: "Your account has been created successfully." });
      setLocation("/");
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
      toast({ title: "Welcome, Guest!", description: "You can browse and shop. Create an account anytime to save your data." });
      setLocation("/");
    } catch (error: any) {
      toast({ title: "Guest login failed", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <SeoHead title="Sign In" description="Sign in to your RentMyGadgets account or create a new one to start renting tech equipment." keywords="sign in rental account, create rental account, rental account benefits, track rental orders, order history, rental rewards, manage rentals, save favorites" />
      <div className="container max-w-md mx-auto py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Welcome to RentMyGadgets</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      data-testid="input-login-username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      data-testid="input-login-password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-login">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-fullname">Full Name</Label>
                    <Input
                      id="register-fullname"
                      data-testid="input-register-fullname"
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      data-testid="input-register-username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      data-testid="input-register-email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      data-testid="input-register-password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      data-testid="input-register-confirm"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-register">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGuestLogin}
              disabled={isLoading}
              data-testid="button-guest-login"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <User className="h-4 w-4 mr-2" />
              )}
              Continue as Guest
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Browse and shop without an account. You can create one later.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
