export default function Todo(
  title,
  description,
  dueDate,
  priority,
  notes,
  complete = false
) {
  this.id = Date.now().toString()
  this.title = title
  this.description = description
  this.dueDate = dueDate
  this.priority = priority
  this.notes = notes
  this.complete = complete
}
