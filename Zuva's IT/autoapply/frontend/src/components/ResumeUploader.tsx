'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ResumeUploaderProps {
  onUploadSuccess?: (resumeId: string) => void;
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setUploaded(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploaded(true);
      toast.success('Resume uploaded & encrypted successfully!');
      onUploadSuccess?.(res.data.resumeId);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploaded(false);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/20 hover:border-blue-500/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragActive ? 'bg-blue-500/20' : 'bg-white/5'
          }`}>
            <Upload className={`w-6 h-6 transition-colors duration-300 ${isDragActive ? 'text-blue-400' : 'text-white/40'}`} />
          </div>
          <div>
            <p className="text-white/80 font-medium">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
            </p>
            <p className="text-white/40 text-sm mt-1">PDF or DOCX (max 10MB)</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/40">
            or click to browse
          </span>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 rounded-xl glass border border-white/10"
          >
            <div className="flex items-center gap-3">
              {uploaded ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!uploaded && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  {uploading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                  ) : (
                    <>Upload & Encrypt</>
                  )}
                </button>
              )}
              <button
                onClick={removeFile}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {uploaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-green-400 text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Resume uploaded and encrypted with AES-256. Ready to optimize!</span>
        </motion.div>
      )}
    </div>
  );
}
