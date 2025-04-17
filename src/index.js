/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import { format } from "date-fns";
import "./style.css";
import Delete from "./delete.svg";
import Check from "./check-circle-outline.svg";
import Excla from "./exclamation.svg";

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.getWeek = function () {
  const onejan = new Date(this.getFullYear(), 0, 1);
  const today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  const dayOfYear = (today - onejan + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
};

function Todo(title, dueDate, priority, description, project) {
  const completed = false;
  const expired = false;

  return {
    title,
    dueDate,
    description,
    priority,
    completed,
    expired,
    project,
  };
}

function TodoHolder() {
  const todoHolder = [];
  return { todoHolder };
}

function ProjectHolder() {
  const projectHolder = [];
  return { projectHolder };
}

function todoHolderUpdater(holder) {
  localStorage.setItem("storedValues", JSON.stringify(holder));
}

function projectHolderUpdater(holder) {
  localStorage.setItem("projectStoredValues", JSON.stringify(holder));
}

function isStoredValues() {
  if (localStorage.getItem("storedValues") == undefined) {
    return false;
  }
  return true;
}

function isStoredProjectValues() {
  // eslint-disable-next-line eqeqeq
  if (localStorage.getItem("projectStoredValues") == undefined) {
    return false;
  }
  return true;
}

function createStoredValues() {
  if (isStoredValues()) {
    return JSON.parse(localStorage.getItem("storedValues"));
  }
  const storedValues = TodoHolder();
  todoHolderUpdater(storedValues);
  return storedValues;
}

function createProjectStoredValues() {
  if (isStoredProjectValues()) {
    return JSON.parse(localStorage.getItem("projectStoredValues"));
  }
  const storedProjectValues = ProjectHolder();
  projectHolderUpdater(storedProjectValues);
  return storedProjectValues;
}

function addTodoButton() {
  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("buttonDiv");
  const button = document.createElement("button");
  button.classList.add("todoButton");
  button.textContent = "+";
  buttonDiv.appendChild(button);

  const contentScreen = document.getElementById("contentScreen");
  contentScreen.appendChild(buttonDiv);
}

function createTodoForm() {
  // form
  const todoForm = document.createElement("form");
  todoForm.id = "todoForm";
  // title
  const titreInputDiv = document.createElement("div");
  const titreLabel = document.createElement("label");
  titreLabel.textContent = "Title";
  titreLabel.setAttribute("for", "titreInput");
  const titreInput = document.createElement("input");
  titreInput.required = true;
  titreInput.setAttribute("name", "titreInput");
  titreInput.setAttribute("id", "titreInput");
  titreInput.setAttribute("placeholder", "ToDo Title");
  titreInputDiv.appendChild(titreLabel);
  titreInputDiv.appendChild(titreInput);
  // date
  const dateDiv = document.createElement("div");
  dateDiv.classList.add("dateDiv");
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Date";
  dateLabel.setAttribute("for", "dateInput");
  const dateInput = document.createElement("input");
  dateInput.required = true;
  dateInput.setAttribute("name", "dateInput");
  dateInput.setAttribute("id", "dateInput");
  dateInput.setAttribute("type", "date");
  dateDiv.appendChild(dateLabel);
  dateDiv.appendChild(dateInput);
  // description
  const descriptionDiv = document.createElement("div");
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description";
  descriptionLabel.setAttribute("for", "descriptionInput");
  const descriptionInput = document.createElement("textarea");
  descriptionInput.required = true;
  descriptionInput.setAttribute("name", "descriptionInput");
  descriptionInput.setAttribute("id", "descriptionInput");
  descriptionInput.setAttribute("placeholder", "ToDo Description...");
  descriptionDiv.appendChild(descriptionLabel);
  descriptionDiv.appendChild(descriptionInput);
  // priority
  const selectDiv = document.createElement("div");
  selectDiv.classList.add("priorityDiv");
  const selectLabel = document.createElement("label");
  selectLabel.textContent = "Priority";
  selectLabel.setAttribute("for", "selectInput");
  const selectInput = document.createElement("select");
  selectInput.setAttribute("name", "selectInput");
  selectInput.setAttribute("id", "selectInput");
  const low = document.createElement("option");
  low.textContent = "Low";
  low.setAttribute("value", "Low");
  const medium = document.createElement("option");
  medium.textContent = "Medium";
  medium.setAttribute("value", "Medium");
  const high = document.createElement("option");
  high.textContent = "High";
  high.setAttribute("value", "High");
  selectInput.appendChild(low);
  selectInput.appendChild(medium);
  selectInput.appendChild(high);
  selectDiv.appendChild(selectLabel);
  selectDiv.appendChild(selectInput);
  // form controller
  const formControllerDiv = document.createElement("div");
  formControllerDiv.classList.add("formController");
  const annulerButton = document.createElement("button");
  annulerButton.classList.add("annulerBoutton");
  annulerButton.textContent = "Cancel";
  const validerButton = document.createElement("button");
  validerButton.textContent = "Validate";
  validerButton.classList.add("validerBoutton");
  formControllerDiv.appendChild(annulerButton);
  formControllerDiv.appendChild(validerButton);
  // adding inputs to form
  todoForm.appendChild(titreInputDiv);
  todoForm.appendChild(dateDiv);
  todoForm.appendChild(descriptionDiv);
  todoForm.appendChild(selectDiv);
  todoForm.appendChild(formControllerDiv);
  return todoForm;
}

function todoButtonListener() {
  const todoButton = document.querySelector(".todoButton");
  todoButton.addEventListener("click", addTodoForm);
}

function cancelTodoAction(e) {
  e.preventDefault();
  const contentScreen = document.getElementById("contentScreen");
  const buttonDiv = document.querySelector(".buttonDiv");
  contentScreen.removeChild(buttonDiv);
  addTodoButton();
  todoButtonListener();
}

function validTodoAction(e) {
  e.preventDefault();
  // si le formulaire n'est pas valide remettre le listener return simple
  const todoForm = document.querySelector("#todoForm");
  if (!todoForm.checkValidity()) {
    todoForm.reportValidity();
    todoLister();
    return;
  }
  // récup les infos
  const title = document.querySelector("#titreInput").value;
  const date = document.querySelector("#dateInput").value;
  const description = document.querySelector("#descriptionInput").value;
  const priority = document.querySelector("#selectInput").value;
  // passer les infos au Todo Builder
  const todo = Todo(title, date, priority, description, projectTracker);
  // ajouter le todo buildé à app Holder, puis vérifier avec console log
  appHolder.todoHolder.push(todo);
  todoHolderUpdater(appHolder);
  // fermer le formulaire
  const contentScreen = document.getElementById("contentScreen");
  const buttonDiv = document.querySelector(".buttonDiv");
  contentScreen.removeChild(buttonDiv);
  // ajouter le nouveau todo
  const newTodo = todoDom(todo);
  contentScreen.appendChild(newTodo);
  // le bouton pour en ajouter encore
  addTodoButton();
  todoButtonListener();
  deleteTodoListener();
  checkTodoListener();
}

function todoLister() {
  const annulerButton = document.querySelector(".annulerBoutton");
  annulerButton.addEventListener("click", cancelTodoAction);
  const validerButton = document.querySelector(".validerBoutton");
  validerButton.addEventListener("click", validTodoAction);
}

function addTodoForm() {
  const buttonDiv = document.querySelector(".buttonDiv");
  buttonDiv.innerHTML = "";
  const form = createTodoForm();
  buttonDiv.appendChild(form);
  todoLister();
}

function addProjectButton() {
  const project = document.querySelector("#project");
  const projectButton = document.createElement("button");
  projectButton.id = "newProject";
  const projectButtonImage = document.createElement("img");
  projectButtonImage.setAttribute("src", "./a14b6ff2cd530e17fbc7.png");
  projectButtonImage.setAttribute("alt", "new project");
  projectButton.textContent = "New Project";
  projectButton.appendChild(projectButtonImage);
  project.appendChild(projectButton);
}

function createProjectForm() {
  // form
  const projectForm = document.createElement("form");
  // project Name
  const nameInputDiv = document.createElement("div");
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Project Name";
  nameLabel.setAttribute("for", "nameInput");
  const nameInput = document.createElement("input");
  nameInput.required = true;
  nameInput.setAttribute("name", "nameInput");
  nameInput.setAttribute("id", "nameInput");
  nameInput.setAttribute("placeholder", "Project Name");
  nameInputDiv.appendChild(nameLabel);
  nameInputDiv.appendChild(nameInput);
  // form controller
  const formControllerDiv = document.createElement("div");
  formControllerDiv.classList.add("formProjectController");
  const annulerButton = document.createElement("button");
  annulerButton.classList.add("annulerProjetBoutton");
  annulerButton.textContent = "Cancel";
  const validerButton = document.createElement("button");
  validerButton.textContent = "Validate";
  validerButton.classList.add("validerProjetBoutton");
  formControllerDiv.appendChild(annulerButton);
  formControllerDiv.appendChild(validerButton);
  // adding inputs to form
  projectForm.appendChild(nameInputDiv);
  projectForm.appendChild(formControllerDiv);
  return projectForm;
}

function projectButtonListener() {
  const projectButton = document.querySelector("#newProject");
  projectButton.addEventListener("click", addProjectForm);
}

function cancelProjectAction(e) {
  e.preventDefault();
  const project = document.querySelector("#project");
  const form = document.querySelector("#project form");
  project.removeChild(form);
  addProjectButton();
  projectButtonListener();
}

function validProjectAction(e) {
  e.preventDefault();
  const project = document.querySelector("#project");
  const form = document.querySelector("#project form");
  const projectList = document.querySelector("#projectList");
  const newProjectName = document.querySelector("#nameInput");
  const newProjectItem = document.createElement("li");

  if (!form.checkValidity()) {
    form.reportValidity();
    projectLister();
    return;
  }

  newProjectItem.textContent = newProjectName.value;
  projectListHolder.projectHolder.push(newProjectName.value);
  projectHolderUpdater(projectListHolder);
  projectList.appendChild(newProjectItem);
  project.removeChild(form);
  addProjectButton();
  projectButtonListener();

  selectedListenerMenu();
  selectedListenerProject();
}

function projectLister() {
  const annulerButton = document.querySelector(
    "#project .annulerProjetBoutton"
  );
  annulerButton.addEventListener("click", cancelProjectAction);
  const validerButton = document.querySelector(".validerProjetBoutton");
  validerButton.addEventListener("click", validProjectAction);
}

function addProjectForm() {
  const project = document.querySelector("#project");
  const buttonProject = document.querySelector("#newProject");
  project.removeChild(buttonProject);
  const form = createProjectForm();
  project.appendChild(form);
  projectLister();
  projectLister();
}

function projectRenderer() {
  const projectList = document.querySelector("#projectList");
  for (let i = 0; i < projectListHolder.projectHolder.length; i++) {
    const newProjectItem = document.createElement("li");
    newProjectItem.textContent = projectListHolder.projectHolder[i];
    projectList.appendChild(newProjectItem);
  }
}

function projectNameListener() {
  const projectsItems = document.querySelectorAll("#projectList li");
  if (projectsItems.length == 0) {
    return;
  }
  projectsItems.forEach((elem) =>
    elem.addEventListener("click", changeProjectTracker)
  );
}

function changeProjectTracker() {
  projectTracker = this.textContent;
}

function homeProjectTracker() {
  projectTracker = "Home";
}

function HomeTrackListener() {
  const homeItems = document.querySelectorAll("#homeElements li");
  homeItems.forEach((elem) =>
    elem.addEventListener("click", homeProjectTracker)
  );
}

function todoDisplayerWelcome() {
  emptyScreen();
  appHolder.todoHolder.forEach((elem) =>
    addTodoToScreen(elem, appHolder.todoHolder.indexOf(elem))
  );
  addTodoButton();
  todoButtonListener();
  deleteTodoListener();
  checkTodoListener();
}

function todoDisplayer() {
  emptyScreen();
  if (this.textContent == "Home") {
    todoDisplayerWelcome();
  } else if (this.textContent == "Today") {
    const filterTodayHolder = filterTodoToday();
    filterTodayHolder.forEach((elem) =>
      addTodoToScreen(elem, filterTodayHolder.indexOf(elem))
    );
    deleteTodoListener();
    checkTodoListener();
  } else if (this.textContent == "Week") {
    const filterWeekHolder = filterTodoWeek();
    filterWeekHolder.forEach((elem) =>
      addTodoToScreen(elem, filterWeekHolder.indexOf(elem))
    );
    deleteTodoListener();
    checkTodoListener();
  } else {
    const filterHolder = filterTodoOnProject(this.textContent);
    filterHolder.forEach((elem) =>
      addTodoToScreen(elem, filterHolder.indexOf(elem))
    );
    addTodoButton();
    todoButtonListener();
    deleteTodoListener();
    checkTodoListener();
  }
}

function todoDom(todo, todoIndex) {
  const todoDomCard = document.createElement("div");
  todoDomCard.classList.add("todoCard");
  todoDomCard.dataset.index = todoIndex;
  if (todo.completed == true) {
    todoDomCard.classList.add("completed");
  }

  const todoTitle = document.createElement("h3");
  todoTitle.textContent = todo.title;

  const todoPrioDate = document.createElement("div");
  todoPrioDate.classList.add("todoPrioDate");

  const prioDiv = document.createElement("div");
  prioDiv.classList.add("prioDiv");

  const prioImg = document.createElement("img");
  prioImg.src = Excla;
  prioImg.alt = "priority";

  const todoPriority = document.createElement("p");
  todoPriority.textContent = todo.priority;
  todoPriority.classList.add("priority");

  if (todo.priority == "Low") {
    prioDiv.classList.add("low");
  }

  if (todo.priority == "Medium") {
    prioDiv.classList.add("medium");
  }

  if (todo.priority == "High") {
    prioDiv.classList.add("high");
  }

  prioDiv.appendChild(prioImg);
  prioDiv.appendChild(todoPriority);

  const todoDate = document.createElement("p");
  todoDate.textContent = todo.dueDate;
  todoDate.classList.add("dueDate");

  todoPrioDate.appendChild(prioDiv);
  todoPrioDate.appendChild(todoDate);
  todoPrioDate.classList.add("todoPrioDate");

  const todoDescription = document.createElement("p");
  todoDescription.textContent = todo.description;
  todoDescription.classList.add("todoDescription");

  const todoIconHolder = document.createElement("div");
  todoIconHolder.classList.add("iconHolder");
  const trash = document.createElement("img");
  trash.classList.add("todoDelete");
  trash.src = Delete;
  trash.alt = "delete";
  const check = document.createElement("img");
  check.classList.add("todoValidate");
  check.src = Check;
  check.alt = "complete Todo";
  todoIconHolder.appendChild(trash);
  todoIconHolder.appendChild(check);

  todoDomCard.appendChild(todoTitle);
  todoDomCard.appendChild(todoPrioDate);
  todoDomCard.appendChild(todoDescription);
  todoDomCard.appendChild(todoIconHolder);

  return todoDomCard;
}

function addTodoToScreen(todo, todoIndex) {
  const screen = document.querySelector("#contentScreen");
  screen.appendChild(todoDom(todo, todoIndex));
}

function toggleSelectedClass() {
  const oldSelected = document.querySelector(".selected");
  oldSelected.classList.remove("selected");
  this.classList.add("selected");
}

function selectedListenerMenu() {
  const elements = document.querySelectorAll("#homeElements li");
  elements.forEach((element) =>
    element.addEventListener("click", toggleSelectedClass)
  );
}

function selectedListenerProject() {
  const elements = document.querySelectorAll("#projectList li");
  elements.forEach((element) =>
    element.addEventListener("click", toggleSelectedClass)
  );
}

function deleteTodo(index) {
  appHolder.todoHolder.splice(index, 1);
  todoHolderUpdater(appHolder);
}

function deleteTodoDom(index, card) {
  const contentScreen = document.querySelector("#contentScreen");
  contentScreen.removeChild(card);
}

function todoDeleter() {
  const indexOfElem = this.parentElement.parentElement.dataset.index;
  const card = this.parentElement.parentElement;
  deleteTodo(indexOfElem);
  deleteTodoDom(indexOfElem, card);
  deleteTodoListener();
}

function deleteTodoListener() {
  const deleteButtons = document.querySelectorAll(".todoDelete");
  deleteButtons.forEach((elem) => elem.addEventListener("click", todoDeleter));
}

function checkTodoListener() {
  const deleteButtons = document.querySelectorAll(".todoValidate");
  deleteButtons.forEach((elem) =>
    elem.addEventListener("click", todoValidator)
  );
}

function completeTodo(index) {
  appHolder.todoHolder[index].completed = true;
  todoHolderUpdater(appHolder);
}

function todoValidator() {
  this.parentElement.parentElement.classList.add("completed");
  const indexOfElem = this.parentElement.parentElement.dataset.index;
  completeTodo(indexOfElem);
}

function emptyScreen() {
  const contentScreen = document.querySelector("#contentScreen");
  contentScreen.innerHTML = "";
}

function filterTodoOnProject(projectName) {
  const todosProject = appHolder.todoHolder.filter(
    (todo) => todo.project == projectName
  );
  return todosProject;
}

function filterTodoToday() {
  const date = new Date();
  const result = format(date, "yyyy-MM-dd");
  const todosProject = appHolder.todoHolder.filter(
    (todo) => todo.dueDate == result
  );
  return todosProject;
}

function weekFilter(todo, week) {
  return new Date(todo.dueDate).getWeek() == week;
}

function filterTodoWeek() {
  const date = new Date();
  const week = date.getWeek();
  const todosProject = appHolder.todoHolder.filter((todo) =>
    weekFilter(todo, week)
  );
  return todosProject;
}

function menuLister() {
  const homeItems = document.querySelectorAll("#homeElements li");
  homeItems.forEach((elem) => elem.addEventListener("click", todoDisplayer));
}

function projectsListener() {
  const projectItems = document.querySelectorAll("#projectList li");
  projectItems.forEach((elem) => elem.addEventListener("click", todoDisplayer));
}

// Maintenant il faut penser au flow de l'application
// Premièrement définir le todoHolder et le projetHolder et les afficher
let projectTracker = "Home";
const appHolder = createStoredValues();
const projectListHolder = createProjectStoredValues();
// Ensuite afficher les todos de la page Home
HomeTrackListener();
projectRenderer();
projectButtonListener();
projectNameListener();
selectedListenerMenu();
selectedListenerProject();
// todoDisplayer();
// Pour la page Home Afficher tous les todos du projet Home donc il faudra que je modifie la fonction afficher todo pour prendre en compte le nom du projet pour filtrer
// Faire en sorte que quand on clique sur un des boutons du menu ce qui s'affiche soit modifié selon l'état du projet Holder
menuLister();
projectsListener();
todoDisplayerWelcome();
checkTodoListener();
