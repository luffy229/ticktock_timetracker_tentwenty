import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/api/mockApi";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.login(email, password);
      onLogin(email, password);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-normal text-foreground mb-1">Welcome back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-normal text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-border bg-background text-sm"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-normal text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 border-border bg-background text-sm"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <input type="checkbox" className="mr-2" />
              Remember me
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            © 2025 tentwenty™. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Blue Background with Branding */}
      <div className="flex-1 bg-primary flex items-center justify-center px-6 sm:px-12 py-8 lg:py-0">
        <div className="text-center text-white max-w-md">
          <h2 className="text-4xl font-normal mb-6">ticktock</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Introducing our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
};