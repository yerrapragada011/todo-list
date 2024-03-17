import moment from 'moment'
import Project from './Project.js'
import Todo from './Todo.js'

const addProject = document.getElementById('addProject')
const projectContainer = document.getElementById('projects')
const todoContainer = document.getElementById('todos')
const todoTemplate = document.getElementById('todo-template')
const newTodoContainer = document.getElementById('todo-input')
const newTodoInput = document.createElement('input')
const clearCompletedTodos = document.createElement('button')

const PROJECT_KEY = 'todo.projects'
const SELECTED_PROJECT_ID_KEY = 'todo.selectedProjectId'
const DEFAULT_PROJECT_TITLE = 'Project 1'
let projects = JSON.parse(localStorage.getItem(PROJECT_KEY)) || []
if (projects.length === 0) {
  const defaultProject = new Project(DEFAULT_PROJECT_TITLE)
  projects.push(defaultProject)
}
let selectedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY)

function render() {
  clearElement(projectContainer)
  renderProjects()

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  )

  if (selectedProjectId == null) {
    todoContainer.style.display = 'none'
    newTodoContainer.style.display = 'none'
  } else {
    clearElement(todoContainer)
    renderTodos(selectedProject)
  }
}

function renderTodos(selectedProject) {
  let todoInputField = newTodoContainer.querySelector('input')
  if (todoInputField == null) {
    newTodoInput.classList.add('addTodo')
    newTodoInput.placeholder = 'Add todo'
    clearCompletedTodos.textContent = 'Clear completed'
    newTodoContainer.appendChild(newTodoInput)
    newTodoContainer.appendChild(clearCompletedTodos)
  }

  clearElement(todoContainer)

  selectedProject.todos.forEach((todo) => {
    const todoElement = document.importNode(todoTemplate.content, true)
    const checkbox = todoElement.getElementById('complete-todo')
    const label = todoElement.getElementById('todo-label')
    checkbox.id = todo.id
    checkbox.checked = todo.complete
    label.htmlFor = todo.id
    const bulletSpan = document.createElement('span')
    bulletSpan.setAttribute('id', 'bullet-span')
    bulletSpan.textContent = '\u2022 '
    bulletSpan.style.color = getPriorityColor(todo.priority)
    label.prepend(bulletSpan)
    label.append(todo.title)
    todoContainer.appendChild(todoElement)
    const todoInfo = document.createElement('div')
    todoInfo.setAttribute('id', `todo-info-${todo.id}`)
    renderTodoInfo(todo, todoInfo)
    todoContainer.appendChild(todoInfo)
  })
}

function getPriorityColor(priority) {
  let priorityColor = ''
  switch (priority) {
    case 'low':
      priorityColor = 'blue'
      break
    case 'medium':
      priorityColor = 'orange'
      break
    case 'high':
      priorityColor = 'red'
      break
    default:
      priorityColor = ''
      break
  }
  return priorityColor
}

function renderTodoInfo(todo, todoInfo) {
  const paragraph = document.createElement('p')
  paragraph.setAttribute('id', 'todo-para')
  const prioritySpan = document.createElement('span')
  let textContent = ''

  if (todo.description) {
    textContent += `Description: ${todo.description}`
  }

  if (todo.dueDate) {
    if (textContent !== '') {
      textContent += ', '
    }
    const formattedDueDate = moment(todo.dueDate).format('MM-DD-yyyy')
    textContent += `Due Date: ${formattedDueDate}`
  }

  paragraph.textContent = textContent
  if (textContent !== '') {
    todoInfo.appendChild(paragraph)
  }
}

function editTodo(todo) {
  const todoInfo = document.getElementById(`todo-info-${todo.id}`)

  clearElement(todoInfo)

  const newDescriptionInput = document.createElement('input')
  newDescriptionInput.setAttribute('type', 'text')
  newDescriptionInput.placeholder = 'Enter new description'
  newDescriptionInput.value = todo.description ? todo.description : ''
  todoInfo.appendChild(newDescriptionInput)

  const newDueDateInput = document.createElement('input')
  newDueDateInput.setAttribute('type', 'date')
  newDueDateInput.placeholder = 'Enter new due date'
  newDueDateInput.value = todo.dueDate
  todoInfo.appendChild(newDueDateInput)

  const prioritySelect = document.createElement('select')
  prioritySelect.innerHTML = `
    <option value="" selected> - </option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  `
  prioritySelect.value = todo.priority
  todoInfo.appendChild(prioritySelect)

  const submitButton = document.createElement('button')
  submitButton.textContent = 'Submit'
  todoInfo.appendChild(submitButton)

  submitButton.addEventListener('click', () => {
    todo.dueDate = newDueDateInput.value
    todo.description = newDescriptionInput.value
    todo.priority = prioritySelect.value
    saveAndRender()
  })
}

function deleteTodo(todoId) {
  const selectedProjectIndex = projects.findIndex(
    (project) => project.id === selectedProjectId
  )
  const selectedProject = projects[selectedProjectIndex]
  selectedProject.todos = selectedProject.todos.filter(
    (todo) => todo.id !== todoId
  )
  saveAndRender()
}

function renderProjects() {
  projects.forEach((project, index) => {
    let projectElement = document.createElement('button')
    projectElement.setAttribute('type', 'button')
    projectElement.dataset.projectId = project.id
    projectElement.classList.add('list')
    projectElement.textContent = project.title
    if (project.id === selectedProjectId) {
      projectElement.classList.add('active-project')
    }
    let deleteButton = document.createElement('button')
    deleteButton.textContent = 'delete'
    deleteButton.addEventListener('click', () => {
      deleteProject(index)
    })
    projectElement.appendChild(deleteButton)
    projectContainer.appendChild(projectElement)
  })
}

function deleteProject(index) {
  selectedProjectId = null
  projects.splice(index, 1)
  saveAndRender()
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(projects))
  localStorage.setItem(SELECTED_PROJECT_ID_KEY, selectedProjectId)
}

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
