export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: string;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}
