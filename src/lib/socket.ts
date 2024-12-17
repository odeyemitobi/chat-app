import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  onMessage(event: string, callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

export const socketService = new SocketService();
