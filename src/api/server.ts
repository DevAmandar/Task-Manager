import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { factory, primaryKey, manyOf, oneOf } from '@mswjs/data'

/* ------------------ Data Model ------------------ */

export const db = factory({
  task: {
    id: primaryKey(Number),
    title: String,
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

/* ------------------ Seed Data (از JSON ثابت) ------------------ */

const initialTasks = [
  {
    id: 14,
    title: 'task 1',
    todos: [
      {
        id: 5711,
        title: 'todo 1',
        items: [
          { id: 117571, description: 'work 1' },
          { id: 1175711, description: 'work 2' },
        ],
      },
      {
        id: 111157571,
        title: 'todo 2',
        items: [
          { id: 111571111, description: 'work 3' },
          { id: 1111571111, description: 'work 4' },
        ],
      },
    ],
  },
  {
    id: 57775,
    title: 'task 2',
    todos: [
      {
        id: 22575,
        title: 'todo 1',
        items: [
          { id: 117572, description: 'work 1' },
          { id: 1757522, description: 'work 2' },
        ],
      },
      {
        id: 275753,
        title: 'todo 2',
        items: [
          { id: 237552, description: 'work 3' },
          { id: 375723, description: 'work 4' },
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

      // 👇 رابطه‌ی manyOf رو دستی پر کن
      db.todo.update({
        where: { id: { equals: todo.id } },
        data: { items },
      })

      todos.push(todo)
    }

    // 👇 رابطه‌ی manyOf رو دستی پر کن
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
  http.get('/fakeApi/tasks', async () => {
    const tasks = db.task.getAll().map(serializeTask)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(tasks)
  }),

  // دریافت یک Task خاص
  http.get('/fakeApi/tasks/:taskId', async ({ params }) => {
    const taskId = Number(params.taskId)
    const task = db.task.findFirst({ where: { id: { equals: taskId } } })
    if (!task) return new HttpResponse(null, { status: 404 })
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializeTask(task))
  }),
]

/* ------------------ Server ------------------ */

export const worker = setupWorker(...handlers)