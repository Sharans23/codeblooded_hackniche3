import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth-context";

export default function Login() {
  const { login, user } = useAuth(); 
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState(""); // For the name field
  const [location, setLocation] = useState(""); // Added location field
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("userRole", selectedRole);
    // Reset signup view when changing roles
    setIsSignup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (role === "client") {
      try {
        // Different endpoints for login vs signup
        const endpoint = isSignup 
          ? "https://ims-hackniche3.onrender.com/api/clients/register" 
          : "https://ims-hackniche3.onrender.com/api/clients/login";
        
        // Different payload for signup vs login
        const payload = isSignup 
          ? {
              name: shopName,
              email: username,
              password: password,
              location: location
            }
          : {
              email: username, 
              password: password
            };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          // Store the token as authToken in localStorage
          localStorage.setItem("authToken", data.token);
          login({ name: username, location: "north", role: "client" });
          navigate("/client-dashboard");
        } else {
          // Handle failure
          const errorData = await response.json();
          alert(errorData.message || (isSignup ? "Signup failed" : "Login failed"));
        }
      } catch (error) {
        console.error(isSignup ? "Signup error:" : "Login error:", error);
        alert(`An error occurred during ${isSignup ? "signup" : "login"}`);
      }
    } else {
      // Keep the original admin login flow
      login({ name: username, location: "north" });
      localStorage.setItem("userRole", role);
      navigate("/client-dashboard");
    }
  };
    
  const handleGoogleLogin = () => {
    window.location.href = "https://ims-hackniche3.onrender.com/api/users/auth/google";
    localStorage.setItem("userRole", role);
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    // Reset form fields when toggling
    setUsername("");
    setPassword("");
    setShopName("");
    setLocation("");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-muted/40">
      <Card className="w-[350px]">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl text-center">Inventory Management</CardTitle>
          <div className="flex justify-between">
            <Button
              variant={role === "admin" ? "default" : "outline"}
              className="w-1/2 mr-1"
              onClick={() => handleRoleSelection("admin")}
            >
              Warehouse Admin
            </Button>
            <Button
              variant={role === "client" ? "default" : "outline"}
              className="w-1/2 ml-1"
              onClick={() => handleRoleSelection("client")}
            >
              Shop Owner
            </Button>
            
          </div>
          <CardDescription className="text-center">
            {role ? (role === "admin" ? "Admin Login Panel" : `Shop Owner ${isSignup ? "Signup" : "Login"} Panel`) : "Please select a role"}
          </CardDescription>
          
          {/* Login/Signup toggle for Client role */}
          {role === "client" && (
            <div className="flex justify-center mt-2">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant={!isSignup ? "default" : "outline"}
                  className="rounded-none"
                  onClick={() => setIsSignup(false)}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant={isSignup ? "default" : "outline"}
                  className="rounded-none"
                  onClick={() => setIsSignup(true)}
                >
                  Signup
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shop Name field (only for client signup) */}
            {role === "client" && isSignup && (
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">
                {role === "client" ? "Email" : "Username"}
              </Label>
              <Input
                id="username"
                placeholder={role === "client" ? "Enter your email" : "Enter your username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Location field (only for client signup) */}
            {role === "client" && isSignup && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your shop location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {role === "client" ? (isSignup ? "Sign Up" : "Sign In") : "Sign In"}
            </Button>
            
            {/* Toggle link */}
            {role === "client" && (
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-blue-500 hover:underline text-sm"
                >
                  {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                </button>
              </div>
            )}
          </form>
          {role === "admin" && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleGoogleLogin} variant="outline">
                Sign in with Google
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}