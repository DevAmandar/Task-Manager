import type React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectEditStatus, selectTaskById, updateTask } from "../../features/tasksSlice"
import { Modal } from "./Modal"
import { useState } from "react"

type Props = {
  modalRef: React.RefObject<HTMLDialogElement | null>
  taskId: string  
}

interface EditTaskFormFields extends HTMLFormControlsCollection {
  taskTitle: HTMLInputElement
  taskContent: HTMLTextAreaElement
}

interface EditTaskFormElements extends HTMLFormElement {
  readonly elements: EditTaskFormFields
}

export const EditTaskModal = ({ modalRef, taskId }: Props) => {

  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)

  const task = useAppSelector((state) => selectTaskById(state, taskId))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const { elements } = form as EditTaskFormElements

    const values = {
      title: elements.taskTitle.value.trim(),
      description: elements.taskContent.value.trim(),
    }

    if (!values.title || !values.description) return

    setIsEditing(true)
    try {
      await dispatch(updateTask({ id: taskId, ...values })).unwrap()
      modalRef.current?.close()
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update task:', err)

    }
  }

  const closeModal = () => {
    modalRef.current?.close()
  }

  if (!task) return null

  return (
    <Modal title="Edit Task" modalRef={modalRef}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col p-2.5">
          <label htmlFor="editTaskTitle">Title</label>
          <input
            id="editTaskTitle"
            className="mb-2 outline-none p-1.5 border-gray-600 border-2"
            type="text"
            name="taskTitle"
            defaultValue={task.title}   
            required
          />
          <label htmlFor="editTaskContent">Description</label>
          <textarea
            id="editTaskContent"
            className="mb-2 outline-none p-1.5 border-gray-600 border-2"
            name="taskContent"
            defaultValue={task.description} 
            required
          />
        </div>
        <div className="mb-1 flex justify-center items-center gap-1.5">
          <button
            type="submit"
            className="border-2 p-1.5 cursor-pointer disabled:opacity-50"
          >
            {isEditing ? 'Saving...' : 'Save'}
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