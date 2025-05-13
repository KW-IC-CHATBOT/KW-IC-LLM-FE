import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ChatMessage from "../components/ChatMessage";
import MessageSkeleton from "../components/MessageSkeleton";
import ChatInput from "../components/ChatInput";
import { websocketService } from "../services/websocket";

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
  const currentResponseRef = useRef<string>("");
  const currentMessageIdRef = useRef<string>("");
  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;

    // WebSocket 메시지 핸들러 설정
    websocketService.onMessage((chunk) => {
      if (!isComponentMounted.current) return;
      if (chunk === "[EOS]") {
        setIsLoading(false);
        return;
      }
      // 중복 chunk 방지
      if (!currentResponseRef.current.endsWith(chunk)) {
        currentResponseRef.current += chunk;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageIdRef.current
            ? {
                ...msg,
                content: currentResponseRef.current,
                isLoading: false,
              }
            : msg
        )
      );
    });

    // WebSocket 에러 핸들러 설정
    websocketService.onError((error) => {
      if (!isComponentMounted.current) return;
      console.error("WebSocket error:", error);

      let errorMessage = "죄송합니다. 서버와의 통신에 문제가 발생했습니다.";
      let suggestedQuestions = [
        "다시 시도해볼까요?",
        "다른 질문을 해볼까요?",
        "잠시 후 다시 시도해볼까요?",
      ];

      if (error instanceof Error) {
        if (error.name === "InitializationError") {
          errorMessage =
            "서버의 데이터베이스 초기화에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
          suggestedQuestions = [
            "잠시 후 다시 시도해볼까요?",
            "서버 상태를 확인해볼까요?",
            "다른 질문을 해볼까요?",
          ];
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageIdRef.current
            ? {
                ...msg,
                content: errorMessage,
                isLoading: false,
                suggestedQuestions,
              }
            : msg
        )
      );
      setIsLoading(false);
    });

    return () => {
      isComponentMounted.current = false;
      // 컴포넌트 언마운트 시 WebSocket 연결을 유지
      // websocketService.disconnect();
    };
  }, []);

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
      e.type === "submit"
        ? input
        : (e as unknown as { target?: { value: string } }).target?.value;
    if (!messageContent?.trim() || isLoading) return;

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
    currentMessageIdRef.current = skeletonId;
    currentResponseRef.current = "";

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

    // WebSocket을 통해 메시지 전송
    websocketService.sendMessage(messageContent);
  };

  const handleSuggestedQuestionClick = (
    question: string,
    messageId: string
  ) => {
    // 해당 메시지의 추천 질문 제거
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, suggestedQuestions: [] } : msg
      )
    );

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
                  onSuggestedQuestionClick={(question) =>
                    handleSuggestedQuestionClick(question, message.id)
                  }
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
