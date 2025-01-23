"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call?.state.createdBy.id;

  const endCall = async () => {
    await call?.endCall();
    router.replace("/");
  };

  if (!isMeetingOwner) return null;

  return <Button onClick={endCall}>End call for everyone</Button>;
}

export default EndCallButton;
