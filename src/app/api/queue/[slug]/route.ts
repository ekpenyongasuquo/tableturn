import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sql = await getDb();

    const restaurant = await sql`
      SELECT id, name, slug FROM restaurants WHERE slug = ${slug} LIMIT 1
    `;

    if (restaurant.length === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const rest = restaurant[0];

    const parties = await sql`
      SELECT id, name, size, status, quoted_wait, joined_at, seated_at, table_id
      FROM parties
      WHERE restaurant_id = ${rest.id}
      AND status = 'waiting'
      ORDER BY joined_at ASC
    `;

    const tables = await sql`
      SELECT id, label, capacity, status
      FROM tables
      WHERE restaurant_id = ${rest.id}
      ORDER BY label ASC
    `;

    return NextResponse.json({
      restaurant: rest,
      parties,
      tables,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}