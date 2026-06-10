"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";

interface TestNotificationEvent {
  message: string;
}

export default function ReverbTestPage() {
  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;
    console.log("connecting...");

    echo
      .channel("test-channel")
      .listen("TestNotification", (e: TestNotificationEvent) => {
        console.log("受信:", e);
      });

    return () => {
      echo.leaveChannel("test-channel");
    };
  }, []);

  return <div>Reverb Test</div>;
}
