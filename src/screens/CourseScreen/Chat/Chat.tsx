import styled from 'styled-components';
import { motion } from 'framer-motion';
import { DelChat, Wrap } from './comps';
import { Button } from '@/components/ui';
import { useEffect, useState, useRef } from 'react';
import { SendIcon, RefreshCw, LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChatMessage, Course } from '@/lib/mongo/models/CourseModel';
import { getCourseChat } from '@/lib/services/courseServices';
import { CPointer, QKeys } from '@/types';
import { sendAndStreamChatResponse } from './sendAndStreamChatResponse';
import { Textarea } from '@/components/ui/textarea';
import Placeholder from './comps/Placeholder';

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
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 16px 10px;
  padding-bottom: 120px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  background-color: ${({ isUser }) => (isUser ? 'var(--strive)' : 'var(--secondary)')};
  color: ${({ isUser }) => (isUser ? 'var(--primary-foreground)' : 'var(--foreground)')};
  font-size: 14px;
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
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
`;

interface ChatProps {
  course: Course;
  cPointer: CPointer;
}

const Chat: React.FC<ChatProps> = ({ course, cPointer }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(course.chat);
  const currentCPointerRef = useRef<string>(JSON.stringify(cPointer));

  const {
    data = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [QKeys.CHAT, course.uxId, cPointer.module?.moduleId, cPointer.module?.lessonId],
    queryFn: () => getCourseChat(cPointer),
  });

  useEffect(() => {
    currentCPointerRef.current = JSON.stringify(cPointer);
    setMessages([]);
    if (data) {
      setMessages(data);
    }
  }, [cPointer, data, cPointer, isFetching]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () =>
      sendAndStreamChatResponse({ userInput, cPointer, setMessages, setUserInput, currentCPointerRef }),
    onError: (error) =>
      toast.error(error.message || 'Something went wrong', {
        richColors: true,
      }),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateAsync();
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
        <MessagesContainer>
          {isLoading ? (
            <LoadingContainer>
              <LoaderIcon className="w-7 h-7 animate-[spin_2s_linear_infinite] text-primary" />
              <LoadingText>Loading conversation...</LoadingText>
            </LoadingContainer>
          ) : messages.length === 0 ? (
            <Placeholder level={chatLevel} onSuggestionClick={handleSuggestionClick} />
          ) : (
            messages.map((el) => (
              <MessageBubble key={el._id} isUser={el.role === 'user'}>
                {el.content || (isPending && el.role === 'assistant' ? '...' : '')}
              </MessageBubble>
            ))
          )}
        </MessagesContainer>

        <InputContainer onSubmit={onSubmit}>
          <div className="flex-1 relative">
            <Textarea
              placeholder="Type your message here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isPending}
              rows={1}
            />

            {!!data.length && <DelChat cPointer={cPointer} onDelete={() => {}} disabled={isPending} />}
          </div>
          <SendButton type="submit" disabled={isPending || !userInput.trim()}>
            {isPending ? <RefreshCw size={18} className="animate-spin" /> : <SendIcon size={18} />}
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </Wrap>
  );
};

export default Chat;
