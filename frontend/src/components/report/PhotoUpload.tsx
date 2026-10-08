import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileSelect(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-gray-700 bg-gray-800">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 p-1.5 bg-gray-900/80 text-white rounded-full hover:bg-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
            <UploadCloud className="w-10 h-10 mb-3" />
            <p className="mb-2 text-sm">
              <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">JPG, PNG or WEBP (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};
