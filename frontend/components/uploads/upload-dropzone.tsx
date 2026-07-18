"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";
import { cn } from "@/lib/utils";
import { validateFile } from "@/lib/uploads/validate-file";
import {
  FileText,
  FileSpreadsheet,
  File,
  FileCode,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  Sparkles,
} from "lucide-react";

type FileStatus = "uploading" | "processing" | "ready" | "error";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  error?: string;
}

function getFileIcon(type: string) {
  if (type.includes("pdf")) return { icon: FileText, color: "text-rose-500" };
  if (type.includes("word") || type.includes("docx"))
    return { icon: FileText, color: "text-blue-500" };
  if (type.includes("spreadsheet") || type.includes("xlsx"))
    return { icon: File, color: "text-orange-500" };
  if (type.includes("csv"))
    return { icon: FileSpreadsheet, color: "text-violet-500" };
  if (type.includes("text"))
    return { icon: FileCode, color: "text-emerald-500" };
  return { icon: File, color: "text-neutral-500" };
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTypeLabel(type: string) {
  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || type.includes("docx")) return "DOCX";
  if (type.includes("spreadsheet") || type.includes("xlsx")) return "XLSX";
  if (type.includes("csv")) return "CSV";
  if (type.includes("text")) return "TXT";
  return type.split("/").pop()?.toUpperCase() || "FILE";
}

const statusConfig = {
  uploading: {
    icon: Loader2,
    label: "Uploading...",
    className: "text-amber-500",
    spin: true,
  },
  processing: {
    icon: Sparkles,
    label: "Processing...",
    className: "text-blue-500",
    spin: false,
  },
  ready: {
    icon: CheckCircle2,
    label: "Ready",
    className: "text-emerald-500",
    spin: false,
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    className: "text-red-500",
    spin: false,
  },
};

export default function UploadDropzone() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Real upload: POST to /api/uploads per file
  const uploadFile = useCallback(async (uploadedFile: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id ? { ...f, status: "processing" } : f,
      ),
    );

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile.file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Upload failed (${res.status})`);
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: "ready" } : f,
        ),
      );
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "error", error: err.message || "Upload failed" }
            : f,
        ),
      );
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
        try {
          validateFile(file);
          newFiles.push({
            id: uuid(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading",
          });
        } catch (err: any) {
          newFiles.push({
            id: uuid(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "error",
            error: err.message || "Invalid file",
          });
        }
      }

      setFiles((prev) => [...prev, ...newFiles]);

      for (const uploadedFile of newFiles) {
        if (uploadedFile.status !== "error") {
          await uploadFile(uploadedFile);
        }
      }
    },
    [uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: false,
    onDrop,
    onDropRejected: (rejections) => {
      const invalidFiles: UploadedFile[] = rejections.map((r) => ({
        id: uuid(),
        file: r.file,
        name: r.file.name,
        size: r.file.size,
        type: r.file.type,
        status: "error" as FileStatus,
        error: r.errors[0]?.message || "File rejected",
      }));
      setFiles((prev) => [...prev, ...invalidFiles]);
    },
  });

  // Omit conflicting drag and animation event handlers that Framer Motion overrides
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...dropzoneProps } = getRootProps();

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <motion.div
        {...dropzoneProps}
        animate={
          isDragActive ? { scale: 1.005 } : { scale: 1 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        aria-label="File upload area. Drag and drop files or click to browse"
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-colors sm:p-16",
          isDragActive
            ? "border-rose-400 bg-rose-50/50 dark:border-rose-500 dark:bg-rose-950/20"
            : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-none absolute inset-0 bg-linear-to-br from-rose-400/5 to-orange-400/5"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            animate={isDragActive ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
            className={cn(
              "flex size-16 items-center justify-center rounded-2xl border shadow-xs transition-colors",
              isDragActive
                ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                : "border-neutral-200 bg-neutral-50 text-neutral-400 group-hover:border-neutral-300 group-hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500 dark:group-hover:border-neutral-600 dark:group-hover:bg-neutral-700",
            )}
          >
            <Upload className="size-6" strokeWidth={1.5} />
            
          </motion.div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              {isDragActive ? (
                <span className="text-rose-600 dark:text-rose-400">Drop files here</span>
              ) : (
                <>
                  <span className="hidden sm:inline">Drag & drop files here, or </span>
                  <span className="sm:hidden">Tap to upload</span>
                  <span className="hidden sm:inline">
                    <span className="text-rose-500 underline decoration-rose-300 underline-offset-2 transition-colors hover:text-rose-600 dark:text-rose-400 dark:decoration-rose-700">
                      browse
                    </span> your files
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              PDF, DOCX, TXT, CSV, XLSX &mdash; Max 10 MB per file
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Uploaded Documents
              </h3>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {files.map((uploadedFile) => {
                const { icon: Icon, color } = getFileIcon(uploadedFile.type);
                const status = statusConfig[uploadedFile.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={uploadedFile.id}
                    layout
                    initial={{ opacity: 0, x: -16, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 1,
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 shadow-xs transition-colors sm:gap-4 sm:p-4",
                      uploadedFile.status === "error"
                        ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
                        : "border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                        uploadedFile.status === "error"
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                          : "border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4.5",
                          uploadedFile.status === "error" ? "text-red-400" : color,
                        )}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {uploadedFile.name}
                        </p>
                        <span className="shrink-0 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                          {formatTypeLabel(uploadedFile.type)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                        <span>{formatSize(uploadedFile.size)}</span>
                        {uploadedFile.status === "ready" && (
                          <>
                            <span>&middot;</span>
                            <span className="text-emerald-600 dark:text-emerald-400">Indexed</span>
                          </>
                        )}
                        {uploadedFile.status === "error" && uploadedFile.error && (
                          <>
                            <span>&middot;</span>
                            <span className="text-red-500">{uploadedFile.error}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {uploadedFile.status === "uploading" ||
                      uploadedFile.status === "processing" ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <StatusIcon
                            className={cn(
                              "size-3.5",
                              status.className,
                              status.spin && "animate-spin",
                              uploadedFile.status === "processing" && "animate-pulse",
                            )}
                          />
                          <span className={status.className}>{status.label}</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(uploadedFile.id);
                          }}
                          aria-label={`Remove ${uploadedFile.name}`}
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg border transition-colors",
                            uploadedFile.status === "error"
                              ? "border-red-200 text-red-400 hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/30"
                              : "border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-600 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
                          )}
                        >
                          <Trash2 className="size-3.5" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-100 px-6 py-10 text-center dark:border-neutral-800"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-800">
            <FileText
              className="size-4.5 text-neutral-400 dark:text-neutral-500"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            No documents uploaded yet
          </p>
          <p className="max-w-xs text-xs text-neutral-400 dark:text-neutral-500">
            Upload a document above and it will appear here once processed and
            ready for semantic search.
          </p>
        </motion.div>
      )}
    </div>
  );
}