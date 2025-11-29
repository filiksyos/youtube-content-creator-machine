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
        { error: "Invalid request parameters", details: error.issues },
        { status: 400 }
      );
    }

    // Provide more detailed error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to generate thumbnail";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(error instanceof Error && error.message.includes('text description') && {
          suggestion: "The image generation API may not be returning an image URL. Please check the API response format or try a different model."
        })
      },
      { status: 500 }
    );
  }
}
