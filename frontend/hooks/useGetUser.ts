"use client";

import { getCsrfToken } from "@/lib/getCsrf";
import { useEffect, useState } from "react";
import { UserType } from "@/types/types";

export const useGetUser = () => {
    const [user, setUser] = useState<UserType | null>(null);
    useEffect(() => {
        const getUser = async () => {
            const token = await getCsrfToken();
            if (!token) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": token,
                }
            });
            const data = await res.json();
            setUser(data);
        }

        getUser();
    }, []);

    return { user }
}