import styled from 'styled-components';
import { motion } from 'framer-motion';
import { DelChat, Wrap, Message } from './comps';
import { Button } from '@/components/ui';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { SendIcon, RefreshCw, LoaderIcon, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChatMessage, Course } from '@/lib/mongo/models/CourseModel';
import { getCourseChat } from '@/lib/services/courseServices';
import { CPointer, QKeys } from '@/types';
import { sendAndStreamChatResponse } from './sendAndStreamChatResponse';
import { Textarea } from '@/components/ui/textarea';
import Placeholder from './comps/Placeholder';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';

const ChatContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 10px;
  padding-bottom: 100px;
  min-height: 100%;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 10px;
  background-color: var(--card);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
  align-items: flex-end;

  textarea {
    background-color: var(--background);
    resize: none;
    min-height: 45px;
    max-height: 120px;
    border-radius: 8px;
    padding: 10px 14px;
    line-height: 1.5;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: var(--foreground);

    &:focus {
      box-shadow: 0 0 0 2px var(--ring);
    }
  }
`;

const SendButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 45px;
  height: 45px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
`;

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

const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

interface ChatProps {
  course: Course;
  cPointer: CPointer;
}

interface ScrollToBottomProps {
  onNewMessages: (messages: ChatMessage[]) => void;
}

interface ScrollToBottomRef {
  updateNewMessagesState: (messages: ChatMessage[] | ((prevState: ChatMessage[]) => ChatMessage[])) => void;
}

const SCROLL_THRESHOLD = 200;

const ScrollToBottom = forwardRef<ScrollToBottomRef, ScrollToBottomProps>((props, ref) => {
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
          props.onNewMessages(newMessages);
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

const Chat: React.FC<ChatProps> = ({ course, cPointer }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(course.chat.messages);
  const currentCPointerRef = useRef<string>(JSON.stringify(cPointer));
  const scrollToBottomRef = useRef<ScrollToBottomRef>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const firstLoadRef = useRef(true);
  const forcedScrollRef = useRef(false);

  const handleNewMessages = (newMessages: ChatMessage[]) => {
    setHasNewMessages(true);
  };

  const {
    data = { messages: [] },
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [QKeys.CHAT, course.uxId, cPointer.module?.moduleId, cPointer.module?.lessonId],
    queryFn: () => getCourseChat(cPointer),
  });

  console.log('data', data);

  const forceScrollToBottom = () => {
    if (forcedScrollRef.current) return;

    const container = document.querySelector('.use-stick-to-bottom');
    if (container instanceof HTMLElement) {
      container.scrollTop = container.scrollHeight;
      forcedScrollRef.current = true;
    }
  };

  useLayoutEffect(() => {
    if (firstLoadRef.current && messages.length > 0 && !forcedScrollRef.current) {
      forceScrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    currentCPointerRef.current = JSON.stringify(cPointer);
    setMessages([]);
    firstLoadRef.current = true;
    forcedScrollRef.current = false;

    if (data) {
      setMessages(data.messages);

      if (data.messages.length > 0 && firstLoadRef.current) {
        firstLoadRef.current = false;
      } else if (scrollToBottomRef.current) {
        scrollToBottomRef.current.updateNewMessagesState(data.messages);
      }
    }
  }, [cPointer, data, isFetching]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const result = await sendAndStreamChatResponse({
        userInput,
        cPointer,
        setMessages: (newMessages) => {
          setMessages(newMessages);
          if (scrollToBottomRef.current) {
            scrollToBottomRef.current.updateNewMessagesState(newMessages);
          }
        },
        setUserInput,
        currentCPointerRef,
      });
      return result;
    },
    onError: (error) =>
      toast.error(error.message || 'Something went wrong', {
        richColors: true,
      }),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateAsync();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userInput.trim()) {
        mutateAsync();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
  };

  const getChatLevel = () => {
    if (!cPointer.module?.moduleId) {
      return 'course';
    } else if (cPointer.module && !cPointer.module.lessonId) {
      return 'module';
    } else {
      return 'lesson';
    }
  };

  const chatLevel = getChatLevel();

  return (
    <Wrap>
      <ChatContainer
        key={JSON.stringify(cPointer)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <StickToBottom className="h-full relative use-stick-to-bottom" resize="smooth" initial="instant">
          <StickToBottom.Content>
            <MessagesContainer>
              {isLoading ? (
                <LoadingContainer>
                  <LoaderIcon className="w-7 h-7 animate-[spin_2s_linear_infinite] text-primary" />
                  <LoadingText>Loading conversation...</LoadingText>
                </LoadingContainer>
              ) : messages.length === 0 ? (
                <PlaceholderContainer>
                  <Placeholder level={chatLevel} onSuggestionClick={handleSuggestionClick} />
                </PlaceholderContainer>
              ) : (
                messages.map((el) => <Message key={el._id} message={el} isPending={isPending} />)
              )}
            </MessagesContainer>
          </StickToBottom.Content>

          <ScrollToBottom ref={scrollToBottomRef} onNewMessages={handleNewMessages} />

          <InputContainer onSubmit={onSubmit}>
            <div className="flex-1 relative">
              <Textarea
                placeholder="Type your message here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                rows={1}
              />

              {messages.length > 0 && <DelChat cPointer={cPointer} onDelete={() => {}} disabled={isPending} />}
            </div>
            <SendButton type="submit" disabled={isPending || !userInput.trim()}>
              {isPending ? <RefreshCw size={18} className="animate-spin" /> : <SendIcon size={18} />}
            </SendButton>
          </InputContainer>
        </StickToBottom>
      </ChatContainer>
    </Wrap>
  );
};

export default Chat;
