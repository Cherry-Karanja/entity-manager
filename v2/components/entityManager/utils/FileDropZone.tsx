import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, File, X } from 'lucide-react';
import Image from 'next/image';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  dragActiveText?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  accept,
  maxSize,
  minSize,
  maxFiles = 10,
  disabled = false,
  className,
  placeholder = "Drop files here or click to browse",
  dragActiveText = "Drop files here"
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
    setIsDragActive(false);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive: dropzoneDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    minSize,
    maxFiles,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        dropzoneDragActive || isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {dropzoneDragActive || isDragActive ? dragActiveText : placeholder}
        </p>
        {accept && (
          <p className="text-xs text-muted-foreground">
            Accepted: {Object.values(accept).flat().join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

interface FilePreviewProps {
  file: File;
  preview?: string;
  onRemove?: () => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  preview,
  onRemove,
  className
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("flex items-center space-x-3 p-3 border rounded-lg", className)}>
      {preview ? (
        <Image src={preview} alt={file.name} width={40} height={40} className="object-cover rounded" />
      ) : (
        <File className="h-10 w-10 text-muted-foreground" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 hover:bg-muted rounded"
          type="button"
          aria-label={`Remove ${file.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};