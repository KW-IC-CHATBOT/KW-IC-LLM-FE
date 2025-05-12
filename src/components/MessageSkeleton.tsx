import React from "react";

const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-1">
        <div className="max-w-[80%] rounded-2xl p-3 bg-white border border-gray-200 rounded-tl-none text-gray-800 my-1">
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <span className="text-xs text-gray-500 mb-1">
          {new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageSkeleton;
