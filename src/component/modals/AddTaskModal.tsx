import type React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addTask } from "../../features/tasksSlice"
import { Modal } from "./Modal"

type Props = {
    modalRef: React.RefObject<HTMLDialogElement | null>
}

interface AddTaskFormFields extends HTMLFormControlsCollection {
    taskTitle: HTMLInputElement
    taskContent: HTMLTextAreaElement
}

interface AddTaskFormElements extends HTMLFormElement {
    readonly elements: AddTaskFormFields
}

export const AddTaskModal = ({ modalRef }: Props) => {

    const dispatch = useAppDispatch()
    const addStatus = useAppSelector(state => state.tasks.addStatus)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        const form = e.currentTarget
        const { elements } = form as AddTaskFormElements
        const taskTitle = elements.taskTitle
        const taskContent = elements.taskContent

        const values = {
            title: taskTitle.value.trim(),
            description: taskContent.value.trim(),
        }

        if (!values) return
        await dispatch(addTask(values))

        form.reset()
        modalRef.current?.close()

    }

    const closeModal = () => {
        modalRef.current?.close()
    }

    return (
        <Modal title="Add Task" modalRef={modalRef}>
            <form onSubmit={handleSubmit} >
                <div className="flex flex-col p-2.5">
                    <label htmlFor="taskTitle">Title</label>
                    <input
                        id="taskTitle"
                        className="mb-2 outline-none p-1.5 border-gray-600 border-2"
                        type="text"
                        name="taskTitle"
                        required
                    />
                    <label htmlFor="taskContent">Description</label>
                    <textarea
                        id="taskContent"
                        className='mb-2 outline-none p-1.5 border-gray-600 border-2'
                        name="taskContent"
                        required
                    />
                </div>
                <div className="mb-1 flex justify-center items-center gap-1.5">
                    <button type="submit" className="border-2 p-1.5 cursor-pointer">
                        {addStatus === 'pending' ? 'Adding...' : 'Submit'}
                    </button>
                    <button
                        type="button"
                        className="border-2 p-1.5 cursor-pointer"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    )
}