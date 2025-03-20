import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize the OpenAI client with Nebius API URL and key
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Extract prompt, model and size from request body
    const { prompt, model, width, height } = await req.json();

    // Validate prompt
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Set model config based on selected model
    const modelConfig = 
      model === 'flux-schnell' 
        ? {
            model: "black-forest-labs/flux-schnell",
            extra_body: {
              response_extension: "webp",
              width: width || 1024,
              height: height || 1024,
              num_inference_steps: 4,
              negative_prompt: "",
              seed: -1
            }
          }
        : {
            model: "stability-ai/sdxl",
            extra_body: {
              response_extension: "webp",
              width: width || 1024,
              height: height || 1024,
              num_inference_steps: 30,
              negative_prompt: "",
              seed: -1
            }
          };

    // Call Nebius API to generate image
    const response = await client.images.generate({
      ...modelConfig,
      response_format: "b64_json",
      prompt: prompt
    });

    // Return the image as base64 data and revised prompt if available
    return NextResponse.json({ 
      imageData: response.data[0].b64_json,
      revisedPrompt: response.data[0].revised_prompt || prompt
    });
  } catch (error: any) {
    // Handle errors
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}