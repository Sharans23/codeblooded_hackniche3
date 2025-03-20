import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ims-hackniche3.onrender.com/api/users/auth/google/callback",
      passReqToCallback: true,  // Allows passing request object
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              picture: profile.photos[0].value,
            },
          });
        }
        
        req.session.userId = user.id; // Store user ID in session
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user to store user ID in session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

// Deserialize user by fetching from the database
passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await prisma.user.findUnique({ where: { id } }); // Fetch user from DB
    if (!user) return done(null, false);
    console.log("User found:", user);
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error);
  }
});

export default passport;