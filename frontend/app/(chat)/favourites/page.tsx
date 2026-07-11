"use client";

import React, { useState } from "react";
import {
  Star,
  FileText,
  BookOpen,
  GraduationCap,
  Search,
  X,
  Heart,
  Clock,
  Trash2,
  ExternalLink,
  FolderHeart,
  Sparkles,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FavouriteItem {
  id: string;
  title: string;
  description: string;
  type: "document" | "note" | "flashcard";
  addedAt: string;
  tags: string[];
  starred: boolean;
}

const sampleFavourites: FavouriteItem[] = [
  {
    id: "fav-1",
    title: "Q4 Financial Report 2025",
    description: "Annual financial report with revenue breakdown and growth projections",
    type: "document",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    tags: ["finance", "quarterly"],
    starred: true,
  },
  {
    id: "fav-2",
    title: "RAG Architecture Notes",
    description: "Comprehensive notes on retrieval-augmented generation pipeline design",
    type: "note",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    tags: ["ai", "architecture"],
    starred: true,
  },
  {
    id: "fav-3",
    title: "Machine Learning Fundamentals",
    description: "Flashcard set covering core ML concepts, algorithms, and best practices",
    type: "flashcard",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    tags: ["ml", "study"],
    starred: true,
  },
  {
    id: "fav-4",
    title: "Product Requirements Specification",
    description: "Detailed product requirements for the AI document search platform",
    type: "document",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    tags: ["product", "requirements"],
    starred: true,
  },
  {
    id: "fav-5",
    title: "Vector Embeddings Study Guide",
    description: "Key concepts and techniques for understanding vector embeddings in search",
    type: "flashcard",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    tags: ["search", "embeddings"],
    starred: true,
  },
  {
    id: "fav-6",
    title: "Team Meeting Notes - Q4 Planning",
    description: "Action items and key decisions from the quarterly planning session",
    type: "note",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    tags: ["meeting", "planning"],
    starred: true,
  },
];

const typeConfig = {
  document: {
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    label: "Document",
  },
  note: {
    icon: BookOpen,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    label: "Note",
  },
  flashcard: {
    icon: GraduationCap,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    label: "Flashcard",
  },
};

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
  });
}

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState(sampleFavourites);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredFavourites = favourites.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === "all" || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleRemove = (id: string) => {
    setFavourites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStar = (id: string) => {
    setFavourites((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, starred: !f.starred } : f
      )
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50">
            <Star className="size-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">
              Favourites
            </h1>
            <p className="text-xs text-neutral-500">
              Your bookmarked documents, notes, and flashcards
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5 border-dashed">
          <Sparkles className="size-3" />
          {favourites.filter((f) => f.starred).length} saved
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search favourites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-9 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            <FolderHeart className="mr-1.5 size-3.5" />
            All
          </TabsTrigger>
          <TabsTrigger value="document">
            <FileText className="mr-1.5 size-3.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="note">
            <BookOpen className="mr-1.5 size-3.5" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="flashcard">
            <GraduationCap className="mr-1.5 size-3.5" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredFavourites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-200 px-6 py-16 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50">
                <Heart className="size-7 text-amber-300" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-neutral-600">
                  {searchQuery ? "No favourites match your search" : "No favourites yet"}
                </p>
                <p className="max-w-xs text-xs text-neutral-400">
                  {searchQuery
                    ? "Try a different search term or clear the filter."
                    : "Star documents, notes, or flashcards to save them here for quick access."}
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  {filteredFavourites.length} item{filteredFavourites.length !== 1 ? "s" : ""}
                  {activeTab !== "all" ? ` (${activeTab})` : ""}
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFavourites.map((item, index) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={item.id}
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
                        className="group relative flex flex-col gap-3 rounded-xl border border-neutral-100 bg-white p-4 shadow-xs transition-all hover:border-neutral-200 hover:shadow-sm"
                      >
                        {/* Top Row */}
                        <div className="flex items-start justify-between">
                          <div
                            className={cn(
                              "flex size-10 items-center justify-center rounded-lg border",
                              config.bg,
                              config.border
                            )}
                          >
                            <Icon className={cn("size-4.5", config.color)} strokeWidth={1.5} />
                          </div>
                          <div className="flex gap-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "border-dashed text-[10px] font-semibold",
                                config.bg,
                                config.color
                              )}
                            >
                              {config.label}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex size-7 items-center justify-center rounded-lg text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-600 group-hover:opacity-100">
                                  <MoreHorizontal className="size-3.5" strokeWidth={1.5} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={() => handleStar(item.id)}>
                                  <Star className="mr-2 size-3.5" />
                                  {item.starred ? "Unstar" : "Star"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <Trash2 className="mr-2 size-3.5" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-sm font-medium text-neutral-800">
                            {item.title}
                          </p>
                          <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500">
                            {item.description}
                          </p>
                        </div>

                        {/* Tags & Meta */}
                        <div className="mt-auto flex items-center gap-2">
                          <div className="flex flex-1 flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-[10px] text-neutral-400">
                                +{item.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <span className="flex shrink-0 items-center gap-1 text-[10px] text-neutral-400">
                            <Clock className="size-2.5" />
                            {formatDate(item.addedAt)}
                          </span>
                        </div>

                        {/* Star indicator */}
                        {item.starred && (
                          <div className="absolute top-3 left-3">
                            <Star className="size-3.5 text-amber-400 fill-amber-400" strokeWidth={1.5} />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
