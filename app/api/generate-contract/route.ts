// app/api/generate-contract/route.ts
import { NextRequest, NextResponse } from 'next/server';

<<<<<<< HEAD
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
=======
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
>>>>>>> 05417ba (ai generator fixes)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
<<<<<<< HEAD
      return NextResponse.json({
        error: 'API key needed: set OPENAI_API_KEY to use AI Contract Generator. Visual Builder works without it.',
        code: 'API_KEY_REQUIRED'
      }, { status: 503 });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // Prepare the request to the OpenAI API endpoint with improved system prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
=======
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
>>>>>>> 05417ba (ai generator fixes)
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
<<<<<<< HEAD
        model,
        messages: [
          {
            role: "system",
            content: `You are an expert Rust smart contract developer specializing in MultiversX blockchain contracts.
            
            Generate a production-ready Rust smart contract based on the user's requirements.
            
            # Technical Requirements:
            1. Write code only, no explanations or documentation outside the code itself
            2. Use only MultiversX macros and patterns (#[multiversx_sc::contract], etc.)
            3. Use MultiversX-specific types (ManagedBuffer, BigUint, TokenIdentifier, etc.)
            4. Include proper error handling with require! macros
            5. Implement security best practices for MultiversX contracts
            6. Include helpful inline comments to explain complex logic
            
            # Output Format:
            Return ONLY the raw Rust code with NO markdown formatting, NO code blocks with triple backticks with the rust language specifier, etc.
            Just provide the pure Rust code for a MultiversX smart contract.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,  // Increased token limit for more complete contracts
        temperature: 0.5   // Lower temperature for more consistent outputs
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || 'Contract generation failed' } };
      }
      console.error('API error:', errorData);
      return NextResponse.json({
        error: errorData.error?.message || 'Contract generation failed',
        code: 'UPSTREAM_API_ERROR'
      }, { status: response.status });
=======
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
>>>>>>> 05417ba (ai generator fixes)
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
<<<<<<< HEAD
=======

// Ensure this is a dynamic route
export const dynamic = 'force-dynamic';
>>>>>>> 05417ba (ai generator fixes)
