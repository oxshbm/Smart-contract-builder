// app/api/generate-contract/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

function extractGeneratedText(data: any): string {
  const candidates = data?.candidates;
  if (!Array.isArray(candidates)) {
    return '';
  }

  return candidates
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || '')
    .join('')
    .trim();
}

function getGeminiErrorMessage(data: any): string {
  return data?.error?.message || 'Contract generation failed';
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY environment variable is not set',
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `You are an expert Rust smart contract developer specializing in MultiversX blockchain contracts.

Generate a production-ready Rust smart contract based on the user's requirements.

Technical requirements:
1. Write code only, with no markdown fences and no prose outside the code.
2. Use MultiversX smart contract macros and patterns.
3. Use MultiversX-specific types where appropriate.
4. Include secure input validation and require! checks where needed.
5. Keep the result self-contained and compilable as a contract starting point.
6. Add only concise inline comments for non-obvious logic.`,
            },
          ],
        },
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4096,
        },
      }),
    }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(getGeminiErrorMessage(data));
    }

    const generatedContract = extractGeneratedText(data);

    if (!generatedContract) {
      console.error('Gemini API empty response:', data);
      throw new Error('The AI provider returned an empty contract');
    }

    return NextResponse.json({
      contract: generatedContract,
      provider: 'gemini',
      model: DEFAULT_GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error('Contract generation error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate contract',
      },
      { status: 500 }
    );
  }
}
