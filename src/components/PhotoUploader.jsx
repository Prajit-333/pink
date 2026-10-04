import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

export const PhotoUploader = ({ photoDataUrl, setPhotoDataUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const processImageFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5 MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Client-side resize and compression using HTML5 Canvas
        const canvas = document.createElement('canvas');
        const maxDimension = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export compressed WebP or JPEG
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPhotoDataUrl(compressedUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  return (
    <div className="p-3 rounded-2xl bg-white/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200">
            Attach Photo (Optional)
          </h4>
        </div>
        <span className="text-[10px] text-pink-500 font-medium">JPG/PNG &lt; 5MB</span>
      </div>

      {errorMsg && (
        <div className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {photoDataUrl ? (
        <div className="flex items-center justify-between gap-3 p-2 bg-pink-50 dark:bg-pink-900/30 rounded-xl border border-pink-200 dark:border-pink-700">
          <div className="flex items-center gap-2.5">
            <img
              src={photoDataUrl}
              alt="Attached preview"
              className="w-10 h-10 object-cover rounded-lg border border-white shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold text-pink-900 dark:text-pink-100">
                Photo attached
              </p>
              <p className="text-[10px] text-pink-600 dark:text-pink-400">
                Rendered on the greeting card
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPhotoDataUrl('')}
            className="px-2 py-1 rounded-lg text-pink-600 hover:bg-pink-200 dark:hover:bg-pink-800 text-xs flex items-center gap-1"
            title="Remove Photo"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-2.5 px-4 text-center transition-all flex items-center justify-center gap-3 ${
            isDragging
              ? 'border-pink-600 bg-pink-100/70 scale-[1.01]'
              : 'border-pink-300 dark:border-pink-700 hover:border-pink-500 bg-pink-50/50 dark:bg-pink-900/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processImageFile(file);
            }}
            accept="image/*"
            className="hidden"
          />
          <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 flex items-center justify-center flex-shrink-0">
            <Upload className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-pink-900 dark:text-pink-100">
              Drag & drop photo or <span className="text-pink-600 underline">browse</span>
            </p>
            <p className="text-[10px] text-pink-500">
              Adds picture onto the card photo frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
