import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { TasksPage } from './component/TasksPage'
import { Task } from './features/Task'

function App() {
  return (
    <div className='gap-1 m-5'>
      <BrowserRouter basename="/Task-Manager/">
      <h1>navbar</h1>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks/:tasksId" element={<Task />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App