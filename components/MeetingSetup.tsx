"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";

function MeetingSetup({
  setIsSetupComplete,
}: {
  setIsSetupComplete: Dispatch<SetStateAction<boolean>>;
}) {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);

  const call = useCall();

  if (!call)
    throw new Error("useCall must be used within StreamCall component");

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);
  return (
    <div className="flex-center h-screen w-full flex-col text-white">
      <h1 className="text-2xl font-bold">Setup</h1>

      <VideoPreview />

      <div className="flex-center h-16 gap-3">
        <label className="flex-center cursor-pointer gap-3">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
            className="cursor-pointer"
          />
          Join with mic and camera off
        </label>

        <DeviceSettings />
      </div>

      <Button
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
        className="bg-green-600 hover:bg-green-700"
      >
        Join Meeting
      </Button>
    </div>
  );
}

export default MeetingSetup;
