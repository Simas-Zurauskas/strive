import { ChatReqBody } from '@/app/api/chat/route';
import { ChatMessage } from '@/lib/mongo/models/CourseModel';
import { genUxId } from '@/lib/utils';
import { CPointer } from '@/types';
import { RefObject, SetStateAction, Dispatch } from 'react';

type SendAndStreamChatResponse = (params: {
  userInput: string;
  cPointer: CPointer;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setUserInput: Dispatch<SetStateAction<string>>;
  currentCPointerRef: RefObject<string>;
}) => Promise<string | null>;

export const sendAndStreamChatResponse: SendAndStreamChatResponse = async ({
  userInput,
  cPointer,
  setMessages,
  setUserInput,
  currentCPointerRef,
}) => {
  if (!userInput.trim()) return null;

  const messageCPointer = JSON.stringify(cPointer);

  setMessages((prev) => [...prev, { content: userInput, role: 'user', _id: genUxId() }]);
  setMessages((prev) => [...prev, { content: '', role: 'assistant', _id: genUxId() }]);

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
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  content: currentAssistantMessage,
                  role: 'assistant',
                  _id: genUxId(),
                };
                return newMessages;
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
