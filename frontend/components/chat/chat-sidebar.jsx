"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpen,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  ChevronsUpDownIcon,
  ChevronRightIcon,
  Pen,
  SquarePen,
  Upload,
  Files,
  Waypoints,
  Star,
  ChartGanttIcon,
  Ellipsis,
  Trash2,
  Pencil,
  Share,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTool } from "@/context/tool-context";
import Image from "next/image";
import { signOut } from "@/lib/services/auth";
import { deleteSession, renameSession } from "@/lib/services/chat";

// Fixed syntax error and added ToolProvider support

export function ChatSidebar({ children, user, sessions = [] }) {
  const router = useRouter();
  const { runTool } = useTool();
  const [isDeleting, setIsDeleting] = useState(null); // sessionId being deleted
  const [renameTarget, setRenameTarget] = useState(null); // { id, title }
  const [renameValue, setRenameValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleDeleteChat = async (id) => {
    try {
      await deleteSession(id);
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const openRenameDialog = (session) => {
    setRenameTarget(session);
    setRenameValue(session.title || "");
  };

  const handleRenameSave = async () => {
    if (!renameTarget || !renameValue.trim()) return;
    setIsSaving(true);
    try {
      await renameSession(renameTarget.id, renameValue.trim());
      setRenameTarget(null);
      router.refresh();
    } catch (err) {
      console.error("Rename error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const data = {
    user: {
      name: user?.name || "User",
      email: user?.email || "",
      avatar: user?.avatar || "/placeholder.svg",
    },
    company: {
      name: "Documate AI",
      plan: "AI Chatbot",
    },

    navMain: [
      {
        title: "Uploads",
        url: "/uploads",
        icon: <Upload />,
        isActive: true,
      },
      {
        title: "Documents",
        url: "/documents",
        icon: <Files />,
      },
      {
        title: "AI Workspace",
        url: "#",
        icon: <BotIcon />,
        items: [
          {
            title: "Summarize",
            url: "/workspace/summrize",
            tool: "summary",
          },
          {
            title: "Flashcards",
            url: "/workspace/flashcards",
            tool: "flashcards",
          },
          {
            title: "Notes",
            url: "/workspace/notes",
            tool: "notes",
          },
          {
            title: "Quiz",
            url: "/workspace/quiz",
            tool: "quiz",
          },
          {
            title: "Insights",
            url: "/workspace/insights",
            tool: "insights",
          },
        ],
      },
      {
        title: "Favourites",
        url: "/favourites",
        icon: <Star />,
      },
      {
        title: "Shared",
        url: "/shared",
        icon: <Waypoints />,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: <FrameIcon />,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: <PieChartIcon />,
      },
      {
        name: "Travel",
        url: "#",
        icon: <MapIcon />,
      },
    ],
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="scrollbar-none">
        <SidebarHeader
          className="border-b"
          onClick={() => router.push("/chat/new")}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-white data-open:text-black"
              >
                <Button
                  size="icon-sm"
                  className="flex size-8 items-center justify-center rounded-full bg-(image:--color-theme-gradient) text-white shadow-sm shadow-rose-200/50"
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-full p-1"
                  />
                </Button>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font- truncate font-medium">
                    {data.company.name}
                  </span>
                  <span className="truncate text-xs">{data.company.plan}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarMenu
          className="mt-3 px-2"
          onClick={() => router.push("/chat/new")}
        >
          <Collapsible asChild className="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                tooltip={"new-title"}
                asChild
              >
                <CollapsibleTrigger>
                  <SquarePen />
                  <span>New chat</span>
                </CollapsibleTrigger>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <CollapsibleTrigger
                        onClick={() => router.push(`${item.url}`)}
                        className="cursor-pointer"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                        {item.items && (
                          <ChevronRightIcon className="ml-auto transition-transform duration-100 group-data-open/collapsible:rotate-90" />
                        )}
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item?.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            onClick={() => router.push(subItem.url)}
                          >
                            <SidebarMenuSubButton asChild>
                              <span className="cursor-pointer">
                                {subItem.title}
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <div className="mx-2 border-t" />

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>History</SidebarGroupLabel>

            <SidebarMenu>
              {sessions.length === 0 ? (
                <p className="text-muted-foreground px-2 py-1 text-xs">
                  No chats yet
                </p>
              ) : (
                sessions.map((s) => (
                  <SidebarMenuItem key={s.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={s.title}
                      className="cursor-pointer"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span onClick={() => router.push(`/chat/${s.id}`)}>
                          <span className="truncate">{s.title}</span>
                        </span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Ellipsis />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent>
                            <DropdownMenuLabel>
                              {" "}
                              <Share className="size-4" /> Share
                            </DropdownMenuLabel>
                            <DropdownMenuLabel
                              onClick={() => openRenameDialog(s)}
                            >
                              {" "}
                              <Pencil className="size-4" /> Rename
                            </DropdownMenuLabel>
                            <DropdownMenuLabel
                              className="text-red-600"
                              onClick={() => setIsDeleting(s.id)}
                            >
                              <Trash2 className="size-4" /> Delete
                            </DropdownMenuLabel>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <div className="mx-2 border-t" />

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  >
                    <Avatar>
                      <AvatarImage
                        src={data.user.avatar || "/placeholder.svg"}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                    <ChevronsUpDownIcon />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <Item size="xs">
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage
                              src={data.user.avatar || "/placeholder.svg"}
                              alt={data.user.name}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{data.user.name}</ItemTitle>
                          <ItemDescription> {data.user.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      {/* chat section */}
      <SidebarInset>
        <header className="relative z-10 flex h-16.5 shrink-0 items-center justify-between border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-8 w-8 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={data.user.avatar || "/placeholder.svg"}
                      alt={data.user.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="mr-4">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <Item size="xs">
                      <ItemMedia>
                        <Avatar>
                          <AvatarImage
                            src={data.user.avatar || "/placeholder.svg"}
                            alt={data.user.name}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{data.user.name}</ItemTitle>
                        <ItemDescription> {data.user.email}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-neutral-50/20">
          {children}
        </main>
      </SidebarInset>

      {/* Rename Dialog */}
      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
            <DialogDescription>
              Give this chat a new name to find it easily later.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Enter a new name..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSaving) handleRenameSave();
              if (e.key === "Escape") setRenameTarget(null);
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameTarget(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameSave} disabled={isSaving || !renameValue.trim()}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleting !== null}
        onOpenChange={(open) => {
          if (!open) setIsDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat and all its messages. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleting(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDeleteChat(isDeleting)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
