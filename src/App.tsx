import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatHome from "./pages/chat-home";
import "./App.css";
import { clarity } from "react-microsoft-clarity";
import { useEffect } from "react";

// Clarity 초기화
const CLARITY_ID = "YOUR_CLARITY_ID"; // 실제 Clarity ID로 교체 필요

export default function App() {
  useEffect(() => {
    // Clarity 초기화
    clarity.init(CLARITY_ID);

    // 쿠키 동의 설정
    clarity.consent();

    // 사용자 식별 (필요한 경우)
    // clarity.identify('USER_ID', { userProperty: 'value' });

    return () => {
      // 컴포넌트 언마운트 시 Clarity 중지
      clarity.stop();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatHome />} />
        <Route path="/" element={<ChatHome />} />
      </Routes>
    </Router>
  );
}
