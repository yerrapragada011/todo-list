import Project from './Project.js'
// import createTodo from './Todo'

// const LOCAL_STORAGE_PROJECT_KEY = 'todo.projects'
// const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'todo.selectedProjectId'
// let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || []
// let selectedProjectId = localStorage.getItem(
//   LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY
// )

const myProjects = []

const projects = document.getElementById('projects')

function displayProjects() {
  projects.innerHTML = ''
  myProjects.forEach((project, index) => {
    let projectElement = document.createElement('li')
    projectElement.classList.add('list')
    projectElement.textContent = project.title
    projects.appendChild(projectElement)
  })
}

const addProject = document.getElementById('addProject')

addProject.addEventListener('click', () => {
  let title = prompt('Enter project title: ')
  const newProject = new Project(title)
  myProjects.push(newProject)
  displayProjects()
})
