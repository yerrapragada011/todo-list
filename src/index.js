import Project from './Project.js'
import Todo from './Todo.js'

import { render, save, saveAndRender } from './handler/renderHandler.js'
import { editTodo, deleteTodo } from './handler/todoHandler.js'

const addProject = document.getElementById('addProject')
export const projectContainer = document.getElementById('projects')
export const todoContainer = document.getElementById('todos')
export const newTodoContainer = document.getElementById('todo-input')
export const newTodoInput = document.createElement('input')
export const clearCompletedTodos = document.createElement('button')

export const PROJECT_KEY = 'todo.projects'
export const SELECTED_PROJECT_ID_KEY = 'todo.selectedProjectId'
const DEFAULT_PROJECT_TITLE = 'Project 1'

export let projects = JSON.parse(localStorage.getItem(PROJECT_KEY)) || []
if (projects.length === 0) {
  const defaultProject = new Project(DEFAULT_PROJECT_TITLE)
  projects.push(defaultProject)
}
export let selectedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY)

projectContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    newTodoContainer.style.display = ''
    selectedProjectId = e.target.dataset.projectId
    if (selectedProjectId) {
      todoContainer.style.display = ''
    }
    saveAndRender()
  } else {
    newTodoContainer.style.display = 'none'
  }
})

todoContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    )
    const selectedTodo = selectedProject.todos.find(
      (todo) => todo.id === e.target.id
    )
    if (!selectedTodo) return
    selectedTodo.complete = e.target.checked
    save()
  }
})

todoContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-todo')) {
    const todoId = e.target.parentElement.querySelector('input').id
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    )
    const selectedTodo = selectedProject.todos.find(
      (todo) => todo.id === todoId
    )
    editTodo(selectedTodo)
  }
})

todoContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-todo')) {
    const todoId = e.target.parentElement.querySelector('input').id
    deleteTodo(todoId)
  }
})

clearCompletedTodos.addEventListener('click', (e) => {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  )
  selectedProject.todos = selectedProject.todos.filter((todo) => !todo.complete)
  saveAndRender()
})

addProject.addEventListener('change', (e) => {
  e.preventDefault()
  let title = e.target.value
  if (title == null || title === '') return
  const newProject = new Project(title)
  projects.push(newProject)
  e.target.value = null
  saveAndRender()
})

newTodoInput.addEventListener('change', (e) => {
  e.preventDefault()
  let title = e.target.value
  if (title == null || title === '') return
  const newTodo = new Todo(title)
  e.target.value = null
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  )
  selectedProject.todos.push(newTodo)
  saveAndRender()
})

const defaultProject = projects.find(
  (project) => project.title === DEFAULT_PROJECT_TITLE
)

selectedProjectId = defaultProject.id

render()
