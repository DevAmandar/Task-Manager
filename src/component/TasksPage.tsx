import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchTasks, selectAllTasks, selectTasksStatus } from "../features/tasksSlice"
import { Link } from "react-router"

export const TasksPage = () => {

    const dispatch = useAppDispatch()
    const tasks = useAppSelector(selectAllTasks)
    const tasksStatus = useAppSelector(selectTasksStatus)

    useEffect(() => {
        if (tasksStatus === 'idle') {
            dispatch(fetchTasks())
        }
    }, [tasksStatus, dispatch])

    if (tasksStatus === 'pending') return <p>Loading…</p>
    if (tasksStatus === 'rejected') return <p>Error loading todos</p>

    return (
        <>
            <div className="flex gap-1.5" >
                {tasks.map(task => (
                    <div className="border-2 w-[220px]" key={task.id}>
                        <Link to={`/tasks/${task.id}`} className="border-b-2 text-center w-full block"> {task.title} </Link>
                        <p className="p-3">{task.description}</p>
                    </div>
                ))}
            </div>
        </>
    )
}