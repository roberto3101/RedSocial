import passport from "passport";
// import GoogleStrategy from "passport-google-oauth20";
// import FacebookStrategy from "passport-facebook";
// import GithubStrategy from "passport-github2";
import { findByEmail, upsert } from "./userStore.js";
import "dotenv/config";   // carga .env

async function verify(_, __, profile, done) {
  const email = profile.emails?.[0]?.value;
  if (!email) return done(null, false);
  const user = await upsert({ id: profile.id, email, verified: true, oauth: profile.provider });
  done(null, user);
}

/* Google - COMENTADO TEMPORALMENTE para evitar crashes
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: "/auth/google/callback",
}, verify));
*/

/* Facebook - COMENTADO TEMPORALMENTE para evitar crashes  
passport.use(new FacebookStrategy({
  clientID: process.env.FB_ID,
  clientSecret: process.env.FB_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ["id", "displayName", "emails"],
}, verify));
*/

/* GitHub - COMENTADO TEMPORALMENTE para evitar crashes (credenciales dummy)
passport.use(new GithubStrategy({
  clientID: process.env.GH_ID,
  clientSecret: process.env.GH_SECRET,
  callbackURL: "/auth/github/callback",
  scope: ["user:email"],
}, verify));
*/

passport.serializeUser((u, done) => done(null, u.id));
passport.deserializeUser(async (id, done) => {
  const user = await findByEmail(id); // id==email para estrategias con id=email
  done(null, user || null);
});