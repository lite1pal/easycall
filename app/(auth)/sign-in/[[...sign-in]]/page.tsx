import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex-center h-screen">
      <SignIn />
    </main>
  );
}
