import Project from './Project.js'
import Todo from './Todo.js'

const LOCAL_STORAGE_PROJECT_KEY = 'todo.myProjects'
// const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'todo.selectedProjectId'
let myProjects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || []
// let selectedProjectId = localStorage.getItem(
//   LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY
// )

const projectsContainer = document.getElementById('projects')
const todosContainer = document.getElementById('todos')
const inputTodo = document.getElementById('inputTodo')
const addProject = document.getElementById('addProject')

function displayProjects() {
  projectsContainer.innerHTML = ''
  myProjects.forEach((project, index) => {
    let projectElement = document.createElement('li')
    projectElement.classList.add('list')
    projectElement.textContent = project.title
    projectElement.addEventListener('click', () => {
      let inputTodoElement = document.createElement('input')
      inputTodoElement.setAttribute('id', 'inputTodo')
      todosContainer.appendChild(inputTodoElement)
    })
    let deleteButton = document.createElement('button')
    deleteButton.textContent = 'delete'
    deleteButton.addEventListener('click', () => {
      deleteProject(index)
    })
    projectElement.appendChild(deleteButton)
    projectsContainer.appendChild(projectElement)
  })
}

function deleteProject(index) {
  myProjects.splice(index, 1)
  displayProjects()
}

addProject.addEventListener('change', (e) => {
  let title = e.target.value
  const newProject = new Project(title)
  myProjects.push(newProject)
  e.target.value = null
  displayProjects()
})
if (inputTodo) {
  inputTodo.addEventListener('change', () => {
    console.log('test')
  })
}

// function displayTodos(projectIndex) {
//   todosContainer.innerHTML = ''
//   const selectedProject = myProjects[projectIndex]
//   selectedProject.todos.forEach((todo) => {
//     let todoElement = document.createElement('li')
//     todoElement.textContent = todo.title
//     todosContainer.appendChild(todoElement)
//   })
// }
