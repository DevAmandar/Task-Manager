import { memo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { deleteTask, selectDeleteStatus, selectTaskById } from '../features/tasksSlice'
import { EditTaskModal } from './modals/EditTaskModal'

interface TaskCardProps {
    taskId: string
}

export const TaskCard = memo(({ taskId }: TaskCardProps) => {

    const modalRef = useRef<HTMLDialogElement>(null)

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

    const showModal = () => {
        modalRef.current?.showModal()
    }
    if (!task) return null

    return (
        <div className="border-2 w-[220px]">
            <div className="border-b-2 py-1 px-2.5 flex justify-between items-center">
                <Link to={`/tasks/${taskId}`}>
                    {task.title}
                </Link>
                <div className='flex items-center gap-4'>
                    <button onClick={handleDeleteTaskKard} className='cursor-pointer'> {isDeleting ? 'Deleting...' : 'Delete'} </button>
                    <button onClick={showModal}>Edit</button>
                </div>
            </div>
            <p className="p-3">{task.description}</p>
            <EditTaskModal modalRef={modalRef} taskId={taskId}/>
        </div>
    )
})

TaskCard.displayName = 'TaskCard'