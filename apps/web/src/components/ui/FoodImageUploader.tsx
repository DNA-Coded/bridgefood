import React, { useState, useRef } from 'react';


interface FoodImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const FoodImageUploader: React.FC<FoodImageUploaderProps> = ({ images, onChange }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setProgress(null), 500);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleFiles = (fileList: FileList) => {
    setError(null);
    const validFiles: string[] = [];

    // Max 3 images constraint
    if (images.length + fileList.length > 3) {
      setError('You can upload a maximum of 3 images.');
      return;
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Size constraint (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 5MB size limit.`);
        continue;
      }
      // Format constraint
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError(`File ${file.name} has unsupported format. Use PNG or JPG.`);
        continue;
      }

      // Generate a mock object URL for state preview
      validFiles.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      simulateUpload();
      onChange([...images, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (idx: number) => {
    const nextImages = [...images];
    nextImages.splice(idx, 1);
    onChange(nextImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold">Food Photos</label>
        <span className="text-xs text-muted-foreground">{images.length}/3 uploaded</span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-accent/40 cursor-pointer transition-colors duration-200"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          multiple
          className="hidden"
          accept="image/png, image/jpeg"
        />
        <p className="text-sm font-medium text-slate-300">Drag and drop images here, or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG up to 5MB each</p>
      </div>

      {progress !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Simulating upload...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={img} className="relative group rounded-lg overflow-hidden border bg-muted aspect-video">
              <img src={img} alt="Food Upload" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                className="absolute top-1 right-1 p-1 bg-destructive hover:bg-destructive/95 text-destructive-foreground rounded-full text-xs shadow transition-all duration-200"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
