"use client";
import { useState } from "react";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { TodoType } from "@/types/types";
import EditTodo from "@/components/todo/editTodo";
import Button from "@/components/ui/button";
import { TODO_STATUS_LABEL } from "@/constants/todo";

interface TodoItemProps extends Omit<
  React.ComponentPropsWithoutRef<"li">,
  "className"
> {
  todo: TodoType;
  className?: string;
}
const TodoItem = ({ todo, className, ...props }: TodoItemProps) => {
  const { handleDeleteTodo } = useDeleteTodo();
  const [isEdit, setIsEdit] = useState(false);
  return (
    <li className="mt-5" {...props}>
      {isEdit ? (
        <div className="flex space-x-1">
          <EditTodo todo={todo} setIsEdit={setIsEdit} />
          <button
            onClick={() => setIsEdit(false)}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex space-x-1 items-center">
          <span>{todo.title}</span>
          <span className="bg-gray-100 p-[3px] rounded-xs h-fit">
            {todo.completed ? TODO_STATUS_LABEL.true : TODO_STATUS_LABEL.false}
          </span>
          <Button
            className="text-sm"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>
          <Button
            className="text-sm"
            onClick={() => {
              handleDeleteTodo(todo.id);
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
