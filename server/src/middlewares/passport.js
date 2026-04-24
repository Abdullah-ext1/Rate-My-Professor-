import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from "../models/users.models.js"

export default function configurePassport() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    console.log("Callback URL:", process.env. CALLBACK_URL)
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if(existingUser){
        existingUser.avatar = profile.photos[0].value;
        await existingUser.save();
        return done(null, existingUser);
      }

      const user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        googleId: profile.id,
      });

      await user.save();
      done(null, user);
    } catch (error) {
      console.error('Error in Google Strategy:', error);
      done(error, null);
    }
  }));
}