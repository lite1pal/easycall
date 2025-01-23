// "use client";

// import { useGetCalls } from "@/hooks/useGetCalls";
// import MeetingCard from "./MeetingCard";

// export type CallType = "upcoming" | "previous" | "recordings";

// interface CallListProps {
//   type: CallType;
// }

// function CallList({ type }: CallListProps) {
//   const { previousCalls, upcomingCalls, callRecordings, isLoading } =
//     useGetCalls();

//   const getCalls = () => {
//     switch (type) {
//       case "previous":
//         return previousCalls;
//       case "upcoming":
//         return upcomingCalls;
//       case "recordings":
//         return callRecordings;
//       default:
//         return [];
//     }
//   };

//   const getNoCallsMessage = () => {
//     switch (type) {
//       case "previous":
//         return "No previous meetings";
//       case "upcoming":
//         return "No upcoming meetings";
//       case "recordings":
//         return "No call recordings";
//       default:
//         return "";
//     }
//   };

//   const calls = getCalls();
//   const noCallsMessage = getNoCallsMessage();

//   return (
//     <div className="grid gap-5 lg:grid-cols-2">
//       {calls.length > 0 ? (
//         calls.map((call) => (
//           <MeetingCard
//             call={call}
//             type={type}
//             iconSrc="/icons/upcoming.svg"
//             iconAlt="Upcoming icon"
//           />
//         ))
//       ) : (
//         <h1 className="text-3xl font-[600]">{noCallsMessage}</h1>
//       )}
//     </div>
//   );
// }

// export default CallList;

"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";

import Loader from "./Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CallList = ({
  type,
}: {
  type: "previous" | "upcoming" | "recordings";
}) => {
  const router = useRouter();
  const { previousCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "previous":
        return previousCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "previous":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "previous"
                ? "/icons/previous.svg"
                : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "No Description"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "previous"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_URL}/meeting/${(meeting as Call).id}`
            }
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
