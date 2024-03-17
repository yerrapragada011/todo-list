import moment from 'moment'

import { clearElement, saveAndRender } from './renderHandler'
import {
  selectedProjectId,
  newTodoInput,
  newTodoContainer,
  todoContainer,
  clearCompletedTodos,
  projects
} from '..'

const todoTemplate = document.getElementById('todo-template')

export function renderTodos(selectedProject) {
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

export function editTodo(todo) {
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

export function deleteTodo(todoId) {
  const selectedProjectIndex = projects.findIndex(
    (project) => project.id === selectedProjectId
  )
  const selectedProject = projects[selectedProjectIndex]
  selectedProject.todos = selectedProject.todos.filter(
    (todo) => todo.id !== todoId
  )
  saveAndRender()
}
