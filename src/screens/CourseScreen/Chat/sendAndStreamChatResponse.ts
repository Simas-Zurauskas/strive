import { ChatReqBody } from '@/app/api/chat/route';
import { ChatMessage } from '@/lib/mongo/models/CourseModel';
import { genUxId } from '@/lib/utils';
import { CPointer } from '@/types';
import { RefObject } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { getChatKey } from '../util';

type SendAndStreamChatResponse = (params: {
  userInput: string;
  cPointer: CPointer;
  queryClient: QueryClient;
  setUserInput: (input: string) => void;
  currentCPointerRef: RefObject<string>;
}) => Promise<string | null>;

export const sendAndStreamChatResponse: SendAndStreamChatResponse = async ({
  userInput,
  cPointer,
  queryClient,
  setUserInput,
  currentCPointerRef,
}) => {
  if (!userInput.trim()) return null;

  const messageCPointer = JSON.stringify(cPointer);

  const input: ChatReqBody = {
    userInput,
    cPointer,
  };

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to chat');
  }

  const reader = response.body.getReader();
  let currentAssistantMessage = '';

  try {
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (currentCPointerRef.current !== messageCPointer) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);

          if (data.type === 'text' && data.content) {
            currentAssistantMessage += data.content;

            if (currentCPointerRef.current === messageCPointer) {
              queryClient.setQueryData(getChatKey(cPointer), (prev: { messages: ChatMessage[]; summary: string }) => {
                const newMessages = [...prev.messages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  newMessages[newMessages.length - 1] = {
                    ...lastMessage,
                    content: currentAssistantMessage,
                  };
                }
                return { ...prev, messages: newMessages };
              });
            }
          }
        } catch (e) {
          console.error('Error parsing stream line:', e);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  setUserInput('');
  return currentAssistantMessage;
};
