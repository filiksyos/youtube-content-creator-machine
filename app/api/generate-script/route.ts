import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/openrouter-client";
import { z } from "zod";

const ScriptRequestSchema = z.object({
  topic: z.string().min(1),
  audience: z.string().optional().default("general viewers"),
  length: z.enum(["short", "medium", "long"]).optional().default("medium"),
  tone: z.string().optional().default("engaging and informative"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, audience, length, tone } = ScriptRequestSchema.parse(body);

    const script = await generateScript({
      topic,
      audience,
      length,
      tone,
    });

    return NextResponse.json({ script }, { status: 200 });
  } catch (error) {
    console.error("Script generation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request parameters", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
