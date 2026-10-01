import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { factory, primaryKey, manyOf, oneOf } from '@mswjs/data'

/* ------------------ API Base ------------------ */

// در dev: '/'  →  '/fakeApi/tasks'
// در GitHub Pages: '/Task-Manager/'  →  '/Task-Manager/fakeApi/tasks'
const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/* ------------------ Data Model ------------------ */

export const db = factory({
  task: {
    id: primaryKey(String),
    title: String,
    description: String,
    todos: manyOf('todo'),
  },
  todo: {
    id: primaryKey(Number),
    title: String,
    items: manyOf('item'),
    task: oneOf('task'),
  },
  item: {
    id: primaryKey(Number),
    description: String,
    todo: oneOf('todo'),
  },
})

/* ------------------ Seed Data ------------------ */

const initialTasks = [
  {
    id: '111',
    title: 'task 1',
    description: 'description task 1',
    todos: [
      {
        id: 1,
        title: 'todo 1',
        items: [
          { id: 11, description: 'work 1' },
          { id: 12, description: 'work 2' },
        ],
      },
      {
        id: 2,
        title: 'todo 2',
        items: [
          { id: 22, description: 'work 3' },
          { id: 23, description: 'work 4' },
        ],
      },
    ],
  },
  {
    id: '222',
    title: 'task 2',
    description: 'description task 2',
    todos: [
      {
        id: 3,
        title: 'todo 1',
        items: [
          { id: 31, description: 'work 1' },
          { id: 32, description: 'work 2' },
        ],
      },
      {
        id: 4,
        title: 'todo 2',
        items: [
          { id: 33, description: 'work 3' },
          { id: 34, description: 'work 4' },
        ],
      },
    ],
  },
]

/* ------------------ Seed DB ------------------ */

function seedDB() {
  for (const taskData of initialTasks) {
    const task = db.task.create({
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
    })

    const todos: ReturnType<typeof db.todo.create>[] = []

    for (const todoData of taskData.todos) {
      const todo = db.todo.create({
        id: todoData.id,
        title: todoData.title,
        task,
      })

      const items: ReturnType<typeof db.item.create>[] = []

      for (const itemData of todoData.items) {
        const item = db.item.create({
          id: itemData.id,
          description: itemData.description,
          todo,
        })
        items.push(item)
      }

      // رابطه‌ی manyOf رو دستی پر کن
      db.todo.update({
        where: { id: { equals: todo.id } },
        data: { items },
      })

      todos.push(todo)
    }

    // رابطه‌ی manyOf رو دستی پر کن
    db.task.update({
      where: { id: { equals: task.id } },
      data: { todos },
    })
  }
}

seedDB()

/* ------------------ Helpers ------------------ */

const ARTIFICIAL_DELAY_MS = 500

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type TaskModel = ReturnType<typeof db.task.create>

const serializeTask = (task: TaskModel) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  todos: task.todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    items: todo.items.map((item) => ({
      id: item.id,
      description: item.description,
    })),
  })),
})

/* ------------------ Handlers ------------------ */

export const handlers = [
  // دریافت همه‌ی Task ها
  http.get(`${API_BASE}/fakeApi/tasks`, async () => {
    const tasks = db.task.getAll().map(serializeTask)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(tasks)
  }),

  // دریافت یک Task خاص
  // 👈 id الان string هست، پس Number() نمی‌کنیم
  http.get(`${API_BASE}/fakeApi/tasks/:taskId`, async ({ params }) => {
    const taskId = params.taskId as string
    const task = db.task.findFirst({ where: { id: { equals: taskId } } })
    if (!task) return new HttpResponse(null, { status: 404 })
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializeTask(task))
  }),

  // ساخت Task جدید
  http.post(`${API_BASE}/fakeApi/tasks`, async ({ request }) => {
    const data = (await request.json()) as {
      title: string
      description: string
    }

    // 👈 بزرگ‌ترین id رو با Number حساب کن، بعد string کن
    const allTasks = db.task.getAll()
    const maxId = allTasks.reduce(
      (max, t) => Math.max(max, Number(t.id)),
      0,
    )
    const newId = String(maxId + 1)

    const newTask = db.task.create({
      id: newId,
      title: data.title,
      description: data.description,
    })

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializeTask(newTask), { status: 201 })
  }),
]

/* ------------------ Server ------------------ */

export const worker = setupWorker(...handlers)