"use client";
import { getCsrfToken } from "@/lib/getCsrf";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TodoType } from "@/types/types";
import { useTodosStore } from "@/stores/todosStore";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { TODO_STATUS_LABEL } from "@/constants/todo";
import { useState } from "react";
import { NETWORK_ERROR, SERVER_ERROR } from "@/constants/error";

const formSchema = z.object({
  title: z.string().min(1, "title is required"),
  completed: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface editTodoProps extends Omit<
  React.ComponentPropsWithoutRef<"form">,
  "className"
> {
  todo: TodoType;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const EditTodo = ({ todo, setIsEdit, className, ...props }: editTodoProps) => {
  const { updateTodo } = useTodosStore();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
      completed: todo.completed ? "true" : "false",
    },
  });
  const onSubmit = async (values: FormValues): Promise<void> => {
    setError("");
    const complate = values.completed === "true" ? true : false;
    try {
      const token = await getCsrfToken();
      if (!token) {
        setError(NETWORK_ERROR);
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todos/${todo.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            title: values.title,
            completed: complate,
          }),
        },
      );
      if (!res.ok) {
        setError(SERVER_ERROR);
        console.error(`Failed to fetch todo: ${res.status}`);
        return;
      }
      updateTodo({
        id: todo.id,
        title: values.title,
        completed: complate,
        timestamps: todo.timestamps,
      });
      setIsEdit(false);
    } catch (e) {
      setError(NETWORK_ERROR);
      console.error("Edit todo request failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex space-x-1"
      {...props}
    >
      <Input type="text" {...register("title")} />

      {errors.title && (
        <p className="text-sm text-red-500">{errors.title.message}</p>
      )}

      <select className="border p-2" {...register("completed")}>
        <option value="false">{TODO_STATUS_LABEL.false}</option>
        <option value="true">{TODO_STATUS_LABEL.true}</option>
      </select>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};
export default EditTodo;
