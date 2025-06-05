export const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getErrorMessage = (error: Error) => {
  let errorMessage = "죄송합니다. 서버와의 통신에 문제가 발생했습니다.";
  let suggestedQuestions = [
    "다시 시도해볼까요?",
    "다른 질문을 해볼까요?",
    "잠시 후 다시 시도해볼까요?",
  ];

  if (error.name === "InitializationError") {
    errorMessage =
      "서버의 데이터베이스 초기화에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    suggestedQuestions = [
      "잠시 후 다시 시도해볼까요?",
      "서버 상태를 확인해볼까요?",
      "다른 질문을 해볼까요?",
    ];
  }

  return { errorMessage, suggestedQuestions };
};
