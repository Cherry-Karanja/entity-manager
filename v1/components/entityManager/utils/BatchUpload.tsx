import React, { useState, useCallback } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileDropZone, FilePreview } from './FileDropZone';
import { BatchUploadProgress } from './UploadProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatchUploadProps {
  endpoint?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  autoUpload?: boolean;
  className?: string;
  onUploadComplete?: (results: any[]) => void;
  onUploadError?: (errors: any[]) => void;
}

export const BatchUpload: React.FC<BatchUploadProps> = ({
  endpoint = '/api/upload',
  accept,
  maxSize,
  minSize,
  maxFiles = 10,
  autoUpload = false,
  className,
  onUploadComplete,
  onUploadError
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const {
    files,
    previews,
    validationResults,
    uploads,
    selectFiles,
    uploadFiles: startUpload,
    clearFiles
  } = useFileUpload({
    endpoint,
    accept: accept ? Object.values(accept).flat() : undefined,
    maxSize,
    minSize,
    autoUpload,
    validateOnSelect: true,
    generatePreview: true
  });

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    selectFiles(selectedFiles);
  }, [selectFiles]);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      await startUpload(files, endpoint);
      // Collect successful uploads
      const successfulUploads = Array.from(uploads.values())
        .filter(upload => upload.status === 'completed')
        .map(upload => upload.result);
      onUploadComplete?.(successfulUploads);
    } catch (error) {
      onUploadError?.([error]);
    } finally {
      setIsUploading(false);
    }
  }, [files, startUpload, endpoint, uploads, onUploadComplete, onUploadError]);

  const handleRemoveFile = useCallback((index: number) => {
    // Note: File removal not implemented in current hook version
    // This would require extending the useFileUpload hook
    console.warn('File removal not implemented');
  }, []);

  const validFiles = files.filter((_, index) =>
    !validationResults[index] || validationResults[index].valid
  );

  const invalidFiles = files.filter((_, index) =>
    validationResults[index] && !validationResults[index].valid
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Batch File Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <FileDropZone
          onFilesSelected={handleFilesSelected}
          accept={accept}
          maxSize={maxSize}
          minSize={minSize}
          maxFiles={maxFiles}
          disabled={isUploading}
          placeholder="Drop files here or click to browse (max 10 files)"
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFiles}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  preview={previews[index]?.url}
                  onRemove={() => handleRemoveFile(index)}
                  className={cn(
                    validationResults[index] && !validationResults[index].valid && "border-red-200"
                  )}
                />
              ))}
            </div>

            {/* Validation Errors */}
            {invalidFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Validation Errors:</h4>
                {validationResults.map((result, index) =>
                  result && !result.valid ? (
                    <p key={index} className="text-xs text-red-500">
                      {files[index].name}: {result.errors.join(', ')}
                    </p>
                  ) : null
                )}
              </div>
            )}

            {/* Upload Controls */}
            {validFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || validFiles.length === 0}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Pause className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Upload {validFiles.length} File{validFiles.length > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploads.size > 0 && (
          <BatchUploadProgress uploads={uploads} />
        )}
      </CardContent>
    </Card>
  );
};