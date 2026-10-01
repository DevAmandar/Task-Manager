import { memo } from 'react'
import { Link } from 'react-router'
import { useAppSelector } from '../app/hooks'
import { selectTaskById } from '../features/tasksSlice'

interface TaskCardProps {
    taskId: string
}

export const TaskCard = memo(({ taskId }: TaskCardProps) => {

    const task = useAppSelector((state) => selectTaskById(state, taskId))

    if (!task) return null

    return (
        <div className="border-2 w-[220px]">
            <Link
                to={`/tasks/${taskId}`}
                className="border-b-2 text-center w-full block"
            >
                {task.title}
            </Link>
            <p className="p-3">{task.description}</p>
        </div>
    )
})

TaskCard.displayName = 'TaskCard'