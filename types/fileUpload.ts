export interface FileUploadOptions {
  chunkSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  onProgress?: (progress: UploadProgress) => void;
  onChunkComplete?: (chunk: FileChunk) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: UploadError) => void;
}

export interface FileChunk {
  id: string;
  fileId: string;
  index: number;
  data: Blob;
  size: number;
  hash?: string;
  uploaded: boolean;
  uploadTime?: number;
}

export interface UploadProgress {
  fileId: string;
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  eta: number; // estimated time of arrival in seconds
  currentChunk?: number;
  totalChunks?: number;
}

export interface UploadResult {
  fileId: string;
  url: string;
  size: number;
  hash: string;
  chunks: number;
  uploadTime: number;
  metadata?: Record<string, any>;
}

export interface UploadError {
  fileId: string;
  type: 'network' | 'server' | 'validation' | 'chunk' | 'timeout';
  message: string;
  chunkIndex?: number;
  retryable: boolean;
  details?: any;
}

export interface ResumableUpload {
  fileId: string;
  file: File;
  chunks: FileChunk[];
  uploadedChunks: Set<number>;
  options: FileUploadOptions;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
  progress: UploadProgress;
  startTime: number;
  pauseTime?: number;
  resumeToken?: string;
}

export interface DragDropConfig {
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  disabled?: boolean;
  multiple?: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FilePreview {
  file: File;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  dimensions?: { width: number; height: number };
  duration?: number; // for video/audio
  pages?: number; // for PDFs
}

export interface UploadQueueItem {
  id: string;
  file: File;
  priority: number;
  options: FileUploadOptions;
  status: 'queued' | 'uploading' | 'completed' | 'error' | 'cancelled';
  progress: UploadProgress;
  result?: UploadResult;
  error?: UploadError;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface BatchUploadOptions {
  concurrency?: number;
  continueOnError?: boolean;
  onBatchProgress?: (completed: number, total: number, results: UploadResult[], errors: UploadError[]) => void;
  onBatchComplete?: (results: UploadResult[], errors: UploadError[]) => void;
}

export interface UploadSession {
  id: string;
  files: UploadQueueItem[];
  options: BatchUploadOptions;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled';
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  results: UploadResult[];
  errors: UploadError[];
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}