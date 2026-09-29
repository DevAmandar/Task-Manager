import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { TasksPage } from './component/TasksPage'
import { Task } from './features/Task'

function App() {
  return (
    <>
      <BrowserRouter basename="/Task-Manager/">
      <h1>hello world</h1>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks/:tasksId" element={<Task />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App