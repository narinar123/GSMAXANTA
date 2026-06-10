import { NextResponse } from "next/server";
import { AiGateway } from "@gsmaxall/ai-gateway";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, model } = body;

    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // Call the shared AI Gateway module
    const response = await AiGateway.generate({
      model,
      prompt: message
    });

    return NextResponse.json({ reply: response.reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process completion" }, { status: 500 });
  }
}
