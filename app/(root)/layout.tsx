import StreamVideoProvider from "@/providers/StreamClientProvider";
import { ReactNode } from "react";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
}

export default RootLayout;
