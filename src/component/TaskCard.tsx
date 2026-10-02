import { memo, useState } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { deleteTask, selectDeleteStatus, selectTaskById } from '../features/tasksSlice'

interface TaskCardProps {
    taskId: string
}

export const TaskCard = memo(({ taskId }: TaskCardProps) => {

    const task = useAppSelector((state) => selectTaskById(state, taskId))
    const dispatch = useAppDispatch()

    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteTaskKard = async () => {
        setIsDeleting(true)
        try {
            await dispatch(deleteTask(taskId)).unwrap()
        } catch {
            setIsDeleting(false)
        }
    }

    if (!task) return null

    return (
        <div className="border-2 w-[220px]">
            <div className="border-b-2 py-1 px-2.5 flex justify-between items-center">
                <Link to={`/tasks/${taskId}`}>
                    {task.title}
                </Link>
                <button onClick={handleDeleteTaskKard} className='cursor-pointer'> {isDeleting ? 'Deleting...' : 'Delete'} </button>
            </div>
            <p className="p-3">{task.description}</p>
        </div>
    )
})

TaskCard.displayName = 'TaskCard'