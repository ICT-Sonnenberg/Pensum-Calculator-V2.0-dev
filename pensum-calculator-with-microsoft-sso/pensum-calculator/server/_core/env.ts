export const ENV = {
  // Database
  databaseUrl: process.env.DATABASE_URL!,
  
  // Manus OAuth
  jwtSecret: process.env.JWT_SECRET!,
  oauthServerUrl: process.env.OAUTH_SERVER_URL!,
  viteOauthPortalUrl: process.env.VITE_OAUTH_PORTAL_URL!,
  viteAppId: process.env.VITE_APP_ID!,
  
  // Owner
  ownerOpenId: process.env.OWNER_OPEN_ID!,
  ownerName: process.env.OWNER_NAME!,
  
  // Microsoft OAuth
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID || 'test-client-id',
  microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'test-client-secret',
  microsoftTenantId: process.env.MICROSOFT_TENANT_ID || 'common',
  microsoftCallbackUrl: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:3000/api/auth/microsoft/callback',
  
  // Session
  sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET!,
};
