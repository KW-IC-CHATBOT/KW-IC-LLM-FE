import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatHome from "./pages/chat-home";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatHome />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
}
