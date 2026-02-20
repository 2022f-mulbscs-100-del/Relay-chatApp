import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "../../services/Auth/index.js";


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
             
                const email = profile.emails[0].value;
                const userExists = await AuthService.userExists(email);
                
                if (userExists) {
                    const { user } = await AuthService.FindUserByEmail(email);
                 
                    return done(null, user);  
                }
                
                const newUser = await AuthService.createUser(profile.displayName, email);
                newUser.isSocialLogin = true;
                await newUser.save();
                await AuthService.createAuthRecord(newUser.id, "google");
            
                return done(null, newUser);  
            } catch (error) {
                console.error("Google OAuth error:", error.message);
                return done(error);
            }
        }
    )
)

export default passport;