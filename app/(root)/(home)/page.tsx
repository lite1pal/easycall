"use client";

import MeetingModal from "@/components/MeetingModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [meetingState, setMeetingState] = useState<
    "isNewMeeting" | "isJoinMeeting" | "isScheduleMeeting" | undefined
  >();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!user || !client) return;

    try {
      const id = crypto.randomUUID();

      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create a call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "New meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push("meeting/" + call.id);
      }

      toast({ title: "Meeting created" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to create a new meeting" });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="flex size-full flex-col gap-5 text-white lg:gap-10">
      <HeroBanner />

      <section className="flex flex-wrap gap-5">
        <MeetingActionCard
          className="bg-[#FF742E]"
          iconSrc="/icons/add-meeting.svg"
          iconAlt="Add meeting"
          handleClick={() => setMeetingState("isNewMeeting")}
        >
          <div className="text-[24px] font-[700]">New</div>
          <div>Setup a new recording</div>
        </MeetingActionCard>
        <MeetingActionCard
          className="bg-[#0E78F9]"
          iconSrc="/icons/join-meeting.svg"
          iconAlt="Join meeting"
          handleClick={() => setMeetingState("isScheduleMeeting")}
        >
          <div className="text-[24px] font-[700]">Join</div>
          <div>via invitation link</div>
        </MeetingActionCard>
        <MeetingActionCard
          className="bg-[#830EF9]"
          iconSrc="/icons/schedule.svg"
          iconAlt="Schedule meeting"
        >
          <div className="text-[24px] font-[700]">Schedule</div>
          <div>Plan your meeting</div>
        </MeetingActionCard>
        <MeetingActionCard
          className="bg-[#F9A90E]"
          iconSrc="/icons/recordings.svg"
          iconAlt="View recordings"
        >
          <div className="text-[24px] font-[700]">View</div>
          <div>Meeting recordings</div>
        </MeetingActionCard>

        {!callDetails ? (
          <MeetingModal
            isOpen={meetingState === "isScheduleMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Create meeting"
            className="text-center"
            buttonText="Schedule Meeting"
            handleClick={createMeeting}
          >
            <div className="grid gap-5">
              <div className="grid gap-3">
                <Label className="text-slate-300" htmlFor="description">
                  Add a description
                </Label>
                <Input
                  required
                  onChange={(e) => {
                    setValues({ ...values, description: e.target.value });
                  }}
                  id="description"
                  className="border-none bg-dark-2"
                />
              </div>
              <div className="grid gap-3">
                <Label className="text-slate-300" htmlFor="date-time">
                  Select Date & Time
                </Label>
                <Input
                  required
                  type="datetime-local"
                  id="date-time"
                  onChange={(e) => {
                    setValues({
                      ...values,
                      dateTime: new Date(e.target.value),
                    });
                  }}
                  className="border-none bg-dark-2"
                />
              </div>
            </div>
          </MeetingModal>
        ) : (
          <MeetingModal
            isOpen={meetingState === "isScheduleMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Meeting created"
            className="text-center"
            buttonText="Copy meeting link"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({ title: "Link copied" });
            }}
          />
        )}

        <MeetingModal
          isOpen={meetingState === "isNewMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Start a new meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
        />
      </section>

      <div className="flex-between">
        <h2 className="text-[30px] font-[700]">
          Today{"'"}s Upcoming Meetings
        </h2>

        <Link href="/upcoming" className="hover:underline">
          See all
        </Link>
      </div>
    </section>
  );
}

export default Home;

function HeroBanner() {
  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="flex h-[300px] w-full flex-col justify-between rounded-[20px] bg-hero bg-cover p-10">
      <div className="w-fit bg-white/5 px-3 py-2">
        Upcoming Meeting at: 12:30 PM
      </div>

      <div className="flex flex-col">
        <div className="flex items-end gap-3">
          <h1 className="text-[72px] font-[800]">{time.split(" ")[0]}</h1>
          <div className="mb-[22px] text-[24px]">{time.split(" ")[1]}</div>
        </div>
        <p className="text-[24px] text-gray-1">{date}</p>
      </div>
    </div>
  );
}

function MeetingActionCard({
  className,
  iconSrc,
  iconAlt,
  children,
  handleClick,
}: {
  className?: string;
  iconSrc: string;
  iconAlt: string;
  children: ReactNode;
  handleClick?: () => void;
}) {
  return (
    <div
      onClick={handleClick}
      className={cn(
        `flex h-[260px] w-full flex-1 cursor-pointer flex-col justify-between rounded-[14px] bg-[#FF742E] p-7 max-xl:min-w-[300px]`,
        className,
      )}
    >
      <div className="flex-center w-fit rounded-[10px] bg-white/35 p-3">
        <Image src={iconSrc} width={36} height={36} alt={iconAlt} />
      </div>

      <div>{children}</div>
    </div>
  );
}
