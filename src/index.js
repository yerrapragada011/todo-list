import Project from './Project.js'
import Todo from './Todo.js'

const addProject = document.getElementById('addProject')
const projectContainer = document.getElementById('projects')
const todoContainer = document.getElementById('todos')
const projectTitle = document.getElementById('project-title')
const todoTemplate = document.getElementById('todo-template')
const newTodoContainer = document.getElementById('todo-input')
const newTodoInput = document.createElement('input')
const clearCompletedTodos = document.createElement('button')

const PROJECT_KEY = 'todo.projects'
const SELECTED_PROJECT_ID_KEY = 'todo.selectedProjectId'
let projects = JSON.parse(localStorage.getItem(PROJECT_KEY)) || []
let selectedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY)

function render() {
  clearElement(projectContainer)
  renderProjects()

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  )

  if (selectedProjectId == null) {
    todoContainer.style.display = 'none'
  } else {
    clearElement(todoContainer)
    renderTodos(selectedProject)
  }
}

function renderTodos(selectedProject) {
  projectTitle.innerHTML = selectedProject.title
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
    label.append(todo.title)
    todoContainer.appendChild(todoElement)
    const todoInfo = document.createElement('div')
    label.addEventListener('click', () => {
      if (!todoInfo) {
        renderTodoInfo(todo, todoInfo)
      }
    })
    if (!todo.description && !todo.dueDate) {
      renderTodoInfo(todo, todoInfo)
    } else {
      const paragraph = document.createElement('p')
      paragraph.textContent = `Description: ${todo.description}, Due Date: ${todo.dueDate}`
      todoInfo.appendChild(paragraph)
    }
    todoContainer.appendChild(todoInfo)
  })
}

function renderTodoInfo(todo, todoInfo) {
  clearElement(todoInfo)

  const descriptionInput = document.createElement('input')
  descriptionInput.type = 'text'
  descriptionInput.placeholder = 'Description'

  const dueDateInput = document.createElement('input')
  dueDateInput.type = 'date'

  const submitButton = document.createElement('button')
  submitButton.setAttribute('type', 'button')
  submitButton.textContent = 'Submit'
  submitButton.addEventListener('click', () => {
    const description = descriptionInput.value
    const dueDate = dueDateInput.value

    // Update Todo object with new description and dueDate
    todo.description = description
    todo.dueDate = dueDate

    // Hide inputs
    descriptionInput.style.display = 'none'
    dueDateInput.style.display = 'none'
    submitButton.style.display = 'none'

    // Display paragraph with description and due date
    const paragraph = document.createElement('p')
    paragraph.textContent = `Description: ${description}, Due Date: ${dueDate}`
    todoInfo.appendChild(paragraph)

    // Display edit button
    const editButton = document.createElement('button')
    editButton.setAttribute('type', 'button')
    editButton.textContent = 'Edit'
    editButton.addEventListener('click', () => {
      descriptionInput.style.display =
        descriptionInput.style.display === 'none' ? '' : 'none'
      dueDateInput.style.display =
        dueDateInput.style.display === 'none' ? '' : 'none'
      submitButton.style.display =
        submitButton.style.display === 'none' ? '' : 'none'
      paragraph.style.display =
        paragraph.style.display === 'none' ? 'block' : 'none'
      editButton.style.display = 'none'
    })
    todoInfo.appendChild(editButton)
  })

  todoInfo.appendChild(descriptionInput)
  todoInfo.appendChild(dueDateInput)
  todoInfo.appendChild(submitButton)
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
  projectTitle.innerHTML = ''
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

render()
