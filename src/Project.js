export default function Project(title) {
  this.id = Date.now().toString()
  this.title = title
  this.todos = [{ id: 'ssds', title: 'test1', complete: true }]
}
