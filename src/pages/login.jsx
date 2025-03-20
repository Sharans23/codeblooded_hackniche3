// "use client";

// import { useState } from "react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { useAuth } from "../lib/auth-context";

// export default function Login() {
//   const { login } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("admin");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     login({ name: username, location: "north" });
//     localStorage.setItem("userRole", role); // Store role for later use
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:5000/api/users/auth/google";
//     localStorage.setItem("userRole", role);
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-muted/40">
//       <Card className="w-[350px]">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl">Inventory Management</CardTitle>
//           <CardDescription>Enter your credentials to sign in</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 placeholder="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="role">Are you logging in as:</Label>
//               <select
//                 id="role"
//                 className="w-full border rounded-md p-2"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//               >
//                 <option value="admin">Warehouse Admin</option>
//                 <option value="client">Shop Owner</option>
//               </select>
//             </div>
//             <Button type="submit" className="w-full">
//               Sign In
//             </Button>
//           </form>
//           <div className="mt-4 flex justify-center">
//             <Button onClick={handleGoogleLogin} variant="outline">
//               Sign in with Google
//             </Button>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <p className="text-xs text-center w-full text-muted-foreground">
//             For demo purposes, any username and password will work
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }





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
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("userRole", selectedRole);
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  login({ name: username, location: "north" });
  localStorage.setItem("userRole", role); // Store role for later use

  // Navigate based on role
 if (role === "client") {
    navigate("/client-dashboard");
  }
};
    
      const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/users/auth/google";
        localStorage.setItem("userRole", role);
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
            {role ? (role === "admin" ? "Admin Login Panel" : "Shop Owner Login Panel") : "Please select a role"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
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
            <Button type="submit" className="w-full">
              Sign In
            </Button>
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