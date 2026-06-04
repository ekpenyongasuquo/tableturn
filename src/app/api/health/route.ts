import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = await getDb();
    const result = await sql`SELECT name, slug FROM restaurants LIMIT 1`;
    return NextResponse.json({ status: "connected", restaurant: result[0] });
  } catch (err) {
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 });
  }
}