"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Loader2, MessageSquare } from "lucide-react";
import { listSessions } from "@/lib/services/chat";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  updated_at: string;
}

interface SessionPickerProps {
  selectedSessionId: string | null;
  onSelect: (sessionId: string) => void;
  className?: string;
}

export function SessionPicker({
  selectedSessionId,
  onSelect,
  className,
}: SessionPickerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const sessionsData = await listSessions();
        setSessions(sessionsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-neutral-500", className)}>
        <Loader2 className="size-3 animate-spin" />
        <span>Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-xs text-red-500", className)}>
        Failed to load sessions
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-neutral-500", className)}>
        <MessageSquare className="size-3" />
        <span>No chat sessions yet. Start a chat first.</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2 text-xs", className)}
        >
          <MessageSquare className="size-3.5" />
          <span className="max-w-[200px] truncate">
            {selectedSession?.title || "Select a session"}
          </span>
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {sessions.map((session) => (
          <DropdownMenuItem
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={cn(
              "cursor-pointer text-xs",
              session.id === selectedSessionId && "bg-neutral-100",
            )}
          >
            <span className="truncate">{session.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
