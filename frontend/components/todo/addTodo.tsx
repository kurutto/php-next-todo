"use client";
import { useState } from "react";
import { getCsrfToken } from "@/lib/getCsrf";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodosStore } from "@/stores/todosStore";
import Input from "@/components/ui/input";
import { NETWORK_ERROR, SERVER_ERROR } from "@/constants/error";

const formSchema = z.object({
  title: z.string().min(1, "title is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AddTodo = () => {
  const { addTodo } = useTodosStore();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = async (values: FormValues): Promise<void> => {
    setError("");
    try {
      const token = await getCsrfToken();
      if (!token) {
        setError(NETWORK_ERROR);
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        setError(SERVER_ERROR);
        console.error(`Failed to fetch todo: ${res.status}`);
        return;
      }

      const data = await res.json();
      addTodo({
        id: data.id,
        title: data.title,
        completed: data.completed,
        timestamps: data.timestamps,
      });
      reset();
    } catch (e) {
      setError(NETWORK_ERROR);
      console.error("Add todo request failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <p>title:</p>

        <Input
          type="text"
          placeholder="Enter title..."
          {...register("title")}
        />

        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};
export default AddTodo;
