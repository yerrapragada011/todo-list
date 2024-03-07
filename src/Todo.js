export default function createTodo(title, description, dueDate, notes) {
  return {
    id: Date.now().toString(),
    title: title,
    description: description,
    dueDate: dueDate,
    notes: notes,
    complete: false
  }
}
