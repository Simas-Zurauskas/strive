import styled from "styled-components";
import { motion } from "framer-motion";
import { Wrap } from "./comps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { useState } from "react";
import { SendIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ChatReqBody } from "@/app/api/chat/route";
import { View } from "../types";
import { ChatMessage, Course } from "@/lib/mongo/models/CourseModel";
import { genUxId } from "@/lib/utils";

const ChatContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isUser ? "#7856FF" : "#F0F0F0")};
  color: ${(props) => (props.isUser ? "#FFFFFF" : "#333333")};
`;

const InputContainer = styled.form`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const SendButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ChatProps {
  view: View;
  course: Course;
}

const Chat: React.FC<ChatProps> = ({ view, course }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!userInput.trim()) return null;

      setMessages((prev) => [
        ...prev,
        { content: userInput, role: "user", _id: genUxId() },
      ]);
      setMessages((prev) => [
        ...prev,
        { content: "", role: "assistant", _id: genUxId() },
      ]);

      const input: ChatReqBody = {
        userInput,
        courseUxId: course.uxId,
        moduleId: null,
        lessonId: null,
      };

      if (view.type === "module") {
        input.moduleId = view.moduleId;
      }
      if (view.type === "lesson") {
        input.moduleId = view.moduleId;
        // @ts-ignore
        input.lessonId = view.lessonId;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to chat");
      }

      const reader = response.body.getReader();
      let currentAssistantMessage = "";

      try {
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);

              if (data.type === "text" && data.content) {
                console.log("Text chunk:", data.content);

                currentAssistantMessage += data.content;

                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    content: currentAssistantMessage,
                    role: "assistant",
                    _id: genUxId(),
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing stream line:", e);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      setUserInput("");
      return currentAssistantMessage;
    },
    onError: (error) =>
      toast.error(error.message || "Something went wrong", {
        richColors: true,
      }),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateAsync();
  };

  return (
    <Wrap>
      <ChatContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <MessagesContainer>
          {messages.map((el) => (
            <MessageBubble key={el._id} isUser={el.role === "user"}>
              {el.content ||
                (isPending && el.role === "assistant" ? "..." : "")}
            </MessageBubble>
          ))}
        </MessagesContainer>

        <InputContainer onSubmit={onSubmit}>
          <Input
            placeholder="Type your message here..."
            style={{ flex: 1 }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isPending}
          />
          <SendButton type="submit" disabled={isPending || !userInput.trim()}>
            {isPending ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <SendIcon size={18} />
            )}
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </Wrap>
  );
};

export default Chat;
