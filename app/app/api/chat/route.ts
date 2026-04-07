// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20240620'),
      messages,
      temperature: 0.7,
      maxTokens: 3000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
