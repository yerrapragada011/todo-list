export default function Todo(title, complete = false) {
  this.id = Date.now().toString()
  this.title = title
  this.complete = complete
}
