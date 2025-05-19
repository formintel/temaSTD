import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <!-- Status de conectare -->
      <div class="connection-status" [class.connected]="isConnected" [class.disconnected]="!isConnected">
        <span *ngIf="isConnected" class="status-text">✅ Conectat la chat server</span>
        <span *ngIf="!isConnected" class="status-text">❌ Deconectat de la chat server</span>
        <button *ngIf="!isConnected" (click)="reconnect()" class="reconnect-btn">
          🔄 Reconectare
        </button>
      </div>

      <!-- Zona de mesaje -->
      <div class="messages-container" #messagesContainer>
        <div *ngIf="messages.length === 0" class="no-messages">
          <p>Nu există mesaje încă. Începe conversația!</p>
        </div>
        
        <div *ngFor="let message of messages" class="message">
          <div class="message-header">
            <span class="username">{{ message.username }}</span>
            <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.message }}</div>
        </div>
      </div>

      <!-- Form pentru noul mesaj -->
      <div class="message-form">
        <div class="form-row">
          <input 
            type="text" 
            [(ngModel)]="username" 
            placeholder="Numele tău" 
            class="username-input"
            [disabled]="!isConnected">
          
          <input 
            type="text" 
            [(ngModel)]="newMessage" 
            placeholder="Scrie un mesaj..." 
            class="message-input"
            [disabled]="!isConnected"
            (keyup.enter)="sendMessage()">
          
          <button 
            (click)="sendMessage()" 
            [disabled]="!isConnected || !canSend()"
            class="send-btn">
            📤 Trimite
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      max-width: 800px;
      margin: 0 auto;
      height: 600px;
      border: 1px solid #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .connection-status {
      padding: 10px;
      text-align: center;
      font-weight: bold;
      border-bottom: 1px solid #eee;
    }

    .connection-status.connected {
      background-color: #d4edda;
      color: #155724;
    }

    .connection-status.disconnected {
      background-color: #f8d7da;
      color: #721c24;
    }

    .reconnect-btn {
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }

    .reconnect-btn:hover {
      background-color: #0056b3;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background-color: #f8f9fa;
    }

    .no-messages {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      margin-top: 50px;
    }

    .message {
      margin-bottom: 15px;
      padding: 10px;
      background: white;
      border-radius: 8px;
      border-left: 4px solid #007bff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 0.9em;
    }

    .username {
      font-weight: bold;
      color: #007bff;
    }

    .timestamp {
      color: #6c757d;
      font-size: 0.8em;
    }

    .message-content {
      color: #333;
      line-height: 1.4;
    }

    .message-form {
      padding: 15px;
      border-top: 1px solid #eee;
      background: white;
    }

    .form-row {
      display: flex;
      gap: 10px;
    }

    .username-input {
      flex: 0 0 150px;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }

    .message-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }

    .send-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background-color: #28a745;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }

    .send-btn:hover:not(:disabled) {
      background-color: #218838;
    }

    .send-btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    input:disabled {
      background-color: #e9ecef;
      cursor: not-allowed;
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  isConnected: boolean = false;
  username: string = '';
  newMessage: string = '';

  private messagesSubscription: Subscription = new Subscription();
  private connectionSubscription: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Subscribe to messages
    this.messagesSubscription = this.chatService.getMessages().subscribe(
      messages => {
        this.messages = messages;
        this.scrollToBottom();
      }
    );

    // Subscribe to connection status
    this.connectionSubscription = this.chatService.getConnectionStatus().subscribe(
      status => {
        this.isConnected = status;
      }
    );
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.connectionSubscription.unsubscribe();
  }

  sendMessage() {
    if (this.canSend()) {
      this.chatService.sendMessage(this.username.trim(), this.newMessage.trim());
      this.newMessage = '';
    }
  }

  canSend(): boolean {
    return this.username.trim().length > 0 && 
           this.newMessage.trim().length > 0 && 
           this.isConnected;
  }

  reconnect() {
    this.chatService.manualReconnect();
  }

  formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  }

  private scrollToBottom() {
    // Verifică dacă rulează în browser (nu pe server)
    if (isPlatformBrowser(this.platformId)) {
      // Angular change detection cycle needs to complete first
      setTimeout(() => {
        if (this.messagesContainer && this.messagesContainer.nativeElement) {
          const element = this.messagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }
      }, 100);
    }
  }
}