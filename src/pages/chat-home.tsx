import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ChatMessage from "../components/ChatMessage";
import MessageSkeleton from "../components/MessageSkeleton";
import ChatInput from "../components/ChatInput";
import { clarity } from "react-microsoft-clarity";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: string;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}

const ChatHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 광운대학교 정보융합학부 챗봇입니다. 무엇을 도와드릴까요?",
      timestamp: new Date(),
      id: "initial",
      suggestedQuestions: [
        "정보융합학부는 어떤 학부인가요?",
        "전공 선택은 어떻게 하나요?",
        "졸업 요건이 어떻게 되나요?",
      ],
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
    const messageContent =
      e.type === "submit" ? input : (e as any).target?.value;
    if (!messageContent?.trim() || isLoading) return;

    // 사용자 메시지 전송 이벤트 추적
    clarity.setEvent("user_message_sent");
    clarity.setTag("message_length", messageContent.length.toString());

    const userMessageId = generateMessageId();
    const newMessage: Message = {
      role: "user",
      content: messageContent,
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
                suggestedQuestions: [
                  "다른 질문이 있으신가요?",
                  "더 자세한 설명이 필요하신가요?",
                  "다른 주제로 이야기해볼까요?",
                ],
              }
            : msg
        )
      );
      // 챗봇 응답 이벤트 추적
      clarity.setEvent("bot_response_received");
    }, 2000);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    // 추천 질문 클릭 이벤트 추적
    clarity.setEvent("suggested_question_clicked");
    clarity.setTag("question", question);

    const formEvent = {
      preventDefault: () => {},
      type: "suggested",
      target: { value: question },
    } as unknown as React.FormEvent;
    handleSubmit(formEvent);
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
                  suggestedQuestions={message.suggestedQuestions}
                  onSuggestedQuestionClick={handleSuggestedQuestionClick}
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
