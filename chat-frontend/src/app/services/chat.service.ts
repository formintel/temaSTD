import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: WebSocket | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private connectionSubject = new BehaviorSubject<boolean>(false);
  private reconnectInterval: any;
  private reconnectDelay = 5000; // 5 seconds

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Doar inițializează WebSocket în browser
    if (isPlatformBrowser(this.platformId)) {
      this.connect();
    }
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  private connect() {
    // Verifică din nou dacă suntem în browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      // Verifică suportul pentru WebSocket
      if (!window.WebSocket) {
        console.error('WebSocket nu este suportat în acest browser');
        return;
      }

      this.socket = new WebSocket(environment.wsUrl);

      this.socket.onopen = () => {
        console.log('Conectat la server WebSocket');
        this.connectionSubject.next(true);
        this.clearReconnectInterval();
      };

      this.socket.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data);
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, message]);
        } catch (error) {
          console.error('Eroare la parsarea mesajului:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('Conexiune WebSocket închisă:', event.reason);
        this.connectionSubject.next(false);
        this.socket = null;
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('Eroare WebSocket:', error);
        this.connectionSubject.next(false);
      };

    } catch (error) {
      console.error('Eroare la crearea conexiunii WebSocket:', error);
      this.connectionSubject.next(false);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.clearReconnectInterval();
    
    console.log(`Încercare de reconectare în ${this.reconnectDelay / 1000} secunde...`);
    
    this.reconnectInterval = setTimeout(() => {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        console.log('Încerc să mă reconectez...');
        this.connect();
      }
    }, this.reconnectDelay);
  }

  private clearReconnectInterval() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  sendMessage(username: string, message: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const chatMessage: ChatMessage = {
        username: username,
        message: message,
        timestamp: new Date().toISOString()
      };

      this.socket.send(JSON.stringify(chatMessage));
    } else {
      console.error('WebSocket nu este conectat');
    }
  }

  manualReconnect() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.clearReconnectInterval();
    
    if (this.socket) {
      this.socket.close();
    }
    
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  disconnect() {
    this.clearReconnectInterval();
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.connectionSubject.next(false);
  }
}