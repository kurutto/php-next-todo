"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
// import { useGetUser } from "@/hooks/useGetUser";

interface TestNotificationEvent {
  message: string;
}

export default function ReverbTestPage() {
  //   const user = useGetUser();
  //   console.log("user", user);
  useEffect(() => {
    const echo = getEcho();

    console.log("echo", echo);
    if (!echo) return;
    console.log("connecting...");

    echo
      .private("test-private")
      .listen("TestNotification", (e: TestNotificationEvent) => {
        console.log("受信:", e);
      });

    return () => {
      echo.leaveChannel("test-private");
    };
  }, []);

  return <div>Reverb Test</div>;
}
