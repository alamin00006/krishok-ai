import { Suspense } from "react";
import ChatPage from "@/routes/index";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ChatPage />
    </Suspense>
  );
}
