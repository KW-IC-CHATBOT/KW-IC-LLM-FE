import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: number;
  isNew?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  isNew,
}) => {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
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
    </div>
  );
};

export default ChatMessage;
