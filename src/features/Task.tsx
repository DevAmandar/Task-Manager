import { Link, useParams } from "react-router"
import { useAppSelector } from "../app/hooks"
import { selectTaskById } from "./tasksSlice"

export const Task = () => {

    const { tasksId } = useParams()
    const task = useAppSelector(state => selectTaskById(state, tasksId!))
    return (
        <div className="">
            <div className="flex gap-1.5">
                {task.todos.map(todo => (
                    <div key={todo.id} className="border-2 m-1">
                        <h3 className="border-b-2 text-center">{todo.title}</h3>
                        <div className="p-1.5">
                            {todo.items.map(item => (
                                <div key={item.id}>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Link to='/'> Back </Link>
        </div>
    )
}