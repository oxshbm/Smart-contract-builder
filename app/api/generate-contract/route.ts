// app/api/generate-contract/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'API key needed: set OPENAI_API_KEY to use AI Contract Generator. Visual Builder works without it.',
        code: 'API_KEY_REQUIRED'
      }, { status: 503 });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // Prepare the request to the OpenAI API endpoint with improved system prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
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
    }

    const data = await response.json();
    const generatedContract = data.choices[0].message.content;

    return NextResponse.json({
      contract: generatedContract
    });

  } catch (error: any) {
    console.error('Contract generation error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to generate contract'
    }, { status: 500 });
  }
}
