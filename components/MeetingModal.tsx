"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  image?: string;
  buttonIcon?: string;
}

function MeetingModal({
  isOpen,
  onClose,
  title,
  children,
  handleClick,
  buttonText,
}: MeetingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="border-none bg-dark-1 text-white">
        <h3 className="text-xl font-[600]">{title}</h3>
        <div className="my-5">{children}</div>
        <Button onClick={handleClick} className="bg-blue-1">
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingModal;
