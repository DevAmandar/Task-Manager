import { createEntityAdapter, createSlice, type EntityState } from "@reduxjs/toolkit"
import { client } from "../api/client"
import type { RootState } from "../app/store"
import { createAppAsyncThunk } from "../app/createAppAsyncThunk"

//---------------------------------Types------------------------------

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

//---------------------------------API Base------------------------------

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

//---------------------------------Thunks------------------------------

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

export const deleteTask = createAppAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    await client.delete(`${API_BASE}/fakeApi/tasks/${taskId}`)
    return taskId
  }
)

export const updateTask = createAppAsyncThunk(
  'tasks/updateTask',
  async (payload: { id: string; title: string; description: string }) => {
    const { id, ...changes } = payload
    const response = await client.patch<Task>(
      `${API_BASE}/fakeApi/tasks/${id}`,
      changes,
    )
    return response.data
  }
)
//---------------------------------State------------------------------

interface TasksState extends EntityState<Task, string> {
  fetchStatus: 'idle' | 'pending' | 'succeeded' | 'rejected'
  addStatus: 'idle' | 'pending' | 'succeeded' | 'rejected'
  deleteStatus: 'idle' | 'pending' | 'succeeded' | 'rejected'
  editStatus: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const tasksAdapter = createEntityAdapter<Task>({})

const initialState: TasksState = tasksAdapter.getInitialState({
  fetchStatus: 'idle',
  addStatus: 'idle',
  deleteStatus: 'idle',
  editStatus: 'idle',
  error: null,
})

//---------------------------------Slice------------------------------

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //---------------------Fetch-------------------
      .addCase(fetchTasks.pending, (state) => {
        state.fetchStatus = 'pending'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'
        tasksAdapter.setAll(state, action.payload)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.fetchStatus = 'rejected'
        state.error = action.error.message ?? 'Unknown Error'
      })

      //---------------------Add-------------------
      .addCase(addTask.pending, (state) => {
        state.addStatus = 'pending'
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.addStatus = 'succeeded'
        tasksAdapter.addOne(state, action.payload)
      })
      .addCase(addTask.rejected, (state, action) => {
        state.addStatus = 'rejected'
        state.error = action.error.message ?? 'Failed to add task'
      })

      //---------------------Delete-------------------
      .addCase(deleteTask.pending, (state) => {
        state.deleteStatus = 'pending'
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        tasksAdapter.removeOne(state, action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteStatus = 'rejected'
        state.error = action.error.message ?? 'Failed to delete task'
      })
      //---------------------Update-------------------
      .addCase(updateTask.pending, (state) => {
        state.editStatus = 'pending'
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.editStatus = 'succeeded'
        tasksAdapter.upsertOne(state, action.payload)   // 👈 upsertOne
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.editStatus = 'rejected'
        state.error = action.error.message ?? 'Failed to update task'
      })
  },

})

//---------------------------------Selectors------------------------------

export const selectFetchStatus = (state: RootState) => state.tasks.fetchStatus
export const selectAddStatus = (state: RootState) => state.tasks.addStatus
export const selectDeleteStatus = (state: RootState) => state.tasks.deleteStatus
export const selectEditStatus = (state: RootState) => state.tasks.editStatus

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectAllTaskIds,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks)

export default tasksSlice.reducer