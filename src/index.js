import Project from './Project.js'
import Todo from './Todo.js'

const addProject = document.getElementById('addProject')
const addProjectForm = document.getElementById('addProjectForm')
const projectContainer = document.getElementById('projects')
const todoForm = document.getElementById('todoForm')

const LOCAL_STORAGE_PROJECT_KEY = 'todo.projects'
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || []

function render() {
  clearElement(projectContainer)
  projects.forEach((project, index) => {
    let projectElement = document.createElement('li')
    projectElement.dataset.projectId = project.id
    projectElement.classList.add('list')
    projectElement.textContent = project.title
    projectContainer.appendChild(projectElement)
  })
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
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects))
}

addProjectForm.addEventListener('change', (e) => {
  e.preventDefault()
  let title = e.target.value
  if (title == null || title === '') return
  const newProject = new Project(title)
  projects.push(newProject)
  e.target.value = null
  saveAndRender()
})

render()
