"use client";

import * as React from "react";

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
} from "lucide-react";
import { HeroGradient } from "../hero-gradient";
import AiInput from "@/components/chat/ai-input";
import { useRouter } from "next/navigation";

export function ChatSidebar({ children }) {
  const router = useRouter();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
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
        url: "/workspace",
        icon: <BotIcon />,
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
      <Sidebar collapsible="icon">
        <SidebarHeader
          className="border-b"
          onClick={() => router.push("/chat")}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-white data-open:text-black"
              >
                <Button size="icon-sm" asChild className="size-8">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                    >
                      <rect width="256" height="256" fill="none"></rect>
                      <line
                        x1="208"
                        y1="128"
                        x2="128"
                        y2="208"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></line>
                      <line
                        x1="192"
                        y1="40"
                        x2="40"
                        y2="192"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></line>
                    </svg>
                  </span>
                </Button>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {data.company.name}
                  </span>
                  <span className="truncate text-xs">{data.company.plan}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarMenu className="mt-3 px-2" onClick={() => router.push("/chat")}>
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
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <div className="mx-2 border-t" />

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>History</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      {item.name}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

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
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
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
                    <DropdownMenuItem>Log out</DropdownMenuItem>
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
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
