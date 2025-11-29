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
    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        model: 'google/gemini-2.5-flash-image',
        messages: [
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

    // Extract image URL from response
    // Note: The actual response format may vary depending on the model
    // You may need to adjust this based on the actual API response structure
    const content = response.data.choices[0].message.content;
    
    // If the response contains an image URL, extract it
    // This is a placeholder - adjust based on actual API response
    if (typeof content === 'string' && content.includes('http')) {
      const urlMatch = content.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        return urlMatch[0];
      }
    }

    // If the model returns base64 or other format, handle accordingly
    return content;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw new Error('Failed to generate thumbnail');
  }
}
