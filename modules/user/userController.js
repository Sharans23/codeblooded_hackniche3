import prisma from "../../utils/prisma.js";
import passport from "passport";

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// export const googleAuthCallback = passport.authenticate("google", {
//   successRedirect: "http://localhost:5173/dashboard",
//   failureRedirect: "http://localhost:5173/login",
// });
export const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    
    if (err || !user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      // console.log(user)
      // res.json({ success: true, message: "Authenticated successfully", user });
      // localStorage.setItem("id",user.id)
      // localStorage.setItem("warehouseId",user.warehouse.warehouseId)
      // res.

      res.redirect(`https://codeblooded-hackniche3.vercel.app/dashboard/${user.id}`);
    });
  })(req, res, next);
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { warehouse: true },
    });
    res.json(user);
    console.log(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

export const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};

// import { PrismaClient } from "@prisma/client";
// import { ApiError } from "../utils/errorHandler.js";

// const prisma = new PrismaClient();

// // ✅ Get User Profile
// export const getUserProfile = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true, name: true, picture: true },
//     });

//     if (!user) throw new ApiError("User not found", 404);
//     res.json({ success: true, user });
//   } catch (err) {
//     next(err);
//   }
// };

// // ✅ Delete User
// export const deleteUser = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     await prisma.user.delete({ where: { id: userId } });
//     res.json({ success: true, message: "User deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };
