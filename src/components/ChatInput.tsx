import React from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl border-t border-gray-200 p-4 bg-white dark:bg-gray-900"
    >
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#800020] text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`w-10 h-10 sm:w-12 sm:h-12 ${
            isLoading ? "bg-gray-400" : "bg-[#800020] hover:bg-[#600018]"
          } text-white rounded-full focus:outline-none flex items-center justify-center transition-colors`}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
