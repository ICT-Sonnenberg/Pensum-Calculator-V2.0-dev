import { eq, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, departments, teams, clients, careLevelConfig } from "../drizzle/schema.js";
import { ENV } from './_core/env.js';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Upsert user with support for multiple auth providers
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {};
    const updateSet: Record<string, unknown> = {};

    // Handle Manus OAuth
    if (user.openId) {
      values.openId = user.openId;
      const existing = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
      
      if (existing.length > 0) {
        // Update existing user
        if (user.name) updateSet.name = user.name;
        if (user.email) updateSet.email = user.email;
        if (user.loginMethod) updateSet.loginMethod = user.loginMethod;
        updateSet.lastSignedIn = new Date();
        
        await db.update(users).set(updateSet).where(eq(users.openId, user.openId));
        return;
      }
    }

    // Handle Microsoft OAuth
    if (user.microsoftId) {
      values.microsoftId = user.microsoftId;
      const existing = await db.select().from(users).where(eq(users.microsoftId, user.microsoftId)).limit(1);
      
      if (existing.length > 0) {
        // Update existing user
        if (user.name) updateSet.name = user.name;
        if (user.email) updateSet.email = user.email;
        if (user.loginMethod) updateSet.loginMethod = user.loginMethod;
        updateSet.lastSignedIn = new Date();
        
        await db.update(users).set(updateSet).where(eq(users.microsoftId, user.microsoftId));
        return;
      }
    }

    // Insert new user
    if (user.name) values.name = user.name;
    if (user.email) values.email = user.email;
    if (user.loginMethod) values.loginMethod = user.loginMethod;
    values.lastSignedIn = new Date();
    
    // Set role to admin if owner
    if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
    } else {
      values.role = user.role || 'user';
    }

    await db.insert(users).values(values);
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByMicrosoftId(microsoftId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.microsoftId, microsoftId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Department functions
export async function getAllDepartments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(departments).where(eq(departments.isActive, 1));
}

// Team functions
export async function getAllTeams() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teams).where(eq(teams.isActive, 1));
}

export async function getTeamsByDepartment(departmentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teams).where(and(
    eq(teams.departmentId, departmentId),
    eq(teams.isActive, 1)
  ));
}

// Client functions
export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).where(eq(clients.isActive, 1));
}

export async function getClientsByTeam(teamId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).where(and(
    eq(clients.teamId, teamId),
    eq(clients.isActive, 1)
  ));
}

// Statistics
export async function getStatistics(dateFrom?: string, dateTo?: string) {
  const db = await getDb();
  if (!db) return null;

  const conditions = [eq(clients.isActive, 1)];
  if (dateFrom) conditions.push(gte(clients.createdAt, new Date(dateFrom)));
  if (dateTo) conditions.push(lte(clients.createdAt, new Date(dateTo)));

  const allClients = await db.select().from(clients).where(and(...conditions));
  
  const totalClients = allClients.length;
  
  // Care level distribution
  const careLevelDist = [1, 2, 3, 4, 5].map(level => ({
    careLevel: level,
    count: allClients.filter(c => c.careLevel === level).length
  }));

  // Clients per department
  const deptList = await getAllDepartments();
  const clientsPerDept = deptList.map(dept => ({
    departmentId: dept.id,
    departmentName: dept.name,
    count: allClients.filter(c => c.departmentId === dept.id).length
  }));

  // Clients per team
  const teamList = await getAllTeams();
  const clientsPerTeam = teamList.map(team => ({
    teamId: team.id,
    teamName: team.name,
    count: allClients.filter(c => c.teamId === team.id).length
  }));

  return {
    totalClients,
    careLevelDistribution: careLevelDist,
    clientsPerDepartment: clientsPerDept,
    clientsPerTeam,
  };
}
