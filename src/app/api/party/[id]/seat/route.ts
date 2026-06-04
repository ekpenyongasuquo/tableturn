import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { table_id } = body;

    if (!table_id) {
      return NextResponse.json({ error: "table_id is required" }, { status: 400 });
    }

    const sql = await getDb();

    await sql.begin(async (tx) => {
      const table = await tx`
        SELECT id, status FROM tables
        WHERE id = ${table_id}
        FOR UPDATE
      `;

      if (table.length === 0) {
        throw new Error("Table not found");
      }

      if (table[0].status !== "available") {
        throw new Error("Table just taken by another host");
      }

      await tx`
        UPDATE tables
        SET status = 'occupied', updated_at = NOW()
        WHERE id = ${table_id}
      `;

      await tx`
        UPDATE parties
        SET status = 'seated', table_id = ${table_id}, seated_at = NOW()
        WHERE id = ${id}
      `;
    });

    return NextResponse.json({ success: true, message: "Party seated successfully" });
  } catch (err) {
    const message = String(err);
    if (message.includes("Table just taken")) {
      return NextResponse.json({ error: "Table just taken by another host" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
