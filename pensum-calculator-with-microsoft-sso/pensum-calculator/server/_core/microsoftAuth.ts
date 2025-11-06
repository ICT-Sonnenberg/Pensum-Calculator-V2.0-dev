import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { ENV } from './env.js';
import { upsertUser } from '../db.js';

/**
 * Configure Microsoft OAuth Strategy
 */
export function configureMicrosoftAuth() {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: ENV.microsoftClientId,
        clientSecret: ENV.microsoftClientSecret,
        callbackURL: ENV.microsoftCallbackUrl,
        tenant: ENV.microsoftTenantId,
        scope: ['user.read'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user information from Microsoft profile
          const microsoftId = profile.id;
          const email = profile.emails?.[0]?.value || '';
          const name = profile.displayName || '';

          // Upsert user in database
          await upsertUser({
            microsoftId,
            email,
            name,
            loginMethod: 'microsoft',
            lastSignedIn: new Date(),
          });

          // Return user profile
          done(null, {
            microsoftId,
            email,
            name,
            loginMethod: 'microsoft',
          });
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}
