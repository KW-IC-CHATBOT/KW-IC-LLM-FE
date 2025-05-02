import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: number;
}

const ChatHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 광운대학교 정보융합학부 챗봇입니다. 무엇을 도와드릴까요?",
      timestamp: new Date(),
      id: 0,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastMessageId, setLastMessageId] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newId = lastMessageId + 1;
    const newMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
      id: newId,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLastMessageId(newId);

    // TODO: API 연동 후 실제 응답 구현
    setTimeout(() => {
      const assistantId = newId + 1;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다. 아직 응답을 준비 중입니다.",
          timestamp: new Date(),
          id: assistantId,
        },
      ]);
      setLastMessageId(assistantId);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md h-[90vh] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
        {/* 헤더 */}
        <header className="bg-[#800020] text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              광운대학교 정보융합학부 챗봇
            </h1>
            <a
              href="https://ic.kw.ac.kr:501/main/main.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] bg-white text-[#800020] px-3 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              IC
            </a>
          </div>
        </header>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } ${message.id > lastMessageId - 2 ? "message-animation" : ""}`}
            >
              <div className="flex items-end gap-1">
                {message.role === "user" && (
                  <span className="text-xs text-gray-500 mb-1">
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === "user"
                      ? "bg-[#800020] text-white rounded-tr-none"
                      : "bg-white border border-gray-200 rounded-tl-none text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "assistant" && (
                  <span className="text-xs text-gray-500 mb-1">
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-4 bg-white"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#800020] text-gray-800 placeholder-gray-500"
            />
            <button
              type="submit"
              className="w-12 h-12 bg-[#800020] text-white rounded-full hover:bg-[#600018] focus:outline-none flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
      </div>
    </div>
  );
};

export default ChatHome;
