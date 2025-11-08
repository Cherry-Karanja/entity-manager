import {
  FileUploadOptions,
  FileChunk,
  UploadProgress,
  UploadResult,
  UploadError,
  ResumableUpload,
  UploadQueueItem,
  BatchUploadOptions,
  UploadSession,
  FileValidationResult,
  FilePreview
} from '../components/entityManager/utils/types/fileUpload';

export class AdvancedFileUploadManager {
  private activeUploads = new Map<string, ResumableUpload>();
  private uploadQueue: UploadQueueItem[] = [];
  private sessions = new Map<string, UploadSession>();
  private maxConcurrentUploads: number;
  private activeUploadsCount = 0;
  private eventListeners = new Map<string, Set<(data: any) => void>>();

  constructor(maxConcurrentUploads = 3) {
    this.maxConcurrentUploads = maxConcurrentUploads;
  }

  // File validation
  async validateFile(file: File, options: {
    accept?: string[];
    maxSize?: number;
    minSize?: number;
  } = {}): Promise<FileValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file type
    if (options.accept && options.accept.length > 0) {
      const acceptedTypes = options.accept.map(type => type.toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        }
        return fileType.includes(type.replace('*', ''));
      });

      if (!isAccepted) {
        errors.push(`File type not accepted. Accepted types: ${options.accept.join(', ')}`);
      }
    }

    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`File size exceeds maximum allowed size of ${this.formatBytes(options.maxSize)}`);
    }

    if (options.minSize && file.size < options.minSize) {
      errors.push(`File size is below minimum required size of ${this.formatBytes(options.minSize)}`);
    }

    // Check for potentially dangerous files
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (dangerousExtensions.includes(fileExtension)) {
      errors.push('This file type is not allowed for security reasons');
    }

    // Warnings for large files
    if (file.size > 100 * 1024 * 1024) { // 100MB
      warnings.push('This is a very large file. Upload may take a long time.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // File preview generation
  async generatePreview(file: File): Promise<FilePreview> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);

      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({
            file,
            url,
            type: 'image',
            dimensions: { width: img.width, height: img.height }
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };
        img.src = url;
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          resolve({
            file,
            url,
            type: 'video',
            duration: video.duration,
            dimensions: { width: video.videoWidth, height: video.videoHeight }
          });
        };
        video.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load video'));
        };
        video.src = url;
      } else if (file.type.startsWith('audio/')) {
        const audio = document.createElement('audio');
        audio.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          resolve({
            file,
            url,
            type: 'audio',
            duration: audio.duration
          });
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load audio'));
        };
        audio.src = url;
      } else {
        // For other file types, just return basic info
        resolve({
          file,
          url,
          type: this.getFileType(file)
        });
      }
    });
  }

  private getFileType(file: File): FilePreview['type'] {
    const type = file.type;

    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';

    // Check file extension for documents
    const extension = file.name.toLowerCase().split('.').pop();
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

    if (documentExtensions.includes(extension || '')) {
      return 'document';
    }

    return 'other';
  }

  // Chunked upload
  async uploadFile(
    file: File,
    endpoint: string,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> {
    const fileId = this.generateFileId();
    const chunks = this.createChunks(file, options.chunkSize || 1024 * 1024); // 1MB chunks

    const resumableUpload: ResumableUpload = {
      fileId,
      file,
      chunks,
      uploadedChunks: new Set(),
      options,
      status: 'pending',
      progress: {
        fileId,
        loaded: 0,
        total: file.size,
        percentage: 0,
        speed: 0,
        eta: 0,
        totalChunks: chunks.length
      },
      startTime: Date.now()
    };

    this.activeUploads.set(fileId, resumableUpload);

    try {
      const result = await this.performChunkedUpload(resumableUpload, endpoint);
      resumableUpload.status = 'completed';
      this.emit('uploadComplete', { fileId, result });
      return result;
    } catch (error) {
      resumableUpload.status = 'error';
      this.emit('uploadError', { fileId, error });
      throw error;
    } finally {
      this.activeUploads.delete(fileId);
    }
  }

  private createChunks(file: File, chunkSize: number): FileChunk[] {
    const chunks: FileChunk[] = [];
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunkData = file.slice(start, end);

      chunks.push({
        id: `${this.generateFileId()}_${i}`,
        fileId: this.generateFileId(),
        index: i,
        data: chunkData,
        size: chunkData.size,
        uploaded: false
      });
    }

    return chunks;
  }

  private async performChunkedUpload(
    upload: ResumableUpload,
    endpoint: string
  ): Promise<UploadResult> {
    const { chunks, options } = upload;
    let uploadedBytes = 0;
    let lastProgressTime = Date.now();

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Skip already uploaded chunks (for resume)
      if (upload.uploadedChunks.has(i)) {
        uploadedBytes += chunk.size;
        continue;
      }

      try {
        await this.uploadChunk(chunk, endpoint, options);
        chunk.uploaded = true;
        chunk.uploadTime = Date.now();
        upload.uploadedChunks.add(i);

        uploadedBytes += chunk.size;

        // Update progress
        const now = Date.now();
        const timeDiff = (now - lastProgressTime) / 1000;
        const speed = timeDiff > 0 ? (chunk.size / timeDiff) : 0;

        upload.progress.loaded = uploadedBytes;
        upload.progress.percentage = (uploadedBytes / upload.file.size) * 100;
        upload.progress.speed = speed;
        upload.progress.currentChunk = i + 1;
        upload.progress.eta = speed > 0 ? (upload.file.size - uploadedBytes) / speed : 0;

        options.onProgress?.(upload.progress);
        options.onChunkComplete?.(chunk);

        lastProgressTime = now;

        this.emit('chunkComplete', { fileId: upload.fileId, chunk });

      } catch (error) {
        const uploadError: UploadError = {
          fileId: upload.fileId,
          type: 'chunk',
          message: `Failed to upload chunk ${i + 1}`,
          chunkIndex: i,
          retryable: true,
          details: error
        };

        if (options.maxRetries && options.maxRetries > 0) {
          // Implement retry logic here
          console.log(`Retrying chunk ${i + 1}...`);
          i--; // Retry the same chunk
          continue;
        }

        throw uploadError;
      }
    }

    // Finalize upload
    const finalizeResult = await this.finalizeUpload(upload, endpoint);

    return {
      fileId: upload.fileId,
      url: finalizeResult.url,
      size: upload.file.size,
      hash: finalizeResult.hash,
      chunks: chunks.length,
      uploadTime: Date.now() - upload.startTime,
      metadata: finalizeResult.metadata
    };
  }

  private async uploadChunk(
    chunk: FileChunk,
    endpoint: string,
    options: FileUploadOptions
  ): Promise<void> {
    const formData = new FormData();
    formData.append('chunk', chunk.data);
    formData.append('chunkIndex', chunk.index.toString());
    formData.append('fileId', chunk.fileId);
    formData.append('totalChunks', 'unknown'); // Would be set properly in a real implementation

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: options.headers,
        signal: controller.signal,
        credentials: options.withCredentials ? 'include' : 'same-origin'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Upload timeout');
      }
      throw error;
    }
  }

  private async finalizeUpload(
    upload: ResumableUpload,
    endpoint: string
  ): Promise<{ url: string; hash: string; metadata?: any }> {
    // In a real implementation, this would call a finalize endpoint
    // For now, return mock data
    return {
      url: `${endpoint}/files/${upload.fileId}`,
      hash: await this.calculateFileHash(upload.file),
      metadata: {
        originalName: upload.file.name,
        mimeType: upload.file.type,
        uploadedAt: new Date().toISOString()
      }
    };
  }

  // Resumable upload support
  pauseUpload(fileId: string): boolean {
    const upload = this.activeUploads.get(fileId);
    if (upload && upload.status === 'uploading') {
      upload.status = 'paused';
      upload.pauseTime = Date.now();
      this.emit('uploadPaused', { fileId });
      return true;
    }
    return false;
  }

  resumeUpload(fileId: string): boolean {
    const upload = this.activeUploads.get(fileId);
    if (upload && upload.status === 'paused') {
      upload.status = 'uploading';
      // In a real implementation, this would resume from the last uploaded chunk
      this.emit('uploadResumed', { fileId });
      return true;
    }
    return false;
  }

  cancelUpload(fileId: string): boolean {
    const upload = this.activeUploads.get(fileId);
    if (upload) {
      upload.status = 'error';
      this.activeUploads.delete(fileId);
      this.emit('uploadCancelled', { fileId });
      return true;
    }
    return false;
  }

  // Batch upload
  async createBatchUpload(
    files: File[],
    endpoint: string,
    options: BatchUploadOptions = {}
  ): Promise<UploadSession> {
    const sessionId = this.generateFileId();
    const queueItems: UploadQueueItem[] = files.map((file, index) => ({
      id: `${sessionId}_${index}`,
      file,
      priority: 0,
      options: {},
      status: 'queued',
      progress: {
        fileId: `${sessionId}_${index}`,
        loaded: 0,
        total: file.size,
        percentage: 0,
        speed: 0,
        eta: 0
      },
      createdAt: Date.now()
    }));

    const session: UploadSession = {
      id: sessionId,
      files: queueItems,
      options,
      status: 'pending',
      progress: {
        completed: 0,
        total: files.length,
        percentage: 0
      },
      results: [],
      errors: [],
      createdAt: Date.now()
    };

    this.sessions.set(sessionId, session);
    this.uploadQueue.push(...queueItems);

    // Start processing the queue
    this.processUploadQueue(endpoint, options);

    return session;
  }

  private async processUploadQueue(
    endpoint: string,
    batchOptions: BatchUploadOptions
  ): Promise<void> {
    const concurrency = batchOptions.concurrency || this.maxConcurrentUploads;

    while (this.activeUploadsCount < concurrency && this.uploadQueue.length > 0) {
      const item = this.uploadQueue.shift();
      if (!item) break;

      this.activeUploadsCount++;
      item.status = 'uploading';
      item.startedAt = Date.now();

      try {
        const result = await this.uploadFile(item.file, endpoint, item.options);
        item.status = 'completed';
        item.completedAt = Date.now();
        item.result = result;

        // Update session progress
        this.updateSessionProgress(item.id, result);

        batchOptions.onBatchProgress?.(
          this.sessions.get(item.id.split('_')[0])?.progress.completed || 0,
          this.sessions.get(item.id.split('_')[0])?.progress.total || 0,
          this.sessions.get(item.id.split('_')[0])?.results || [],
          this.sessions.get(item.id.split('_')[0])?.errors || []
        );

      } catch (error) {
        item.status = 'error';
        item.error = error as UploadError;

        // Update session errors
        const sessionId = item.id.split('_')[0];
        const session = this.sessions.get(sessionId);
        if (session) {
          session.errors.push(error as UploadError);
        }

        if (!batchOptions.continueOnError) {
          break;
        }
      } finally {
        this.activeUploadsCount--;
      }
    }

    // Check if batch is complete
    const sessionId = this.uploadQueue[0]?.id.split('_')[0];
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (session && session.progress.completed + session.errors.length >= session.progress.total) {
        session.status = session.errors.length > 0 ? 'error' : 'completed';
        session.completedAt = Date.now();

        batchOptions.onBatchComplete?.(session.results, session.errors);
        this.emit('batchComplete', { sessionId, session });
      }
    }
  }

  private updateSessionProgress(itemId: string, result: UploadResult): void {
    const sessionId = itemId.split('_')[0];
    const session = this.sessions.get(sessionId);
    if (session) {
      session.progress.completed++;
      session.progress.percentage = (session.progress.completed / session.progress.total) * 100;
      session.results.push(result);
    }
  }

  // Utility methods
  private generateFileId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private async calculateFileHash(file: File): Promise<string> {
    // Simple hash calculation - in production, use a proper crypto hash
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Event system
  on(event: string, listener: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(listener);
    }
  }

  off(event: string, listener: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in upload event listener:', error);
        }
      });
    }
  }

  // Cleanup
  destroy(): void {
    // Cancel all active uploads
    for (const [fileId] of this.activeUploads) {
      this.cancelUpload(fileId);
    }

    this.activeUploads.clear();
    this.uploadQueue.length = 0;
    this.sessions.clear();
    this.eventListeners.clear();
  }
}

// Global upload manager instance
let uploadManager: AdvancedFileUploadManager | null = null;

export const getUploadManager = (maxConcurrentUploads?: number): AdvancedFileUploadManager => {
  if (!uploadManager) {
    uploadManager = new AdvancedFileUploadManager(maxConcurrentUploads);
  }
  return uploadManager;
};

export const destroyUploadManager = (): void => {
  if (uploadManager) {
    uploadManager.destroy();
    uploadManager = null;
  }
};