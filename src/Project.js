export default function createProject(title) {
  return {
    id: Date.now().toString(),
    title: title,
    todos: []
  }
}
