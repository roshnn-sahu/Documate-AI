"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FileText,
  FileSpreadsheet,
  File,
  FileCode,
  Search,
  X,
  CalendarDays,
  HardDrive,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Image,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  ext: string;
  uploadedAt: string;
  modifiedAt: string;
}

function getFileIcon(ext: string) {
  const map: Record<string, { icon: typeof FileText; color: string }> = {
    PDF: { icon: FileText, color: "text-rose-500" },
    DOCX: { icon: FileText, color: "text-blue-500" },
    XLSX: { icon: File, color: "text-orange-500" },
    CSV: { icon: FileSpreadsheet, color: "text-violet-500" },
    TXT: { icon: FileCode, color: "text-emerald-500" },
  };
  return map[ext] || { icon: File, color: "text-neutral-500" };
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

const fileTypeFilters = [
  { label: "All", value: "all" },
  { label: "PDF", value: "PDF" },
  { label: "DOCX", value: "DOCX" },
  { label: "XLSX", value: "XLSX" },
  { label: "CSV", value: "CSV" },
  { label: "TXT", value: "TXT" },
];

const demoDocuments: DocumentItem[] = [
  {
    id: "demo-1",
    name: "Q4 Financial Report 2025.pdf",
    size: 2458901,
    type: "application/pdf",
    ext: "PDF",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "demo-2",
    name: "Product Requirements Doc.docx",
    size: 1024000,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: "DOCX",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "demo-3",
    name: "Customer Feedback Data.csv",
    size: 512000,
    type: "text/csv",
    ext: "CSV",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "demo-4",
    name: "Meeting Notes - Product Sync.txt",
    size: 12800,
    type: "text/plain",
    ext: "TXT",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "demo-5",
    name: "Revenue Breakdown Q3.xlsx",
    size: 890000,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: "XLSX",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch("/api/documents");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          setDocuments(data.documents);
        } else {
          setDocuments(demoDocuments);
        }
      } catch {
        setError(true);
        setDocuments(demoDocuments);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || doc.ext === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-16">
      {/* Header */}
      <div className="relative space-y-4">
        <div className="h-1 w-16 rounded-full bg-linear-to-r from-rose-400 to-orange-400" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            All Documents
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
            Browse and manage all your uploaded documents. Search by name,
            filter by type, or sort to find what you need.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-9 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-neutral-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {fileTypeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                activeFilter === filter.value
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-300",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <Loader2 className="size-5 animate-spin text-neutral-400" strokeWidth={1.5} />
          <p className="text-sm text-neutral-400">Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-200 px-6 py-16 text-center dark:border-neutral-800"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-800">
            <FileText className="size-5 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {searchQuery
              ? "No documents match your search"
              : "No documents found"}
          </p>
          <p className="max-w-xs text-xs text-neutral-400 dark:text-neutral-500">
            {searchQuery
              ? "Try a different search term or clear the filters."
              : "Upload documents from the Uploads page and they will appear here."}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
            <span>
              {filteredDocuments.length} document
              {filteredDocuments.length !== 1 ? "s" : ""}
              {activeFilter !== "all" ? ` (${activeFilter})` : ""}
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc, index) => (
                <DocCard key={doc.id} doc={doc} index={index} />
              ))}
            </div>
          </AnimatePresence>
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="size-3.5 shrink-0" strokeWidth={1.5} />
          <span>
            Could not connect to the server. Showing sample documents for
            preview.
          </span>
        </div>
      )}
    </div>
  );
}

interface DocCardProps {
  doc: DocumentItem;
  index: number;
}

function DocCard({ doc, index }: DocCardProps) {
  const { icon: Icon, color } = getFileIcon(doc.ext);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.04,
      }}
      className="group relative flex flex-col gap-3 rounded-xl border border-neutral-100 bg-white p-4 shadow-xs transition-all hover:border-neutral-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
          <Icon className={cn("size-4.5", color)} strokeWidth={1.5} />
        </div>
        <Badge variant="outline" className="border-dashed text-[10px] font-semibold">
          {doc.ext}
        </Badge>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {doc.name}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 dark:text-neutral-500">
        <span className="flex items-center gap-1">
          <HardDrive className="size-3" strokeWidth={1.5} />
          {formatSize(doc.size)}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3" strokeWidth={1.5} />
          {formatDate(doc.uploadedAt)}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="flex size-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
          aria-label={`Open ${doc.name}`}
        >
          <ExternalLink className="size-3" strokeWidth={1.5} />
        </button>
        <button
          className="flex size-7 items-center justify-center rounded-lg border border-red-200 bg-white text-red-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:border-red-900 dark:bg-neutral-800 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          aria-label={`Delete ${doc.name}`}
        >
          <Trash2 className="size-3" strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}