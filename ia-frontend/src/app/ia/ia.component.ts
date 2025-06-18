import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ia-container">
      <h2>IA File Processing</h2>
      <div class="upload-section">
        <input type="file" (change)="onFileSelected($event)" class="file-input" />
        <button (click)="uploadFile()" [disabled]="!selectedFile" class="upload-button">
          Upload and Process
        </button>
      </div>
      
      <div *ngIf="result" class="result-section">
        <h3>Processing Result:</h3>
        <p>{{ result }}</p>
      </div>

      <div *ngIf="errorMessage" class="error-section">
        <h3>Error:</h3>
        <p>{{ errorMessage }}</p>
      </div>

      <div class="history-section">
        <h3>Processing History</h3>
        <div *ngFor="let history of history" class="history-item">
          <span class="timestamp">[{{history.timestamp}}]</span>
          <span class="filename">File: {{history.fileName}}</span>
          <span class="result">Result: {{history.result}}</span>
          <div class="download-buttons">
            <button (click)="downloadFile('original_' + history.fileName)" class="download-button">
              Download Original
            </button>
            <button (click)="downloadFile('translated_' + history.fileName)" class="download-button">
              Download Translated
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ia-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .upload-section {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .file-input {
      margin-right: 10px;
    }

    .upload-button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .upload-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .result-section, .error-section {
      margin: 20px 0;
      padding: 15px;
      border-radius: 8px;
    }

    .result-section {
      background-color: #f8f9fa;
    }

    .error-section {
      background-color: #f8d7da;
      color: #721c24;
    }

    .history-section {
      margin-top: 30px;
    }

    .history-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .timestamp {
      color: #666;
    }

    .filename {
      font-weight: bold;
    }

    .download-buttons {
      display: flex;
      gap: 10px;
      margin-top: 5px;
    }

    .download-button {
      padding: 6px 12px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
    }

    .download-button:hover {
      background-color: #218838;
    }
  `]
})
export class IaComponent implements OnInit {
  selectedFile: File | null = null;
  result: string | null = null;
  errorMessage: string | null = null;
  history: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadHistory();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.result = null;
      this.errorMessage = null;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      this.http.post('http://localhost:8080/ia/process', formData, { 
        responseType: 'text',
        observe: 'response'
      })
        .subscribe({
          next: (response) => {
            this.result = response.body;
            this.errorMessage = null;
            this.loadHistory();
          },
          error: (error) => {
            console.error('Upload error details:', error);
            if (error.error && typeof error.error === 'string' && error.error.startsWith('Translated:')) {
              this.result = error.error;
              this.errorMessage = null;
              this.loadHistory();
            } else {
              let errorMsg = 'Upload failed: ';
              if (error.status) {
                errorMsg += `Status ${error.status}: `;
              }
              if (error.error) {
                errorMsg += error.error;
              } else if (error.message) {
                errorMsg += error.message;
              } else {
                errorMsg += 'Unknown error';
              }
              this.errorMessage = errorMsg;
              this.loadHistory();
            }
          }
        });
    }
  }
  
  loadHistory() {
    console.log('Loading history...');
    this.http.get<any[]>('http://localhost:8080/ia/history')
      .subscribe(
        (data) => {
          console.log('History loaded:', data);
          this.history = data;
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        (error) => {
          this.errorMessage = 'Failed to load history: ' + (error.message || 'Unknown error');
          console.error('History load error:', error);
          this.cdr.detectChanges();
        }
      );
  }

  downloadFile(blobName: string) {
    const url = `http://localhost:8080/ia/download?blobName=${encodeURIComponent(blobName)}`;
    window.open(url, '_blank');
  }
}