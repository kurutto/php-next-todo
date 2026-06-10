"use client";
import { getCsrfToken } from "@/lib/getCsrf";
import { useEffect } from "react";
import { useTodosStore } from "@/stores/todosStore";

export const useGetTodos = () => {
  const { todos, setTodos } = useTodosStore();

  useEffect(() => {
    const getTodos = async (): Promise<void> => {
      try {
        const token = await getCsrfToken();
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
        });
        if (!res.ok) {
          console.error(`Failed to fetch todos: ${res.status}`);
          return;
        }
        const data = await res.json();
        setTodos(data);
      } catch (e) {
        console.error("Get todo request failed");
      }
    };
    getTodos();
  }, []);
  return { todos };
};
