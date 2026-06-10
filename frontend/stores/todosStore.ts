import { TodoType } from "@/types/types";
import { create } from "zustand";

type TodosStore = {
  todos: TodoType[];
  setTodos: (todos: TodoType[]) => void;

  addTodo: (todo: TodoType) => void;

  updateTodo: (updatedTodo: TodoType) => void;

  deleteTodo: (id: number) => void;
};

export const useTodosStore = create<TodosStore>((set) => ({
  todos: [],
  setTodos: (todos) =>
    set({
      todos,
    }),

  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo],
    })),

  updateTodo: (updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === updatedTodo.id
          ? updatedTodo
          : todo
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter(
        (todo) => todo.id !== id
      ),
    })),
}));