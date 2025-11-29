import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not set in environment variables');
}

interface ScriptGenerationParams {
  topic: string;
  audience?: string;
  length?: 'short' | 'medium' | 'long';
  tone?: string;
}

interface ThumbnailGenerationParams {
  title: string;
  keyElements?: string;
  style?: string;
}

// Generate YouTube script using prime-intellect/intellect-3
export async function generateScript(params: ScriptGenerationParams): Promise<string> {
  const { topic, audience = 'general viewers', length = 'medium', tone = 'engaging and informative' } = params;

  const lengthGuide = {
    short: '5-8 minutes (approximately 750-1200 words)',
    medium: '10-15 minutes (approximately 1500-2250 words)',
    long: '20+ minutes (approximately 3000+ words)',
  };

  const prompt = `Create a complete YouTube video script about: ${topic}

Target Audience: ${audience}
Video Length: ${lengthGuide[length]}
Tone: ${tone}

Please structure the script with:
1. Hook/Introduction (first 15 seconds to grab attention)
2. Main Content (organized into clear sections with smooth transitions)
3. Call-to-Action and Outro

Include suggestions for visuals, on-screen text, and pacing notes where helpful.`;

  try {
    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        model: 'prime-intellect/intellect-3',
        messages: [
          {
            role: 'system',
            content: 'You are an expert YouTube scriptwriter who creates engaging, well-structured video scripts optimized for viewer retention and engagement.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/filiksyos/youtube-content-creator-machine',
          'X-Title': 'YouTube Content Creator Machine',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Script generation error:', error);
    throw new Error('Failed to generate script');
  }
}

// Generate YouTube thumbnail using google/gemini-2.5-flash-image (16:9 aspect ratio)
// Based on working implementation from affirmation-screensaver
export async function generateThumbnail(params: ThumbnailGenerationParams): Promise<string> {
  const { title, keyElements = '', style = 'bold and eye-catching' } = params;

  const prompt = `Create a professional YouTube thumbnail image with the following specifications:

Title Text: "${title}"
Key Visual Elements: ${keyElements || 'professional, attention-grabbing imagery related to the title'}
Style: ${style}

Design Requirements:
- 16:9 aspect ratio (1344x768 pixels)
- Bold, readable text overlay with the title
- High contrast and vibrant colors that stand out
- Professional quality suitable for YouTube
- Clear focal point that draws the eye
- Modern design aesthetic`;

  try {
    // Use axios directly with image_config (as per working implementation)
    const payload = {
      model: 'google/gemini-2.5-flash-image',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      image_config: {
        aspect_ratio: '16:9', // 1344×768 resolution, perfect for YouTube thumbnails
      },
    };

    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/filiksyos/youtube-content-creator-machine',
          'X-Title': 'YouTube Content Creator Machine',
        },
        timeout: 60000, // 60 second timeout for image generation
      }
    );

    const result = response.data;
    const message = result?.choices?.[0]?.message;

    if (!message) {
      console.error('API Response:', JSON.stringify(result, null, 2));
      throw new Error('No message in API response');
    }

    let imageUrl: string | null = null;

    // Check for images array (OpenRouter/Gemini image generation format)
    if (message.images && Array.isArray(message.images) && message.images.length > 0) {
      const imageData = message.images[0];

      // Check if it's a URL string
      if (typeof imageData === 'string') {
        if (imageData.startsWith('http')) {
          imageUrl = imageData;
        } else if (imageData.startsWith('data:image')) {
          // Data URL format - return as-is
          imageUrl = imageData;
        }
      } else if (imageData && typeof imageData === 'object') {
        // Object with image_url property (OpenRouter format)
        if (imageData.image_url) {
          imageUrl = typeof imageData.image_url === 'string'
            ? imageData.image_url
            : imageData.image_url.url;
        } else if (imageData.url) {
          // Fallback to url property
          imageUrl = imageData.url;
        } else if (imageData.base64 || imageData.data) {
          // Base64 data directly - convert to data URL
          const base64Data = imageData.base64 || imageData.data;
          imageUrl = `data:image/png;base64,${base64Data}`;
        } else if (imageData.inlineData?.data) {
          // Gemini inlineData format
          imageUrl = `data:image/png;base64,${imageData.inlineData.data}`;
        }
      }
    }

    // Check for content array (multimodal response - most common format)
    if (!imageUrl && message.content && Array.isArray(message.content)) {
      const imageContent = message.content.find(
        (item: any) => item.type === 'image_url' || item.image_url
      );
      if (imageContent) {
        imageUrl = imageContent.image_url?.url || imageContent.url || imageContent.image_url;
      }
    }

    // Check for direct image_url in message
    if (!imageUrl && message.image_url) {
      imageUrl = message.image_url.url || message.image_url;
    }

    // Check for content as string (data URL or URL)
    if (!imageUrl && message.content && typeof message.content === 'string') {
      const content = message.content;
      if (content.startsWith('data:image') || content.startsWith('http')) {
        imageUrl = content;
      }
    }

    // Check for parts array (Gemini-style response)
    if (!imageUrl && message.parts && Array.isArray(message.parts)) {
      const imagePart = message.parts.find(
        (part: any) => part.inlineData || part.imageUrl
      );
      if (imagePart) {
        if (imagePart.inlineData?.data) {
          imageUrl = `data:image/png;base64,${imagePart.inlineData.data}`;
        } else if (imagePart.imageUrl) {
          imageUrl = imagePart.imageUrl.url || imagePart.imageUrl;
        }
      }
    }

    if (!imageUrl) {
      console.error('Response structure:', JSON.stringify({
        hasMessage: !!message,
        messageKeys: message ? Object.keys(message) : [],
        hasImages: !!message?.images,
        imagesLength: message?.images?.length || 0,
        imagesType: message?.images?.[0] ? typeof message?.images[0] : 'none',
        contentType: message?.content ? typeof message.content : 'none',
        contentIsArray: Array.isArray(message?.content),
        hasImageUrl: !!message?.image_url,
        hasParts: !!message?.parts,
      }, null, 2));
      throw new Error('No image data found in response. Check console for response structure details.');
    }

    return imageUrl;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate thumbnail');
  }
}

