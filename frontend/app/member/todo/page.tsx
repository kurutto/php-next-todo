"use client";

import { useGetTodos } from "@/hooks/useGetTodos";
import AddTodo from "@/components/todo/addTodo";
import TodoList from "@/components/todo/todoList";


export default function Page() {
  const { todos } = useGetTodos();

  return (
    <>
      <AddTodo />
      {!todos ? <p>Please input todo</p> : <TodoList todos={todos} />}
    </>
  );
}
