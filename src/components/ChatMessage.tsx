import React from "react";

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
      {role === "assistant" && suggestedQuestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSuggestedQuestionClick?.(question)}
              className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
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
