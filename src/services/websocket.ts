class WebSocketService {
  private ws: WebSocket | null = null;
  private wsUrl: string;
  private messageHandlers: ((chunk: string) => void)[] = [];
  private errorHandlers: ((error: Error | Event) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private connectionTimeoutDuration = 10000; // 10초로 증가
  private messageQueue: string[] = [];
  private isConnecting = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isDisconnecting = false;
  private isInitialized = false;
  private initializationError = false;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
    this.connect();
  }

  private connect() {
    if (this.isConnecting || this.isDisconnecting) return;
    this.isConnecting = true;
    this.initializationError = false;

    console.log("WebSocket 연결 시도 (URL:", this.wsUrl, ")");
    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(this.wsUrl);

      // 연결 타임아웃 설정
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.log("WebSocket 연결 타임아웃");
          this.ws.close();
          // 타임아웃 시 즉시 재연결 시도
          if (
            !this.isDisconnecting &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.reconnectAttempts++;
            this.connect();
          }
        }
      }, this.connectionTimeoutDuration);

      this.ws.onopen = () => {
        console.log("WebSocket 연결됨");
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.isInitialized = true;
        this.sendQueuedMessages();
      };

      this.ws.onmessage = (event) => {
        try {
          // JSON 파싱 시도
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              console.error("서버 에러:", data.error);
              const error = new Error(data.error);

              if (
                data.error.includes("index 0 is out of bounds") ||
                data.error.includes("vector_store") ||
                data.error.includes("FAISS") ||
                data.error.includes("embeddings")
              ) {
                error.name = "InitializationError";
                this.initializationError = true;
                this.isInitialized = false;
              }

              this.errorHandlers.forEach((handler) => handler(error));
            } else if (data.content) {
              this.messageHandlers.forEach((handler) => handler(data.content));
            }
          } catch {
            // JSON 파싱 실패 시 일반 텍스트로 처리
            const text = event.data.trim();
            if (text) {
              console.log("일반 텍스트 메시지 수신:", text);
              this.messageHandlers.forEach((handler) => handler(text));
            }
          }
        } catch (error) {
          console.error("메시지 처리 중 에러:", error);
          this.errorHandlers.forEach((handler) =>
            handler(error instanceof Error ? error : new Error(String(error)))
          );
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket 에러:", error);
        this.isConnecting = false;
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        this.errorHandlers.forEach((handler) => handler(error));
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket 연결 종료", event.code);
        this.isConnecting = false;
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        this.ws = null;
        this.isInitialized = false;

        if (
          !this.isDisconnecting &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          console.log(
            `WebSocket 재연결 시도 ${this.reconnectAttempts + 1}/${
              this.maxReconnectAttempts
            } (${this.reconnectDelay}ms 후)`
          );
          if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
          }
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      this.isConnecting = false;
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      this.errorHandlers.forEach((handler) =>
        handler(error instanceof Error ? error : new Error(String(error)))
      );
    }
  }

  private sendQueuedMessages() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  public sendMessage(message: string) {
    if (this.initializationError) {
      console.log("서버 초기화 에러가 발생했습니다. 메시지를 큐에 추가합니다.");
      this.messageQueue.push(message);
      return;
    }

    if (!this.isInitialized) {
      console.log("서버가 초기화되지 않았습니다. 메시지를 큐에 추가합니다.");
      this.messageQueue.push(message);
      if (
        !this.isConnecting &&
        !this.isDisconnecting &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.connect();
      }
      return;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log("WebSocket이 연결되어 있지 않아 메시지를 큐에 추가합니다.");
      this.messageQueue.push(message);
      if (
        !this.isConnecting &&
        !this.isDisconnecting &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.connect();
      }
      return;
    }

    try {
      this.ws.send(JSON.stringify({ query: message }));
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      this.errorHandlers.forEach((handler) =>
        handler(error instanceof Error ? error : new Error(String(error)))
      );
    }
  }

  public onMessage(handler: (chunk: string) => void) {
    this.messageHandlers.push(handler);
  }

  public onError(handler: (error: Error | Event) => void) {
    this.errorHandlers.push(handler);
  }

  public disconnect() {
    this.isDisconnecting = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    this.isInitialized = false;
    this.initializationError = false;
  }
}

// 환경 변수에서 WebSocket URL 가져오기
const wsUrl = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/ws";

// WebSocket 서비스 인스턴스 생성
export const websocketService = new WebSocketService(wsUrl);
