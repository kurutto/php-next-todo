"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<any> | null = null;

export const getEcho = () => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!echo) {
    window.Pusher = Pusher;
    echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST!,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT!),
      forceTLS: false,
      enabledTransports: ["ws"],
    });
  }
  return echo;
};
