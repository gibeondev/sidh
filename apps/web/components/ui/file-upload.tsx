'use client';

import * as React from 'react';

export interface FileUploadProps {
  id: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * File upload component matching Step 5 design:
 * - Shows "Pilih file" button with upload icon when no file selected
 * - Shows filename in pill with delete icon when file is uploaded
 */
export function FileUpload({
  id,
  value,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 1,
  className = '',
  'aria-label': ariaLabel,
}: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string>('');

  React.useEffect(() => {
    if (value) {
      setFileName(value.name);
    } else {
      setFileName('');
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        alert(`Ukuran file melebihi ${maxSizeMB}MB. Silakan pilih file yang lebih kecil.`);
        e.target.value = '';
        return;
      }
      onChange(file);
    } else {
      onChange(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName('');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 ${className}`}>
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label={ariaLabel}
      />

      {fileName ? (
        // File uploaded state: show filename in pill with delete icon
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <span className="text-sm text-blue-700 font-medium">{fileName}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-blue-700 hover:text-blue-900 focus:outline-none"
            aria-label="Hapus file"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ) : (
        // No file selected state: show "Pilih file" button with upload icon
        <>
          <button
            type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center gap-2 rounded-md bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#0d3d4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C] focus-visible:ring-offset-2"
            aria-label={ariaLabel || 'Pilih file'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Pilih file
          </button>
          <span className="text-sm text-gray-400">Tidak ada file yang dipilih</span>
        </>
      )}
    </div>
  );
}
