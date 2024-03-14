export default function Todo(
  title,
  description,
  dueDate,
  priority,
  complete = false
) {
  this.id = Date.now().toString()
  this.title = title
  this.description = description
  this.dueDate = dueDate
  this.priority = priority
  this.complete = complete
}
