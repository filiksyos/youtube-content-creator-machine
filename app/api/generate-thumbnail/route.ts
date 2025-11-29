import { NextRequest, NextResponse } from "next/server";
import { generateThumbnail } from "@/lib/openrouter-client";
import { z } from "zod";

const ThumbnailRequestSchema = z.object({
  title: z.string().min(1),
  keyElements: z.string().optional().default(""),
  style: z.string().optional().default("bold and eye-catching"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, keyElements, style } = ThumbnailRequestSchema.parse(body);

    const imageUrl = await generateThumbnail({
      title,
      keyElements,
      style,
    });

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}
