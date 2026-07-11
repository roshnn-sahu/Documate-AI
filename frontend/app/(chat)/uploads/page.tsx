import UploadDropzone from "@/components/uploads/upload-dropzone";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileSpreadsheet,
  File,
  FileCode,
} from "lucide-react";

const supportedFormats = [
  { label: "PDF", icon: FileText, color: "text-rose-500" },
  { label: "DOCX", icon: FileText, color: "text-blue-500" },
  { label: "TXT", icon: FileCode, color: "text-emerald-500" },
  { label: "CSV", icon: FileSpreadsheet, color: "text-violet-500" },
  { label: "XLSX", icon: File, color: "text-orange-500" },
];

export default function UploadPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-16">
      {/* Header */}
      <div className="relative space-y-4">
        {/* Gradient accent line */}
        <div className="h-1 w-16 rounded-full bg-linear-to-r from-rose-400 to-orange-400" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            Document Uploads
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
            Upload your documents and let Documate AI index them for instant,
            context-aware answers. We support common document formats with
            automatic text extraction and semantic search.
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            Supported formats:
          </span>
          {supportedFormats.map((format) => (
            <Badge
              key={format.label}
              variant="outline"
              className="gap-1.5 border-dashed px-2.5 py-1 text-xs font-medium"
            >
              <format.icon className={`size-3.5 ${format.color}`} />
              {format.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Upload Dropzone */}
      <UploadDropzone />
    </div>
  );
}
