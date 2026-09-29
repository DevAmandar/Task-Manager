import { useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../app/hooks'

import { fetchTasks, selectAllTasks, selectTasksStatus } from './tasksSlice'

export const Todos = () => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(selectAllTasks)
    const tasksStatus = useAppSelector(selectTasksStatus)

    useEffect(() => {
        if (tasksStatus === 'idle') {
            dispatch(fetchTasks())
        }
    }, [tasksStatus, dispatch])

    if (tasksStatus === 'pending') return <p>Loading…</p>
    if (tasksStatus === 'rejected') return <p>Error loading todos</p>

    return (
        <div>
            <p>Count: {tasks.length}</p>
            {tasks.map((task) => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    {task.todos.map((todo) => (
                        <ul key={todo.id}>
                            <div >
                                <h4>{todo.title}</h4>
                                <ul>
                                    {todo.items.map((item) => (
                                        <div key={item.id}>
                                            <i>{item.description}</i>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </ul>
                    ))}
                </div>
            ))}
        </div>
    )
}