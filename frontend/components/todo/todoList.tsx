import { TodoType } from '@/types/types';
import TodoItem from './todoItem';

interface TodoListProps
    extends Omit<React.ComponentPropsWithoutRef<"ul">, "className"> {
    todos: TodoType[];
    className?: string;
}
const TodoList = ({
    todos,
    className,
    ...props
}: TodoListProps) => {
    return (
        <ul className='m-4' {...props}>
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} className='mt-5' />
            ))}

        </ul>
    )
}

export default TodoList;