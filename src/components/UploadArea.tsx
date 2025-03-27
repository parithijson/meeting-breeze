
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import GlassCard from "./ui-elements/GlassCard";

interface UploadAreaProps {
  onUpload: (file: File) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setFileName(file.name);
    onUpload(file);
    toast.success("PDF uploaded successfully");
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <GlassCard 
      className={cn(
        "drop-area cursor-pointer h-60 transition-all duration-300",
        isDragging && "drop-area active",
        fileName && "border-green-400/70 bg-green-50/30"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-8 h-8 text-primary transition-transform", isDragging && "scale-110")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        
        {fileName ? (
          <div className="space-y-1 animate-fade-in">
            <p className="font-medium text-primary">{fileName}</p>
            <p className="text-sm text-muted-foreground">PDF uploaded successfully</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-medium">Upload PDF Document</p>
            <p className="text-sm text-muted-foreground">Drag & drop or click to select</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default UploadArea;
