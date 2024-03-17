import { selectedProjectId, projects, projectContainer } from '..'
import { saveAndRender } from './renderHandler'

export function renderProjects() {
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

export function deleteProject(index) {
  selectedProjectId = null
  projects.splice(index, 1)
  saveAndRender()
}
