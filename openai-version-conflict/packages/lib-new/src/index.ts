import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { getMessages } from '@repro/lib-old';

/**
 * This function accepts ChatCompletionMessageParam[] from openai v6,
 * but receives the return value of getMessages() which is typed as
 * ChatCompletionMessageParam[] from openai v4.
 *
 * With pnpm: both resolve through a single hoisted copy, so the types
 * are identical and TypeScript is happy.
 *
 * With aube: each package gets its own copy under the virtual store
 * (node_modules/.aube/openai@4.x/... vs node_modules/.aube/openai@6.x/...),
 * so TypeScript sees them as distinct nominal types and rejects the assignment.
 */
function sendMessages(messages: ChatCompletionMessageParam[]): void {
    const client = new OpenAI();
    client.chat.completions.create({
        model: 'gpt-4',
        messages, // <-- type error under aube: v4 type !== v6 type
    });
}

// This line triggers the incompatibility:
// getMessages() returns openai@4's ChatCompletionMessageParam[]
// sendMessages() expects openai@6's ChatCompletionMessageParam[]
sendMessages(getMessages());
