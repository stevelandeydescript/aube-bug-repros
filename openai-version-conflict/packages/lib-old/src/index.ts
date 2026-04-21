import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

/**
 * Returns a simple conversation using openai v4's ChatCompletionMessageParam type.
 */
export function getMessages(): ChatCompletionMessageParam[] {
    return [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' },
    ];
}
