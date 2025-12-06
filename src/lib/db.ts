/**
 * Prisma Database Client Singleton
 * 
 * This module exports a singleton instance of the Prisma client.
 * In development, we attach the client to the global object to prevent
 * creating multiple instances during hot reloading.
 * 
 * SECURITY NOTES:
 * - DATABASE_URL must be set in environment variables (never commit to git)
 * - This client should only be used in Server Components, Route Handlers,
 *   and Server Actions - never in client-side code
 * - All database credentials are accessed only on the server via process.env
 */

import { PrismaClient } from "@prisma/client";

// Extend the global type to include the Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Create a new Prisma client instance with appropriate logging.
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

/**
 * Singleton Prisma client instance.
 * 
 * In production: Creates a single instance
 * In development: Reuses the global instance to prevent connection exhaustion
 * during hot reloading.
 */
export const db: PrismaClient =
  globalThis.prisma ?? createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

/**
 * Helper to check if the database connection is healthy.
 * Useful for health check endpoints.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Gracefully disconnect from the database.
 * Call this during server shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  await db.$disconnect();
}

