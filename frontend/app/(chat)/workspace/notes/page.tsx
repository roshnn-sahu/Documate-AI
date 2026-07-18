"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  Trash2,
  Edit3,
  Pin,
  PinOff,
  FileText,
  Tag,
  Sparkles,
  List,
  Star,
  History,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionPicker } from "@/components/workspace/session-picker";
import { runAITool } from "@/lib/client/run-ai-tools";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const tagColors: Record<string, string> = {
  meeting: "bg-blue-50 text-blue-700 border-blue-200",
  planning: "bg-purple-50 text-purple-700 border-purple-200",
  research: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ai: "bg-rose-50 text-rose-700 border-rose-200",
  docs: "bg-amber-50 text-amber-700 border-amber-200",
  development: "bg-indigo-50 text-indigo-700 border-indigo-200",
  generated: "bg-violet-50 text-violet-700 border-violet-200",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const noteFilters = [
  { label: "All", value: "all", icon: List },
  { label: "Pinned", value: "pinned", icon: Star },
  { label: "Recent", value: "recent", icon: History },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [noteFilter, setNoteFilter] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSessionId, setGenerateSessionId] = useState<string | null>(null);
  const [showGeneratePanel, setShowGeneratePanel] = useState(false);

  const searchedNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredNotes = searchedNotes
    .filter((note) => {
      if (noteFilter === "pinned") return note.pinned;
      return true;
    })
    .sort((a, b) => {
      if (noteFilter === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: String(Date.now()),
      title: "Untitled Note",
      content: "",
      tags: [],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setShowGeneratePanel(false);
  };

  const handleGenerateFromDocument = async () => {
    if (!generateSessionId) return;
    setIsGenerating(true);

    try {
      const body = await runAITool({ sessionId: generateSessionId, tool: "notes" });
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        accumulated += chunk;
      }

      // Extract title from first heading
      const titleMatch = accumulated.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1].trim() : "Generated Notes";
      const content = accumulated.replace(/^#\s+.+\n?/, "").trim();

      const newNote: Note = {
        id: String(Date.now()),
        title,
        content,
        tags: ["generated", "ai"],
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      setIsEditing(false);
      setEditTitle(newNote.title);
      setEditContent(newNote.content);
      setShowGeneratePanel(false);
    } catch (error: any) {
      console.error("Failed to generate notes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setEditTitle(note.title);
    setEditContent(note.content);
    setShowGeneratePanel(false);
  };

  const handleSave = () => {
    if (!selectedNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id ? { ...n, title: editTitle, content: editContent, updatedAt: new Date().toISOString() } : n,
      ),
    );
    setSelectedNote((prev) =>
      prev ? { ...prev, title: editTitle, content: editContent, updatedAt: new Date().toISOString() } : prev,
    );
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
    setSelectedNote((prev) => (prev?.id === id ? { ...prev, pinned: !prev.pinned } : prev));
  };

  return (
    <div className="flex h-full flex-1 gap-0 overflow-hidden">
      {/* Sidebar - Note List */}
      <div className="flex w-80 shrink-0 flex-col border-r bg-white">
        <div className="border-b p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50">
                <BookOpen className="size-4 text-amber-600" />
              </div>
              <h2 className="font-bricolage text-base font-semibold text-neutral-800">Notes</h2>
            </div>
            <div className="flex gap-1">
              <Button size="icon-xs" variant="ghost" onClick={() => setShowGeneratePanel(!showGeneratePanel)}>
                <Sparkles className="size-4 text-violet-500" />
              </Button>
              <Button size="icon-xs" variant="ghost" onClick={handleCreateNote}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* Generate from Document Panel */}
          <AnimatePresence>
            {showGeneratePanel && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-3 overflow-hidden">
                <Card className="border-violet-200 bg-violet-50/50">
                  <CardContent className="p-3">
                    <p className="mb-2 text-xs font-medium text-violet-700">Generate from Document</p>
                    <SessionPicker selectedSessionId={generateSessionId} onSelect={setGenerateSessionId} className="mb-2" />
                    <Button size="xs" className="w-full bg-violet-600 text-white" onClick={handleGenerateFromDocument} disabled={!generateSessionId || isGenerating}>
                      {isGenerating ? (
                        <><Loader2 className="mr-1 size-3 animate-spin" /> Generating...</>
                      ) : (
                        <><Sparkles className="mr-1 size-3" /> Generate Notes</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
              <Input placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 rounded-lg pl-8 text-xs" />
            </div>
            <Tabs value={noteFilter} onValueChange={setNoteFilter}>
              <TabsList className="w-full">
                {noteFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <TabsTrigger key={filter.value} value={filter.value} className="flex-1">
                      <Icon className="mr-1 size-3" />{filter.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {pinnedNotes.length > 0 && (
              <div className="mb-2 px-2 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Pinned</p>
              </div>
            )}
            <AnimatePresence>
              {pinnedNotes.map((note) => (
                <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <NoteListItem note={note} isSelected={selectedNote?.id === note.id} onSelect={() => handleSelectNote(note)} onDelete={() => handleDelete(note.id)} onTogglePin={() => handleTogglePin(note.id)} />
                </motion.div>
              ))}
            </AnimatePresence>

            {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
              <div className="my-2 px-2 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">All Notes</p>
              </div>
            )}

            <AnimatePresence>
              {unpinnedNotes.map((note) => (
                <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <NoteListItem note={note} isSelected={selectedNote?.id === note.id} onSelect={() => handleSelectNote(note)} onDelete={() => handleDelete(note.id)} onTogglePin={() => handleTogglePin(note.id)} />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredNotes.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12">
                <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100">
                  <FileText className="size-5 text-neutral-400" />
                </div>
                <p className="text-sm font-medium text-neutral-500">{searchQuery ? "No notes found" : "No notes yet"}</p>
                {!searchQuery && (
                  <Button size="xs" variant="outline" onClick={handleCreateNote}>
                    <Plus className="mr-1 size-3" /> Create your first note
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50/30">
        {selectedNote ? (
          <>
            <div className="flex items-center justify-between border-b bg-white px-6 py-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="cursor-pointer gap-1 text-xs" onClick={() => handleTogglePin(selectedNote.id)}>
                  {selectedNote.pinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
                  {selectedNote.pinned ? "Pinned" : "Pin"}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="size-3" /> {formatDate(selectedNote.updatedAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {!isEditing ? (
                  <Button size="xs" variant="ghost" onClick={() => { setIsEditing(true); setEditTitle(selectedNote.title); setEditContent(selectedNote.content); }}>
                    <Edit3 className="mr-1 size-3" /> Edit
                  </Button>
                ) : (
                  <>
                    <Button size="xs" variant="ghost" onClick={() => { setIsEditing(false); setEditTitle(selectedNote.title); setEditContent(selectedNote.content); }}>Cancel</Button>
                    <Button size="xs" onClick={handleSave}><Sparkles className="mr-1 size-3" /> Save</Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-xs" variant="ghost"><MoreHorizontal className="size-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleTogglePin(selectedNote.id)}>
                      {selectedNote.pinned ? <PinOff className="mr-2 size-4" /> : <Pin className="mr-2 size-4" />}
                      {selectedNote.pinned ? "Unpin" : "Pin"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(selectedNote.id)}>
                      <Trash2 className="mr-2 size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="mx-auto max-w-3xl p-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="font-bricolage w-full border-0 bg-transparent text-2xl font-bold text-neutral-900 outline-none placeholder:text-neutral-300 focus:ring-0" placeholder="Note title..." autoFocus />
                    <Separator />
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-neutral-700 outline-none placeholder:text-neutral-300 focus:ring-0" placeholder="Start writing your note..." rows={18} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h1 className="font-bricolage text-2xl font-bold text-neutral-900">{selectedNote.title}</h1>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNote.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className={cn("border text-[10px]", tagColors[tag] || "bg-neutral-50 text-neutral-600")}>
                          <Tag className="mr-1 size-2.5" />{tag}
                        </Badge>
                      ))}
                    </div>
                    <Separator />
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                      {selectedNote.content || <span className="italic text-neutral-400">No content yet...</span>}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50">
                <BookOpen className="size-8 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bricolage text-lg font-semibold text-neutral-800">Select a note</h3>
                <p className="mt-1 text-sm text-neutral-500">Choose a note or generate one from a document</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowGeneratePanel(true)}>
                  <Sparkles className="mr-1 size-4" /> Generate from Document
                </Button>
                <Button variant="outline" size="sm" onClick={handleCreateNote}>
                  <Plus className="mr-1 size-4" /> Create New Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteListItem({ note, isSelected, onSelect, onDelete, onTogglePin }: {
  note: Note; isSelected: boolean; onSelect: () => void; onDelete: () => void; onTogglePin: () => void;
}) {
  const preview = note.content.length > 80 ? note.content.slice(0, 80) + "..." : note.content || "No content";

  return (
    <div className={cn("group relative cursor-pointer rounded-lg px-3 py-2.5 transition-all duration-150", isSelected ? "bg-amber-50 shadow-sm" : "hover:bg-neutral-50")} onClick={onSelect}>
      <div className="mb-1 flex items-start justify-between">
        <h3 className={cn("flex-1 truncate text-sm font-medium", isSelected ? "text-amber-900" : "text-neutral-800")}>{note.title}</h3>
        <div className="ml-2 flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-xs" variant="ghost" className="size-6"><MoreHorizontal className="size-3" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={onTogglePin}>
                {note.pinned ? <PinOff className="mr-2 size-3.5" /> : <Pin className="mr-2 size-3.5" />}
                {note.pinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="mr-2 size-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="mb-1.5 line-clamp-2 text-[11px] leading-relaxed text-neutral-500">{preview}</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-neutral-400">{formatDate(note.updatedAt)}</span>
        {note.pinned && <Pin className="size-2.5 text-amber-500" />}
        {note.tags.length > 0 && (
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded bg-neutral-100 px-1 py-0.5 text-[9px] font-medium text-neutral-500">{tag}</span>
            ))}
            {note.tags.length > 2 && <span className="text-[9px] text-neutral-400">+{note.tags.length - 2}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
