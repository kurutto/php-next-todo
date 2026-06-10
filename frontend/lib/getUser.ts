import { UserType } from "@/types/types";
import { cookies } from "next/headers";

export const getUser = async (): Promise<UserType | null> => {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const res = await fetch(`${process.env.API_URL}/user`, {
      method: "GET",
      headers: {
        Cookie: cookie,
        Accept: "application/json",
        Referer: process.env.APP_URL!,
        Origin: process.env.APP_URL!,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch user: ${res.status}`);
      return null;
    }
    const user: UserType = await res.json();
    return user;
  } catch (e) {
    console.error("user request failed");
    return null;
  }
};
