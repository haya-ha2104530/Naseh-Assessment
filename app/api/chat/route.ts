import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { assessment, messages } from "@/db/schema";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { message } = await req.json();

  const assessmentData = await db.select().from(assessment).limit(1);
  const company = assessmentData[0];

  const history = await db.select().from(messages);

  await db.insert(messages).values({ role: "user", content: message });

  const systemContext = company
    ? `You are NasehAI, a company policy assistant. Here is the company info:
      - Name: ${company.companyName}
      - Email: ${company.companyEmail}
      - Location: ${company.companyLocation}
      - Primary Activity: ${company.primaryActivity}
      - Shareholders: ${company.shareholders}
      Use this info to answer questions and generate company policies in markdown format.
      Important: Always write in your own words. Never quote or reproduce legal texts verbatim.`
    : "You are NasehAI, an AI company policy assistant. Always write in your own words.";

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemContext,
  });

  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessage(message);
  const reply = result.response.text();

  await db.insert(messages).values({ role: "assistant", content: reply });

  return NextResponse.json({ reply });
}

export async function GET() {
  const history = await db.select().from(messages);
  return NextResponse.json({ messages: history });
}

export async function DELETE() {
  await db.delete(messages);
  return NextResponse.json({ success: true });
}