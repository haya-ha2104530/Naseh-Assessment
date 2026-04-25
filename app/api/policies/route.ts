import { db } from "@/db";
import { policies } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(policies);
  return NextResponse.json({ policies: data });
}

export async function POST(req: Request) {
  const { title, content } = await req.json();
  await db.insert(policies).values({ title, content });
  return NextResponse.json({ success: true });
}