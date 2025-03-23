import React, { memo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { ChatMessage } from '@/lib/mongo/models/CourseModel';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { isEqual } from 'lodash';

const MessageBubble = styled.div<{ isUser: boolean }>`
  /* padding: 0px 4px; */
  border-radius: 12px;
  max-width: 90%;
  align-self: flex-end;
  background-color: transparent;
  color: var(--foreground);
  font-size: 14px;
  line-height: 1.6;

  ${({ isUser }) =>
    !isUser &&
    css`
      align-self: flex-start;
      > div {
        padding: 12px 16px;
        background-color: var(--secondary);

        border-radius: 12px;
      }
    `}

  /* Common markdown styles */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.25em;
    margin-bottom: 0.75em;
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.3em;
  }

  h3 {
    font-size: 1.2em;
  }

  h4,
  h5,
  h6 {
    font-size: 1.1em;
  }

  p {
    margin: 0;
    line-height: 1.6;
  }

  p + p {
    margin-top: 0.75em;
  }

  a {
    color: ${({ isUser }) => (isUser ? 'var(--primary-foreground)' : 'var(--strive)')};
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.85;
    }
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  pre {
    margin: 1em 0;
    border-radius: 8px;
    overflow: hidden;
    background-color: ${({ isUser }) => (isUser ? 'rgba(0, 0, 0, 0.2)' : 'var(--muted)')};
  }

  code {
    position: relative;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 13px;

    &:not(pre code) {
      background-color: ${({ isUser }) => (isUser ? 'rgba(0, 0, 0, 0.2)' : 'var(--muted)')};
      padding: 0.2em 0.4em;
      border-radius: 4px;
      white-space: nowrap;
    }
  }

  ul,
  ol {
    margin: 0.75em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.4em 0;
    padding-left: 0.25em;
  }

  ul li {
    list-style-type: disc;
  }

  ol li {
    list-style-type: decimal;
  }

  blockquote {
    margin: 0.75em 0;
    padding: 0.5em 1em;
    border-left: 3px solid ${({ isUser }) => (isUser ? 'rgba(255, 255, 255, 0.5)' : 'var(--border)')};
    background-color: ${({ isUser }) => (isUser ? 'rgba(0, 0, 0, 0.1)' : 'var(--muted)')};
    color: ${({ isUser }) => (isUser ? 'var(--primary-foreground)' : 'var(--muted-foreground)')};
    border-radius: 4px;
  }

  hr {
    margin: 1.5em 0;
    border: none;
    border-top: 1px solid ${({ isUser }) => (isUser ? 'rgba(255, 255, 255, 0.2)' : 'var(--border)')};
  }

  table {
    width: 100%;
    margin: 1em 0;
    border-collapse: collapse;
    font-size: 0.9em;
  }

  th,
  td {
    padding: 0.5em;
    border: 1px solid ${({ isUser }) => (isUser ? 'rgba(255, 255, 255, 0.2)' : 'var(--border)')};
    text-align: left;
  }

  th {
    background-color: ${({ isUser }) => (isUser ? 'rgba(0, 0, 0, 0.2)' : 'var(--muted)')};
    font-weight: 600;
  }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const TypingIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 0;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--muted-foreground);
  animation: ${bounceAnimation} 1s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.15s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }
`;

const MarkdownContainer = styled.div`
  width: 100%;
`;

interface MessageProps {
  message: ChatMessage;
  isPending?: boolean;
}

export const Message: React.FC<MessageProps> = memo(({ message, isPending = false }) => {
  const isUser = message.role === 'user';
  const isLoading = isPending && message.role === 'assistant' && !message.content;
  const content = message.content || '';

  return (
    <MessageBubble isUser={isUser}>
      {isUser ? (
        content
      ) : (
        <MarkdownContainer>
          {isLoading ? (
            <TypingIndicator>
              <Dot />
              <Dot />
              <Dot />
            </TypingIndicator>
          ) : (
            <ReactMarkdown
              components={{
                code({ className, children, ...rest }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isCodeBlock = Boolean(match) && typeof children === 'string';

                  return isCodeBlock ? (
                    <SyntaxHighlighter
                      language={match ? match[1] : ''}
                      style={nord}
                      wrapLongLines={true}
                      customStyle={{
                        margin: 0,
                        borderRadius: '4px',
                        fontSize: '13px',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </MarkdownContainer>
      )}
    </MessageBubble>
  );
}, isEqual);
