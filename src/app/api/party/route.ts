import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { restaurant_id, name, phone, size } = body;

    if (!restaurant_id || !name || !size) {
      return NextResponse.json(
        { error: "restaurant_id, name and size are required" },
        { status: 400 }
      );
    }

    const sql = await getDb();

    // Calculate estimated wait time
    const waiting = await sql`
      SELECT COUNT(*) as count FROM parties
      WHERE restaurant_id = ${restaurant_id}
      AND status = 'waiting'
    `;

    const waitingCount = parseInt(waiting[0].count);
    const quoted_wait = waitingCount * 15; // 15 min per party estimate

    const party = await sql`
      INSERT INTO parties (restaurant_id, name, phone, size, quoted_wait)
      VALUES (${restaurant_id}, ${name}, ${phone || null}, ${size}, ${quoted_wait})
      RETURNING id, name, size, status, quoted_wait, joined_at
    `;

    return NextResponse.json({ party: party[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}