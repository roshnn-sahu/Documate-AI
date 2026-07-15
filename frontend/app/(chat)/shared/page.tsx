"use client";

import React, { useState } from "react";
import {
  Waypoints,
  Share2,
  Users,
  Clock,
  Download,
  FileText,
  FileCode,
  File,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Trash2,
  Search,
  X,
  Sparkles,
  Globe,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface SharedItem {
  id: string;
  title: string;
  type: "document" | "folder" | "note";
  sharedBy: {
    name: string;
    initials: string;
    color: string;
  };
  sharedAt: string;
  permission: "view" | "edit" | "comment";
  size: string;
  direction: "incoming" | "outgoing";
}

const sampleShared: SharedItem[] = [
  {
    id: "shared-1",
    title: "Q4 Strategic Planning.pdf",
    type: "document",
    sharedBy: { name: "Alice Chen", initials: "AC", color: "bg-blue-500" },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    permission: "edit",
    size: "2.4 MB",
    direction: "incoming",
  },
  {
    id: "shared-2",
    title: "Design System Specs.docx",
    type: "document",
    sharedBy: { name: "Marcus Johnson", initials: "MJ", color: "bg-emerald-500" },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    permission: "comment",
    size: "1.1 MB",
    direction: "incoming",
  },
  {
    id: "shared-3",
    title: "Research Papers Collection",
    type: "folder",
    sharedBy: { name: "Sarah Kim", initials: "SK", color: "bg-violet-500" },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    permission: "view",
    size: "15 MB",
    direction: "incoming",
  },
  {
    id: "shared-4",
    title: "Meeting Notes - Product Review",
    type: "note",
    sharedBy: { name: "You", initials: "YO", color: "bg-rose-500" },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    permission: "edit",
    size: "12 KB",
    direction: "outgoing",
  },
  {
    id: "shared-5",
    title: "API Documentation v2.pdf",
    type: "document",
    sharedBy: { name: "You", initials: "YO", color: "bg-rose-500" },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    permission: "view",
    size: "3.2 MB",
    direction: "outgoing",
  },
  {
    id: "shared-6",
    title: "Frontend Architecture Notes",
    type: "note",
    sharedBy: { name: "David Park", initials: "DP", color: "bg-amber-500" },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    permission: "comment",
    size: "8 KB",
    direction: "incoming",
  },
];

const typeIcons = {
  document: { icon: FileText, color: "text-rose-500" },
  folder: { icon: FileCode, color: "text-violet-500" },
  note: { icon: File, color: "text-amber-500" },
};

const permissionBadges = {
  view: { label: "Can view", color: "bg-blue-50 text-blue-700 border-blue-200" },
  edit: { label: "Can edit", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  comment: {
    label: "Can comment",
    color: "bg-amber-50 text-amber-700 border-amber-200",
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function SharedPage() {
  const [sharedItems] = useState(sampleShared);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = sharedItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sharedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "incoming" && item.direction === "incoming") ||
      (activeTab === "outgoing" && item.direction === "outgoing");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50">
            <Waypoints className="size-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="font-bricolage text-xl font-bold text-neutral-900">
              Shared
            </h1>
            <p className="text-xs text-neutral-500">
              Documents and files shared with your team
            </p>
          </div>
        </div>
        <Button size="xs" className="bg-(image:--color-theme-gradient) text-white shadow-lg shadow-rose-200/50">
          <UserPlus className="mr-1.5 size-3.5" />
          Share
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search shared items..."
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
          {[
            { label: "All", value: "all", icon: Globe },
            { label: "Shared with me", value: "incoming", icon: Share2 },
            { label: "Shared by me", value: "outgoing", icon: Users },
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <TabsTrigger key={filter.value} value={filter.value}>
                <Icon className="mr-1.5 size-3.5" />
                {filter.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-200 px-6 py-16 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50">
                <Share2 className="size-7 text-indigo-300" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-neutral-600">
                  {searchQuery ? "No shared items match your search" : "No shared items yet"}
                </p>
                <p className="max-w-xs text-xs text-neutral-400">
                  {searchQuery
                    ? "Try a different search term or clear the filter."
                    : "Share documents with your team to collaborate in real-time."}
                </p>
              </div>
              {!searchQuery && (
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-1.5 size-3.5" />
                  Share your first document
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {filteredItems.map((item, index) => {
                    const { icon: TypeIcon, color: iconColor } = typeIcons[item.type];
                    const permBadge = permissionBadges[item.permission];
                    const isIncoming = item.direction === "incoming";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28, delay: index * 0.03 }}
                        className="group flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-xs transition-all hover:border-neutral-200 hover:shadow-sm"
                      >
                        {/* Type Icon */}
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50">
                          <TypeIcon className={cn("size-4.5", iconColor)} strokeWidth={1.5} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-neutral-800">{item.title}</p>
                            <Badge variant="outline" className={cn("border text-[10px]", permBadge.color)}>
                              {permBadge.label}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="size-4">
                                <AvatarFallback className={cn("text-[8px] font-medium text-white", item.sharedBy.color)}>
                                  {item.sharedBy.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-neutral-500">
                                {isIncoming ? `Shared by ${item.sharedBy.name}` : `Shared with team`}
                              </span>
                            </div>
                            <span className="text-neutral-300">·</span>
                            <span className="flex items-center gap-1 text-xs text-neutral-400">
                              <Clock className="size-3" strokeWidth={1.5} />
                              {formatDate(item.sharedAt)}
                            </span>
                            <span className="text-neutral-300">·</span>
                            <span className="text-xs text-neutral-400">{item.size}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="flex size-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-600">
                            <ExternalLink className="size-3" strokeWidth={1.5} />
                          </button>
                          <button className="flex size-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-600">
                            <Download className="size-3" strokeWidth={1.5} />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex size-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-600">
                                <MoreHorizontal className="size-3" strokeWidth={1.5} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem><Copy className="mr-2 size-3.5" />Copy link</DropdownMenuItem>
                              <DropdownMenuItem><ExternalLink className="mr-2 size-3.5" />Open</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 size-3.5" />Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Direction indicator */}
                        <div className="hidden shrink-0 sm:flex">
                          <Badge variant="outline" className="border-dashed text-[10px] font-normal text-neutral-400">
                            {isIncoming ? <><Share2 className="mr-1 size-2.5" />Incoming</> : <><Users className="mr-1 size-2.5" />Outgoing</>}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Info */}
      <Card size="sm" className="border-dashed">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
            <Sparkles className="size-4 text-indigo-500" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-neutral-700">Collaboration Tips</p>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              Shared documents are synced in real-time. Changes made by collaborators
              with edit access will appear automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}