import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getUploadManager, AdvancedFileUploadManager } from '@/components/entityManager/utils/advancedFileUpload';
import {
  FileUploadOptions,
  UploadProgress,
  UploadResult,
  UploadError,
  FileValidationResult,
  FilePreview,
  DragDropConfig
} from '@/components/entityManager/utils/types/fileUpload';

interface UseFileUploadOptions extends FileUploadOptions {
  autoUpload?: boolean;
  validateOnSelect?: boolean;
  generatePreview?: boolean;
  accept?: string[];
  maxSize?: number;
  minSize?: number;
  endpoint?: string;
}

export const useFileUpload = ({
  autoUpload = true,
  validateOnSelect = true,
  generatePreview = true,
  ...uploadOptions
}: UseFileUploadOptions = {}) => {
  const [uploadManager] = useState(() => getUploadManager());
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [validationResults, setValidationResults] = useState<FileValidationResult[]>([]);
  const [uploads, setUploads] = useState<Map<string, {
    progress: UploadProgress;
    result?: UploadResult;
    error?: UploadError;
    status: 'pending' | 'uploading' | 'completed' | 'error';
  }>>(new Map());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File selection
  const selectFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);

    setFiles(fileArray);
    setValidationResults([]);
    setPreviews([]);

    // Validate files
    if (validateOnSelect) {
      const validations = await Promise.all(
        fileArray.map(file => uploadManager.validateFile(file, {
          accept: uploadOptions.accept,
          maxSize: uploadOptions.maxSize,
          minSize: uploadOptions.minSize
        }))
      );
      setValidationResults(validations);

      // Filter out invalid files
      const validFiles = fileArray.filter((_, index) => validations[index].valid);
      setFiles(validFiles);
    }

    // Generate previews
    if (generatePreview) {
      try {
        const previewPromises = fileArray.map(file => uploadManager.generatePreview(file));
        const previewResults = await Promise.all(previewPromises);
        setPreviews(previewResults);
      } catch (error) {
        console.error('Failed to generate previews:', error);
      }
    }

    // Auto upload if enabled
    if (autoUpload && fileArray.length > 0) {
      uploadFiles(fileArray, uploadOptions.endpoint || '/api/upload');
    }
  }, [uploadManager, validateOnSelect, generatePreview, autoUpload, uploadOptions]);

  // Upload files
  const uploadFiles = useCallback(async (filesToUpload: File[], endpoint: string) => {
    for (const file of filesToUpload) {
      const fileId = `upload_${Date.now()}_${Math.random()}`;

      setUploads(prev => new Map(prev.set(fileId, {
        progress: {
          fileId,
          loaded: 0,
          total: file.size,
          percentage: 0,
          speed: 0,
          eta: 0
        },
        status: 'pending'
      })));

      try {
        const result = await uploadManager.uploadFile(file, endpoint, {
          ...uploadOptions,
          onProgress: (progress) => {
            setUploads(prev => {
              const current = prev.get(fileId);
              if (current) {
                prev.set(fileId, { ...current, progress, status: 'uploading' });
              }
              return new Map(prev);
            });
          }
        });

        setUploads(prev => {
          const current = prev.get(fileId);
          if (current) {
            prev.set(fileId, { ...current, result, status: 'completed' });
          }
          return new Map(prev);
        });

      } catch (error) {
        setUploads(prev => {
          const current = prev.get(fileId);
          if (current) {
            prev.set(fileId, {
              ...current,
              error: error as UploadError,
              status: 'error'
            });
          }
          return new Map(prev);
        });
      }
    }
  }, [uploadManager, uploadOptions]);

  // Control methods
  const pauseUpload = useCallback((fileId: string) => {
    return uploadManager.pauseUpload(fileId);
  }, [uploadManager]);

  const resumeUpload = useCallback((fileId: string) => {
    return uploadManager.resumeUpload(fileId);
  }, [uploadManager]);

  const cancelUpload = useCallback((fileId: string) => {
    return uploadManager.cancelUpload(fileId);
  }, [uploadManager]);

  // Clear files
  const clearFiles = useCallback(() => {
    setFiles([]);
    setPreviews([]);
    setValidationResults([]);
    setUploads(new Map());
  }, []);

  // Trigger file selection
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    // State
    files,
    previews,
    validationResults,
    uploads,

    // Methods
    selectFiles,
    uploadFiles,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    clearFiles,
    openFileDialog,

    // Refs
    fileInputRef,

    // Computed
    hasFiles: files.length > 0,
    isUploading: Array.from(uploads.values()).some(upload => upload.status === 'uploading'),
    hasErrors: Array.from(uploads.values()).some(upload => upload.status === 'error'),
    isComplete: Array.from(uploads.values()).every(upload => upload.status === 'completed')
  };
};

interface UseDragDropOptions extends DragDropConfig {
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

export const useDragDrop = ({
  accept,
  maxFiles = 10,
  maxSize,
  minSize,
  disabled = false,
  multiple = true,
  onFilesSelected
}: UseDragDropOptions = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const validateDroppedFiles = useCallback((files: File[]): File[] => {
    const newErrors: string[] = [];
    let validFiles = files;

    // Check file count
    if (files.length > maxFiles) {
      newErrors.push(`Too many files. Maximum allowed: ${maxFiles}`);
      validFiles = files.slice(0, maxFiles);
    }

    // Validate each file
    validFiles = validFiles.filter(file => {
      // Check file type
      if (accept && accept.length > 0) {
        const acceptedTypes = accept.map(type => type.toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileName.endsWith(type);
          }
          return fileType.includes(type.replace('*', ''));
        });

        if (!isAccepted) {
          newErrors.push(`${file.name}: File type not accepted`);
          return false;
        }
      }

      // Check file size
      if (maxSize && file.size > maxSize) {
        newErrors.push(`${file.name}: File size exceeds maximum allowed size`);
        return false;
      }

      if (minSize && file.size < minSize) {
        newErrors.push(`${file.name}: File size is below minimum required size`);
        return false;
      }

      return true;
    });

    setErrors(newErrors);
    return validFiles;
  }, [accept, maxFiles, maxSize, minSize]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    setIsDragging(false);
    setDragCounter(0);
    setErrors([]);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateDroppedFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }
  }, [disabled, validateDroppedFiles, onFilesSelected]);

  return {
    isDragging,
    errors,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    }
  };
};