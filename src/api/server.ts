import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/native'
import { factory, primaryKey, manyOf, oneOf } from '@mswjs/data'

/* ------------------ Data Model ------------------ */

export const db = factory({
  todo: {
    id: primaryKey(Number),
    title: String,
    items: manyOf('item'),
  },
  item: {
    id: primaryKey(Number),
    description: String,
    todo: oneOf('todo'),
  },
})

/* ------------------ Seed Data ------------------ */

let todoIdCounter = 1
let itemIdCounter = 11

const todo1 = db.todo.create({ id: todoIdCounter++, title: 'Todo' })
db.item.create({ id: itemIdCounter++, description: 'work 1', todo: todo1 })
db.item.create({ id: itemIdCounter++, description: 'work 2', todo: todo1 })

const todo2 = db.todo.create({ id: todoIdCounter++, title: 'Todo 2' })
db.item.create({ id: itemIdCounter++, description: 'work 3', todo: todo2 })
db.item.create({ id: itemIdCounter++, description: 'work 4', todo: todo2 })

/* ------------------ Helpers ------------------ */

const ARTIFICIAL_DELAY_MS = 500

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type TodoModel = ReturnType<typeof db.todo.create>

const serializeTodo = (todo: TodoModel) => ({
  id: todo.id,
  title: todo.title,
  items: todo.items.map((item) => ({
    id: item.id,
    description: item.description,
  })),
})

/* ------------------ Handlers ------------------ */

export const handlers = [
  http.get('/fakeApi/todos', async () => {
    const todos = db.todo.getAll().map(serializeTodo)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(todos)
  }),

  http.get('/fakeApi/todos/:todoId', async ({ params }) => {
    const todoId = Number(params.todoId)
    const todo = db.todo.findFirst({ where: { id: { equals: todoId } } })
    if (!todo) return new HttpResponse(null, { status: 404 })
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializeTodo(todo))
  }),

  http.post('/fakeApi/todos', async ({ request }) => {
    const data = (await request.json()) as {
      title: string
      items?: { description: string }[]
    }

    const newTodo = db.todo.create({
      id: todoIdCounter++,
      title: data.title,
    })

    // فقط آیتم‌ها رو create کن؛ رابطه‌ی manyOf خودکار پر میشه
    for (const item of data.items ?? []) {
      db.item.create({
        id: itemIdCounter++,
        description: item.description,
        todo: newTodo,
      })
    }

    // از DB دوباره بخون تا items تازه پر شده رو بگیری
    const saved = db.todo.findFirst({
      where: { id: { equals: newTodo.id } },
    })!

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializeTodo(saved), { status: 201 })
  }),

  http.post('/fakeApi/todos/:todoId/items', async ({ request, params }) => {
    const todoId = Number(params.todoId)
    const data = (await request.json()) as { description: string }

    const todo = db.todo.findFirst({ where: { id: { equals: todoId } } })
    if (!todo) return new HttpResponse(null, { status: 404 })

    db.item.create({
      id: itemIdCounter++,
      description: data.description,
      todo,
    })

    const updated = db.todo.findFirst({
      where: { id: { equals: todoId } },
    })!

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializeTodo(updated), { status: 201 })
  }),
]

/* ------------------ Server ------------------ */

export const worker = setupServer(...handlers)