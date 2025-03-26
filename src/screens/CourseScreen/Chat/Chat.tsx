import styled from 'styled-components';
import { DelChat, Wrap, Message, ScrollToBottomRef, ScrollToBottom } from './comps';
import { Button } from '@/components/ui';
import { useEffect, useState, useRef } from 'react';
import { SendIcon, RefreshCw, LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '@/lib/mongo/models/CourseModel';
import { getCourseChat } from '@/lib/services/courseServices';
import { CPointer } from '@/types';
import { sendAndStreamChatResponse } from './sendAndStreamChatResponse';
import { Textarea } from '@/components/ui/textarea';
import Placeholder from './comps/Placeholder';
import { StickToBottom } from 'use-stick-to-bottom';
import { getChatLevel } from '@/lib/utils';
import { getChatKey } from '../util';

const ChatContainer = styled.div`
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
  cPointer: CPointer;
}

const Chat: React.FC<ChatProps> = ({ cPointer }) => {
  const [userInput, setUserInput] = useState('');
  const currentCPointerRef = useRef<string>(JSON.stringify(cPointer));
  const scrollToBottomRef = useRef<ScrollToBottomRef>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const firstLoadRef = useRef(true);
  const forcedScrollRef = useRef(false);
  const streamingMessageRef = useRef<ChatMessage | null>(null);
  const [canScroll, setCanScroll] = useState(false);

  const queryClient = useQueryClient();

  const handleNewMessages = (newMessages: ChatMessage[]) => {
    setHasNewMessages(true);
  };

  const { data = { messages: [] }, isLoading } = useQuery({
    queryKey: getChatKey(cPointer),
    queryFn: () => getCourseChat(cPointer),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const userMessage: ChatMessage = {
        _id: `user-${Date.now()}`,
        content: userInput,
        role: 'user',
      };

      // Add user message immediately to the cache
      queryClient.setQueryData(getChatKey(cPointer), (prev: { messages: ChatMessage[]; summary: string }) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      // Create a temporary assistant message for streaming
      const tempAssistantMessage: ChatMessage = {
        _id: `assistant-${Date.now()}`,
        content: '',
        role: 'assistant',
      };

      // Add temporary assistant message to cache
      queryClient.setQueryData(getChatKey(cPointer), (prev: { messages: ChatMessage[]; summary: string }) => ({
        ...prev,
        messages: [...prev.messages, tempAssistantMessage],
      }));

      streamingMessageRef.current = tempAssistantMessage;

      const result = await sendAndStreamChatResponse({
        userInput,
        cPointer,
        queryClient,
        setUserInput,
        currentCPointerRef,
      });

      return result;
    },
    onError: (error) => {
      // Remove the temporary assistant message on error
      queryClient.setQueryData(getChatKey(cPointer), (prev: { messages: ChatMessage[]; summary: string }) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg._id !== streamingMessageRef.current?._id),
      }));
      streamingMessageRef.current = null;
      toast.error(error.message || 'Something went wrong', { richColors: true });
    },
    onSuccess: async (data) => {
      if (!data) return;

      queryClient.setQueryData(getChatKey(cPointer), (prev: { messages: ChatMessage[]; summary: string }) => {
        const messages = prev.messages.map((msg) =>
          msg._id === streamingMessageRef.current?._id ? { ...msg, content: data } : msg,
        );
        return { ...prev, messages };
      });

      streamingMessageRef.current = null;
    },
  });

  useEffect(() => {
    currentCPointerRef.current = JSON.stringify(cPointer);
    forcedScrollRef.current = false;
    firstLoadRef.current = true;
    streamingMessageRef.current = null;

    if (data.messages.length > 0) {
      const timer = setTimeout(() => {
        setCanScroll(true);
        clearTimeout(timer);
      }, 1);
    }
    if (data.messages.length > 0 && firstLoadRef.current) {
      firstLoadRef.current = false;
    } else if (scrollToBottomRef.current) {
      scrollToBottomRef.current.updateNewMessagesState(data.messages);
    }
  }, [cPointer, data]);

  useEffect(() => {
    setCanScroll(false);
    setUserInput('');
  }, [cPointer]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      mutateAsync();
    }
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

  const chatLevel = getChatLevel(cPointer);

  return (
    <Wrap>
      <ChatContainer>
        <StickToBottom
          className="h-full relative use-stick-to-bottom"
          resize={canScroll ? 'auto' : 'instant'}
          initial="instant"
        >
          <StickToBottom.Content>
            <MessagesContainer>
              {isLoading ? (
                <LoadingContainer>
                  <LoaderIcon className="w-7 h-7 animate-[spin_2s_linear_infinite] text-primary" />
                  <LoadingText>Loading conversation...</LoadingText>
                </LoadingContainer>
              ) : data.messages.length === 0 ? (
                <PlaceholderContainer>
                  <Placeholder level={chatLevel} onSuggestionClick={handleSuggestionClick} />
                </PlaceholderContainer>
              ) : (
                data.messages.map((el) => <Message key={el._id} message={el} isPending={isPending} />)
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

              {data.messages.length > 0 && <DelChat cPointer={cPointer} onDelete={() => {}} disabled={isPending} />}
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
