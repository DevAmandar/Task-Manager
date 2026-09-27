import { Provider } from 'react-redux'
import './App.css'
import { store } from './app/store'
import { Todos } from './features/Todos'

function App() {
  return (
    <>
        <h1>Hello World</h1>
        <Todos />
    </>
  )
}

export default App