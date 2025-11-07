import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { UploadProgress as UploadProgressType, UploadError } from '@/types/fileUpload';

interface UploadProgressProps {
  progress: UploadProgressType;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: UploadError | string;
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  status,
  error,
  className
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'uploading':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">File {progress.fileId}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {formatFileSize(progress.loaded)} / {formatFileSize(progress.total)}
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        {/* eslint-disable-next-line react/style-prop-object */}
        <div
          className="h-2 rounded-full transition-all duration-300 bg-blue-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{progress.percentage.toFixed(1)}%</span>
        {status === 'uploading' && progress.speed > 0 && (
          <span>{formatSpeed(progress.speed)}</span>
        )}
        {status === 'uploading' && progress.eta > 0 && (
          <span>ETA: {formatTime(progress.eta)}</span>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
};

interface BatchUploadProgressProps {
  uploads: Map<string, {
    progress: UploadProgressType;
    result?: any;
    error?: UploadError | string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
  }>;
  className?: string;
}

export const BatchUploadProgress: React.FC<BatchUploadProgressProps> = ({
  uploads,
  className
}) => {
  const totalFiles = uploads.size;
  const completedFiles = Array.from(uploads.values()).filter(u => u.status === 'completed').length;
  const errorFiles = Array.from(uploads.values()).filter(u => u.status === 'error').length;
  const uploadingFiles = Array.from(uploads.values()).filter(u => u.status === 'uploading').length;

  const overallProgress = totalFiles > 0
    ? (completedFiles / totalFiles) * 100
    : 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Upload Progress</h3>
        <span className="text-sm text-muted-foreground">
          {completedFiles}/{totalFiles} completed
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="grid gap-3">
        {Array.from(uploads.entries()).map(([fileId, upload]) => (
          <UploadProgress
            key={fileId}
            progress={upload.progress}
            status={upload.status}
            error={upload.error}
          />
        ))}
      </div>

      {errorFiles > 0 && (
        <div className="flex items-center space-x-2 text-sm text-red-500">
          <XCircle className="h-4 w-4" />
          <span>{errorFiles} file{errorFiles > 1 ? 's' : ''} failed to upload</span>
        </div>
      )}

      {uploadingFiles > 0 && (
        <div className="flex items-center space-x-2 text-sm text-blue-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading {uploadingFiles} file{uploadingFiles > 1 ? 's' : ''}...</span>
        </div>
      )}
    </div>
  );
};