import { db } from "@/db";
import { policies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { content } = await req.json();
  await db.update(policies).set({ content }).where(eq(policies.id, Number(id)));
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(policies).where(eq(policies.id, Number(id)));
  return NextResponse.json({ success: true });
}