import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = await getDb();

    const party = await sql`
      UPDATE parties
      SET status = 'left'
      WHERE id = ${id}
      AND status = 'waiting'
      RETURNING id, name, status
    `;

    if (party.length === 0) {
      return NextResponse.json(
        { error: "Party not found or already seated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, party: party[0] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}