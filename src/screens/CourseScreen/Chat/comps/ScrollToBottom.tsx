import { ChevronDown } from 'lucide-react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChatMessage } from '@/lib/mongo/models/CourseModel';
import { useStickToBottomContext } from 'use-stick-to-bottom';
import { Button } from '@/components/ui/button';

const ScrollToBottomButton = styled(Button)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 80px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  background-color: var(--card);
  border: 1px solid var(--border);
  color: var(--foreground);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: var(--accent);
  }
`;

export interface ScrollToBottomRef {
  updateNewMessagesState: (messages: ChatMessage[] | ((prevState: ChatMessage[]) => ChatMessage[])) => void;
}

interface ScrollToBottomProps {
  onNewMessages: (messages: ChatMessage[]) => void;
}

const SCROLL_THRESHOLD = 200;

export const ScrollToBottom = forwardRef<ScrollToBottomRef, ScrollToBottomProps>(({ onNewMessages }, ref) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    containerRef.current = document.querySelector('.use-stick-to-bottom');
  }, []);

  const calculateDistanceFromBottom = (): number => {
    if (!containerRef.current) return Infinity;

    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight;
  };

  useImperativeHandle(ref, () => ({
    updateNewMessagesState: (messages: ChatMessage[] | ((prevState: ChatMessage[]) => ChatMessage[])) => {
      const newMessages = typeof messages === 'function' ? messages(messagesRef.current) : messages;
      const distanceFromBottom = calculateDistanceFromBottom();

      if (isInitialLoad.current && newMessages.length > 0) {
        isInitialLoad.current = false;
        messagesRef.current = newMessages;
        return;
      }

      if (newMessages.length > messagesRef.current.length) {
        // If we're close to the bottom (within threshold), auto-scroll
        if (distanceFromBottom <= SCROLL_THRESHOLD) {
          scrollToBottom();
        } else if (!isAtBottom) {
          setHasNewMessages(true);
          onNewMessages(newMessages);
        }
      }
      messagesRef.current = newMessages;
    },
  }));

  const handleScrollToBottom = () => {
    scrollToBottom();
    setHasNewMessages(false);
  };

  if (isAtBottom) return null;

  return (
    <ScrollToBottomButton size="sm" onClick={handleScrollToBottom}>
      <ChevronDown size={16} />
      <span>{hasNewMessages ? 'New messages' : 'Scroll to bottom'}</span>
    </ScrollToBottomButton>
  );
});

ScrollToBottom.displayName = 'ScrollToBottom';
