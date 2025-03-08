import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Replacing Next.js router
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Warehouse } from "lucide-react";

export default function Loginpage() {
  const { user, login } = useAuth();
  const navigate = useNavigate(); // ✅ Using React Router instead of Next.js

  useEffect(() => {
    if (user) {
      if (user.role === "warehouse") {
        navigate("/warehouse"); // ✅ Corrected navigation
      } else if (user.role === "client") {
        navigate("/client");
      }
    }
  }, [user, navigate]);

  const handleLogin = (e, role) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    login({ email, password, role });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Inventory Management System
          </CardTitle>
          <CardDescription>Login to access your portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="warehouse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="warehouse"
                className="flex items-center gap-2"
              >
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Warehouse</span>
              </TabsTrigger>
              <TabsTrigger value="client" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Client</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="warehouse">
              <form
                onSubmit={(e) => handleLogin(e, "warehouse")}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="warehouse@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Warehouse Location</Label>
                  <Select name="location" defaultValue="north">
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North Warehouse</SelectItem>
                      <SelectItem value="south">South Warehouse</SelectItem>
                      <SelectItem value="east">East Warehouse</SelectItem>
                      <SelectItem value="west">West Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Login as Warehouse Manager
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="client">
              <form
                onSubmit={(e) => handleLogin(e, "client")}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="client@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login as Client
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Demo credentials are pre-filled. Just click login.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
