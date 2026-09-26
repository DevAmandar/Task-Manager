export interface TodoItem {
  id: number
  description: string
}

export interface Todo {
  id: number
  title: string
  items: TodoItem[]
}