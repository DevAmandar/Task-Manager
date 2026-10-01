import { createEntityAdapter, createSlice, type EntityState } from "@reduxjs/toolkit"
import { client } from "../api/client"
import type { RootState } from "../app/store"
import { createAppAsyncThunk } from "../app/createAppAsyncThunk"


export interface TodoItem {
  id: string
  description: string
}

export interface Todo {
  id: string
  title: string
  items: TodoItem[]
}

export interface Task {
  id: string
  title: string
  description: string
  todos: Todo[]
}

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const fetchTasks = createAppAsyncThunk('tasks/fetchTasks', async () => {
  const response = await client.get<Task[]>(`${API_BASE}/fakeApi/tasks`)
  return response.data
})

export const addTask = createAppAsyncThunk(
  'tasks/addTask',
  async (payload: { title: string; description: string }) => {
    const response = await client.post<Task>(
      `${API_BASE}/fakeApi/tasks`,
      payload,
    )
    return response.data
  }
)

interface TasksState extends EntityState<Task, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const tasksAdapter = createEntityAdapter<Task>({})

const initialState: TasksState = tasksAdapter.getInitialState({
  status: 'idle',
  error: null,
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Save the fetched posts into state
        tasksAdapter.setAll(state, action.payload)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addTask.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(addTask.fulfilled, (state, action) => {
        tasksAdapter.addOne(state, action.payload)
        state.status = 'succeeded'
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add task'
      })
  },
})

export const selectTasksStatus = (state: RootState) => state.tasks.status

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks)

export default tasksSlice.reducer