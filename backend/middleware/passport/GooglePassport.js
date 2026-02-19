import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "../../services/Auth/index.js";

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                console.log("Google Profile Email:", profile.emails[0].value);
                const email = profile.emails[0].value;
                const userExists = await AuthService.userExists(email);
                
                if (userExists) {
                    const { user } = await AuthService.FindUserByEmail(email);
                    console.log("User found, returning:", user.id);
                    return done(null, user);  
                }
                
                const newUser = await AuthService.createUser(profile.displayName, email);
                await AuthService.createAuthRecord(newUser.id, "google");
                console.log("New user created:", newUser.id);
                return done(null, newUser);  
            } catch (error) {
                console.error("Google OAuth error:", error.message);
                return done(error);
            }
        }
    )
)

export default passport;