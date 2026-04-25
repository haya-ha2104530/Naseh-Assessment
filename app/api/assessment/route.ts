import { db } from "@/db";
import { assessment } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { companyName, companyEmail, companyLocation, primaryActivity, shareholders } = body;

  const existing = await db.select().from(assessment).limit(1);
  if (existing.length > 0) {
    await db.delete(assessment);
  }

  await db.insert(assessment).values({
    companyName,
    companyEmail,
    companyLocation,
    primaryActivity,
    shareholders: JSON.stringify(shareholders),
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const data = await db.select().from(assessment).limit(1);
  if (data.length === 0) return NextResponse.json({ assessment: null });
  return NextResponse.json({ assessment: data[0] });
}