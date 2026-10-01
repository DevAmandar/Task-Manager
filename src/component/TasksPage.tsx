import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchTasks, selectAllTaskIds } from "../features/tasksSlice"
import { TaskCard } from "./TaskCard"

export const TasksPage = () => {

    const dispatch = useAppDispatch()
    const taskIds = useAppSelector(selectAllTaskIds)
    const fetchStatus = useAppSelector((state) => state.tasks.fetchStatus)

    useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchTasks())
        }
    }, [fetchStatus, dispatch])

    if (fetchStatus === 'pending') return <p>Loading…</p>
    if (fetchStatus === 'rejected') return <p>Error loading todos</p>

    return (
        <>
            <div className="flex gap-1.5">
                {taskIds.map((id) => (
                    <TaskCard key={id} taskId={id} />
                ))}
            </div>
        </>
    )
}