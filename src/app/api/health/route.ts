/**
 * Health Check API Route
 * 
 * Returns the health status of the application.
 * Used for monitoring and deployment checks.
 * 
 * Usage:
 *   GET /api/health
 *   Returns: { status: "ok", timestamp, database: "connected" | "disconnected" }
 * 
 * Note: This endpoint does not leak sensitive information.
 */

import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Check database connection
  let databaseStatus: "connected" | "disconnected" = "disconnected";
  try {
    const isConnected = await checkDatabaseConnection();
    databaseStatus = isConnected ? "connected" : "disconnected";
  } catch {
    databaseStatus = "disconnected";
  }

  return NextResponse.json({
    status: "ok",
    timestamp,
    database: databaseStatus,
    // Version can be set via env var during deployment
    version: process.env.npm_package_version || "unknown",
  });
}

