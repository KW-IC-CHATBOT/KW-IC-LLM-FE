import React, { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: string;
  isNew?: boolean;
  suggestedQuestions?: string[];
  onSuggestedQuestionClick?: (question: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  isNew,
  suggestedQuestions = [],
  onSuggestedQuestionClick,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleQuestionClick = (question: string) => {
    setIsFadingOut(true);
    // 애니메이션이 완료된 후 콜백 실행
    setTimeout(() => {
      onSuggestedQuestionClick?.(question);
    }, 300); // 애니메이션 지속 시간과 동일하게 설정
  };

  return (
    <div
      className={`flex flex-col ${
        role === "user" ? "items-end" : "items-start"
      } ${isNew ? "message-animation" : ""}`}
    >
      <div className="flex items-end gap-1">
        {role === "user" && (
          <span className="text-xs text-gray-500 mb-1">
            {timestamp.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        )}
        <div
          className={`max-w-[80%] rounded-2xl p-3 ${
            role === "user"
              ? "bg-[#800020] text-white rounded-tr-none my-1"
              : "bg-white border border-gray-200 rounded-tl-none text-gray-800 my-1"
          }`}
        >
          {content}
        </div>
        {role === "assistant" && (
          <span className="text-xs text-gray-500 mb-1">
            {timestamp.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        )}
      </div>
      {role === "assistant" &&
        suggestedQuestions.length > 0 &&
        !isFadingOut && (
          <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      {role === "assistant" && isFadingOut && (
        <div className="mt-2 flex flex-wrap gap-2 max-w-[80%] suggested-questions-fade-out">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full"
              disabled
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
