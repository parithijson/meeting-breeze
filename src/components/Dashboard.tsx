
import React, { useState } from "react";
import UploadArea from "./UploadArea";
import MeetingForm from "./MeetingForm";
import GlassCard from "./ui-elements/GlassCard";

const Dashboard: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handlePdfUpload = (file: File) => {
    setPdfFile(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <GlassCard className="p-8 text-center animate-slide-down">
        <h1 className="text-3xl font-semibold mb-2">Meeting Dashboard</h1>
        <p className="text-muted-foreground">Upload your PDF and start your meeting</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-medium mb-3">1. Upload PDF Document</h2>
          <UploadArea onUpload={handlePdfUpload} />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-medium mb-3">2. Start Your Meeting</h2>
          <MeetingForm pdfUploaded={!!pdfFile} />
        </div>
      </div>

      {pdfFile && (
        <GlassCard className="p-6 mt-8 animate-fade-in">
          <h2 className="text-xl font-medium mb-4">Meeting Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document:</span>
              <span className="font-medium">{pdfFile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span>{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600">Ready</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Dashboard;
