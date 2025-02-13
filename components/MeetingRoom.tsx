import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";

type CallLayoutType =
  | "grid"
  | "speaker-right"
  | "speaker-left"
  | "speaker-bottom"
  | "speaker-top";

function MeetingRoom() {
  const searchParams = useSearchParams();
  const isPersonalRooom = searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const router = useRouter();

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition={"left"} />;

      case "speaker-bottom":
        return <SpeakerLayout participantsBarPosition={"top"} />;

      case "speaker-top":
        return <SpeakerLayout participantsBarPosition={"bottom"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"right"} />;
    }
  };
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="flex-center relative size-full">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("ml-2 hidden h-[calc(100vh-86px)] bg-dark-1 p-5", {
            flex: showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-5">
        <CallControls onLeave={() => router.replace("/")} />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none bg-dark-1 text-white">
            {[
              "Grid",
              "Speaker-Left",
              "Speaker-Right",
              "Speaker-Bottom",
              "Speaker-Top",
            ].map((item, i) => {
              return (
                <DropdownMenuItem
                  key={i}
                  className="cursor-pointer"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <Users size={20} />
        </button>

        {!isPersonalRooom && <EndCallButton />}
      </div>
    </section>
  );
}

export default MeetingRoom;
