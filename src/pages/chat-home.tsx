import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ChatMessage from "../components/ChatMessage";
import MessageSkeleton from "../components/MessageSkeleton";
import ChatInput from "../components/ChatInput";
import { websocketService } from "../services/websocket";
import { useMessages } from "../hooks/useMessages";

const ChatHome: React.FC = () => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    setIsLoading,
    addUserMessage,
    addAssistantMessage,
    removeSuggestedQuestions,
  } = useMessages();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent =
      e.type === "submit"
        ? input
        : (e as unknown as { target?: { value: string } }).target?.value;
    if (!messageContent?.trim() || isLoading) return;

    addUserMessage(messageContent);
    setInput("");
    setIsLoading(true);
    addAssistantMessage();
    websocketService.sendMessage(messageContent);
  };

  const handleSuggestedQuestionClick = (
    question: string,
    messageId: string
  ) => {
    removeSuggestedQuestions(messageId);

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
