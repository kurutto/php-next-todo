"use client";
import { getCsrfToken } from "@/lib/getCsrf";
import { useTodosStore } from "@/stores/todosStore";

export const useDeleteTodo = () => {
  const { deleteTodo } = useTodosStore();

  const handleDeleteTodo = async (id: number): Promise<void> => {
    try {
      const token = await getCsrfToken();
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
        },
      );
      if (!res.ok) {
        console.error(`Failed to delete todo: ${res.status}`);
        return;
      }
      deleteTodo(id);
    } catch (e) {
      console.error("Delete todo request failed");
    }
  };
  return { handleDeleteTodo };
};
