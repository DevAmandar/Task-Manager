import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { TasksPage } from './component/TasksPage'
import { Task } from './features/Task'
import { useRef } from 'react'
import { AddTaskModal } from './component/modals/AddTaskModal'

function App() {

  const modalRef = useRef<HTMLDialogElement>(null)

  const showModal = () => {
    modalRef.current?.showModal()
  }
  return (
    <div className='gap-1 m-5'>
      <BrowserRouter basename="/Task-Manager/">
      <div className='p-1.5 w-[80%] flex justify-between border-2 mx-auto mb-3.5'>
        <h1>icon</h1>
        <button onClick={showModal} className='px-2 py-1 border-2 cursor-pointer'>Add</button>
      </div>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks/:tasksId" element={<Task />} />
        </Routes>
        <AddTaskModal modalRef={modalRef} />
      </BrowserRouter>
    </div>
  )
}

export default App