import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = await getDb();

    const table = await sql`
      UPDATE tables
      SET status = 'available', updated_at = NOW()
      WHERE id = ${id}
      AND status = 'occupied'
      RETURNING id, label, status
    `;

    if (table.length === 0) {
      return NextResponse.json(
        { error: "Table not found or already available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, table: table[0] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}