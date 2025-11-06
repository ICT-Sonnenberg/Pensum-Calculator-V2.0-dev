# Pensum Calculator mit Microsoft SSO

Dieses Projekt ist eine Web-Anwendung zur Verwaltung von Klient*innen und Berechnung von Arbeitspensen mit integrierter Microsoft Single Sign-On (SSO) Authentifizierung.

## Features

- ✅ **Dual-Authentication**: Microsoft OAuth SSO + Manus OAuth
- ✅ **Multi-Provider Support**: Benutzer können sich mit verschiedenen Methoden anmelden
- ✅ **tRPC API**: Type-safe API mit React Query
- ✅ **Database**: MySQL/TiDB mit Drizzle ORM
- ✅ **Role-based Access**: Admin und User Rollen
- ✅ **Dashboard**: Statistiken und Übersichten

## Technologie-Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Wouter
- **Backend**: Express, tRPC 11, Passport.js
- **Database**: MySQL/TiDB mit Drizzle ORM
- **Auth**: Microsoft OAuth 2.0, Manus OAuth

## Installation

```bash
# Dependencies installieren
pnpm install

# Datenbank-Schema pushen
pnpm db:push

# Development Server starten
pnpm dev
```

## Microsoft SSO Konfiguration

### 1. Azure AD App Registration

1. Gehen Sie zum [Azure Portal](https://portal.azure.com)
2. Navigieren Sie zu "Azure Active Directory" > "App registrations"
3. Klicken Sie auf "New registration"
4. Geben Sie einen Namen ein (z.B. "Pensum Calculator")
5. Wählen Sie "Accounts in this organizational directory only" oder "Accounts in any organizational directory"
6. Fügen Sie Redirect URI hinzu: `http://localhost:3000/api/auth/microsoft/callback`
7. Klicken Sie auf "Register"

### 2. Client Secret erstellen

1. Gehen Sie zu "Certificates & secrets"
2. Klicken Sie auf "New client secret"
3. Geben Sie eine Beschreibung ein und wählen Sie eine Gültigkeit
4. Kopieren Sie den **Client Secret Value** (wird nur einmal angezeigt!)

### 3. API Permissions

1. Gehen Sie zu "API permissions"
2. Klicken Sie auf "Add a permission"
3. Wählen Sie "Microsoft Graph"
4. Wählen Sie "Delegated permissions"
5. Fügen Sie hinzu: `User.Read`
6. Klicken Sie auf "Grant admin consent"

### 4. Environment Variablen

Fügen Sie folgende Variablen zu Ihren Secrets hinzu (über Manus UI oder `.env`):

```env
MICROSOFT_CLIENT_ID=<Ihre Application (client) ID>
MICROSOFT_CLIENT_SECRET=<Ihr Client Secret Value>
MICROSOFT_TENANT_ID=<Ihre Directory (tenant) ID oder 'common'>
MICROSOFT_CALLBACK_URL=https://ihre-domain.com/api/auth/microsoft/callback
```

**Für Produktion:**
- Ersetzen Sie `http://localhost:3000` mit Ihrer tatsächlichen Domain
- Fügen Sie die Produktions-Callback-URL in Azure AD hinzu

### 5. Secrets in Manus hinzufügen

Verwenden Sie das Manus UI:
1. Öffnen Sie Management UI > Settings > Secrets
2. Fügen Sie die vier Microsoft-Variablen hinzu
3. Speichern Sie die Änderungen
4. Starten Sie den Dev-Server neu

## Verwendung

### Login mit Microsoft

1. Öffnen Sie die Anwendung
2. Klicken Sie auf "Mit Microsoft anmelden"
3. Sie werden zu Microsoft weitergeleitet
4. Nach erfolgreicher Authentifizierung werden Sie zum Dashboard weitergeleitet

### Datenbank-Schema

Das Projekt verwendet folgende Haupttabellen:

- **users**: Benutzer mit Multi-Provider Support (openId für Manus, microsoftId für Microsoft)
- **departments**: Abteilungen/Angebote
- **teams**: Teams innerhalb von Abteilungen
- **clients**: Klient*innen mit Betreuungsstufen
- **careLevelConfig**: Konfiguration der Betreuungsstufen

## Entwicklung

### Neue Features hinzufügen

1. Schema in `drizzle/schema.ts` erweitern
2. `pnpm db:push` ausführen
3. DB-Funktionen in `server/db.ts` hinzufügen
4. tRPC Procedures in `server/routers.ts` erstellen
5. UI-Komponenten in `client/src/pages/` erstellen

### API Endpoints

- `GET /api/auth/microsoft` - Microsoft OAuth Login starten
- `GET /api/auth/microsoft/callback` - OAuth Callback
- `POST /api/trpc/*` - tRPC API Endpoints

## Sicherheit

- Session Cookies sind httpOnly und secure (in Produktion)
- JWT Secrets werden sicher gespeichert
- CORS ist konfiguriert
- Microsoft OAuth verwendet sichere Redirect URIs

## Lizenz

Proprietary - Alle Rechte vorbehalten
