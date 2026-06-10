"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const login = async () => {
      try {
        // CSRF Cookie取得
        const csrfRes = await fetch(
          "http://localhost:8000/sanctum/csrf-cookie",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          }
        );

        if (!csrfRes.ok) {
          console.log("CSRF取得失敗");
          return;
        }

        // CookieからXSRF-TOKEN取得
        const token = decodeURIComponent(
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1] || ""
        );

        // ログアウト
        const res = await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
        });

        console.log("status:", res.status);

        // HTMLエラー対策
        const text = await res.text();

        try {
          const data = JSON.parse(text);
          console.log(data);
        } catch {
          console.log("JSONではありません");
          console.log(text);
        }
      } catch (error) {
        console.error(error);
      }
    };

    login();
  }, []);

  return <div>page</div>;
}