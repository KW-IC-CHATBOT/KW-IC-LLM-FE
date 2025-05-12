import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ChatMessage from "../components/ChatMessage";
import MessageSkeleton from "../components/MessageSkeleton";
import ChatInput from "../components/ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: string;
  isLoading?: boolean;
}

const ChatHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 광운대학교 정보융합학부 챗봇입니다. 무엇을 도와드릴까요?",
      timestamp: new Date(),
      id: "initial",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageId = generateMessageId();
    const newMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
      id: userMessageId,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // 스켈레톤 메시지 추가
    const skeletonId = generateMessageId();
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        id: skeletonId,
        isLoading: true,
      },
    ]);

    // 실제 응답을 받는 부분 (현재는 타임아웃으로 대체)
    setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === skeletonId
            ? {
                ...msg,
                content: "죄송합니다. 아직 응답을 준비 중입니다.",
                isLoading: false,
              }
            : msg
        )
      );
    }, 2000);
  };

  return (
    <div className="flex justify-center h-[100dvh] items-center bg-white relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/kw.svg"
          alt="광운대학교 로고"
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 opacity-5"
        />
      </div>
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-full bg-white shadow-lg overflow-hidden flex flex-col relative z-10">
        <Header />

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-gray-50 relative">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <img
              src="/kw.svg"
              alt="광운대학교 로고"
              className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 opacity-5"
            />
          </div>
          <div className="relative z-10">
            {messages.map((message) =>
              message.isLoading ? (
                <MessageSkeleton key={message.id} />
              ) : (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  id={message.id}
                  isNew={message.id.includes("_")}
                />
              )
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatHome;
