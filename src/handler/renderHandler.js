import { renderTodos } from './todoHandler'
import { renderProjects } from './projectHandler'
import {
  selectedProjectId,
  projects,
  PROJECT_KEY,
  SELECTED_PROJECT_ID_KEY
} from '..'

import { projectContainer, todoContainer, newTodoContainer } from '..'

export function render() {
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

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

export function saveAndRender() {
  save()
  render()
}

export function save() {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(projects))
  localStorage.setItem(SELECTED_PROJECT_ID_KEY, selectedProjectId)
}
