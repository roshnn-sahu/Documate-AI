import { ArrowUpIcon, File, MicIcon, PaperclipIcon, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const title = "AI with Voice";

const AiInput = ({ className="" }: { className: String }) => (
  <div className={cn("flex w-full max-w-2xl flex-col gap-4", { className })}>
    <InputGroup className="bg-background">
      <InputGroupTextarea placeholder="Type or speak your message..." />

      <InputGroupAddon align="block-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton
              className="text-md rounded-full border"
              variant="ghost"
            >
              <Plus />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem>
              {" "}
              <PaperclipIcon /> Attach File
            </DropdownMenuItem>
            <DropdownMenuItem>Claude 3 Opus</DropdownMenuItem>
            <DropdownMenuItem>Claude 3 Haiku</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <InputGroupButton size="icon-xs" variant="ghost" className="ml-auto">
          <MicIcon />
        </InputGroupButton>

        <Separator className="!h-4" orientation="vertical" />
        <InputGroupButton
          className="rounded-full"
          size="icon-xs"
          variant="default"
        >
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <small className="text-muted-foreground relative z-10 text-center">
      For better AI components, check out{" "}
      <a className="underline" href="https://ai-sdk.dev/elements/overview">
        AI Elements
      </a>
    </small>
  </div>
);

export default AiInput;
