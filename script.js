// =========================================
// SELECT HTML ELEMENTS
// =========================================

const taskForm =
    document.getElementById("task-form");

const taskTitle =
    document.getElementById("task-title");

const taskDescription =
    document.getElementById("task-description");

const taskCategory =
    document.getElementById("task-category");

const taskPriority =
    document.getElementById("task-priority");

const taskDate =
    document.getElementById("task-date");


const taskList =
    document.getElementById("task-list");

const emptyState =
    document.getElementById("empty-state");


const totalTasks =
    document.getElementById("total-tasks");

const pendingTasks =
    document.getElementById("pending-tasks");

const completedTasks =
    document.getElementById("completed-tasks");

const progressPercent =
    document.getElementById("progress-percent");

const progressFill =
    document.getElementById("progress-fill");


const searchInput =
    document.getElementById("search-input");

const statusFilter =
    document.getElementById("status-filter");

const priorityFilter =
    document.getElementById("priority-filter");


const submitBtn =
    document.getElementById("submit-btn");

const cancelEditBtn =
    document.getElementById("cancel-edit");


const pageTitle =
    document.getElementById("page-title");

const taskListTitle =
    document.getElementById("task-list-title");

const currentDate =
    document.getElementById("current-date");


const themeToggle =
    document.getElementById("theme-toggle");


const navLinks =
    document.querySelectorAll(".nav-link");


// =========================================
// APPLICATION DATA
// =========================================

let tasks =
    JSON.parse(
        localStorage.getItem("taskflow-tasks")
    ) || [];


let editingTaskId = null;

let currentView = "all";


// =========================================
// SAVE TASKS
// =========================================

function saveTasks() {

    localStorage.setItem(
        "taskflow-tasks",
        JSON.stringify(tasks)
    );

}


// =========================================
// CURRENT DATE
// =========================================

const today = new Date();


currentDate.textContent =
    today.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );


// =========================================
// ADD OR UPDATE TASK
// =========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            taskTitle.value.trim();


        if (!title) {

            alert(
                "Please enter a task title."
            );

            return;
        }


        const taskData = {

            title: title,

            description:
                taskDescription.value.trim(),

            category:
                taskCategory.value,

            priority:
                taskPriority.value,

            dueDate:
                taskDate.value

        };


        // UPDATE TASK

        if (editingTaskId !== null) {

            tasks =
                tasks.map(
                    function (task) {

                        if (
                            task.id ===
                            editingTaskId
                        ) {

                            return {
                                ...task,
                                ...taskData
                            };

                        }


                        return task;

                    }
                );

        }


        // CREATE NEW TASK

        else {

            const newTask = {

                id: crypto.randomUUID(),

                ...taskData,

                completed: false,

                createdAt:
                    new Date().toISOString()

            };


            tasks.unshift(newTask);

        }


        saveTasks();

        resetForm();

        renderApp();

    }
);


// =========================================
// RESET FORM
// =========================================

function resetForm() {

    taskForm.reset();

    editingTaskId = null;


    submitBtn.textContent =
        "+ Add Task";


    cancelEditBtn.classList.add(
        "hidden"
    );

}


// =========================================
// EDIT TASK
// =========================================

function editTask(id) {

    const task =
        tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {
        return;
    }


    editingTaskId = id;


    taskTitle.value =
        task.title;


    taskDescription.value =
        task.description;


    taskCategory.value =
        task.category;


    taskPriority.value =
        task.priority;


    taskDate.value =
        task.dueDate;


    submitBtn.textContent =
        "Update Task";


    cancelEditBtn.classList.remove(
        "hidden"
    );


    taskForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    taskTitle.focus();

}


// =========================================
// CANCEL EDIT
// =========================================

cancelEditBtn.addEventListener(
    "click",
    resetForm
);


// =========================================
// DELETE TASK
// =========================================

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(
            function (task) {

                return task.id !== id;

            }
        );


    if (editingTaskId === id) {

        resetForm();

    }


    saveTasks();

    renderApp();

}


// =========================================
// COMPLETE / UNCOMPLETE TASK
// =========================================

function toggleTask(id) {

    tasks =
        tasks.map(
            function (task) {

                if (task.id === id) {

                    return {

                        ...task,

                        completed:
                            !task.completed

                    };

                }


                return task;

            }
        );


    saveTasks();

    renderApp();

}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateString) {

    if (!dateString) {

        return "No due date";

    }


    const [
        year,
        month,
        day
    ] =
        dateString
            .split("-")
            .map(Number);


    const date =
        new Date(
            year,
            month - 1,
            day
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =========================================
// CHECK OVERDUE
// =========================================

function isOverdue(task) {

    if (
        !task.dueDate ||
        task.completed
    ) {

        return false;

    }


    const now = new Date();


    const todayString = [

        now.getFullYear(),

        String(
            now.getMonth() + 1
        ).padStart(2, "0"),

        String(
            now.getDate()
        ).padStart(2, "0")

    ].join("-");


    return task.dueDate <
        todayString;

}


// =========================================
// CREATE TASK CARD
// =========================================

function createTaskCard(task) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "task-card";


    if (task.completed) {

        card.classList.add(
            "completed"
        );

    }


    // MAIN

    const main =
        document.createElement(
            "div"
        );


    main.className =
        "task-main";


    // CHECKBOX

    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.className =
        "task-checkbox";


    checkbox.checked =
        task.completed;


    checkbox.setAttribute(
        "aria-label",
        `Mark ${task.title} as completed`
    );


    checkbox.addEventListener(
        "change",
        function () {

            toggleTask(task.id);

        }
    );


    // INFORMATION

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "task-info";


    // TITLE

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        task.title;


    // DESCRIPTION

    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        task.description ||
        "No description provided";


    // META

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "task-meta";


    // CATEGORY

    const category =
        document.createElement(
            "span"
        );


    category.className =
        "task-tag category-tag";


    category.textContent =
        task.category;


    // PRIORITY

    const priority =
        document.createElement(
            "span"
        );


    priority.className =
        `task-tag priority-${task.priority.toLowerCase()}`;


    priority.textContent =
        task.priority;


    // DATE

    const date =
        document.createElement(
            "span"
        );


    date.className =
        "task-date";


    date.textContent =
        formatDate(
            task.dueDate
        );


    if (isOverdue(task)) {

        date.classList.add(
            "overdue"
        );


        date.textContent +=
            " · Overdue";

    }


    // APPEND META

    meta.append(
        category,
        priority,
        date
    );


    // APPEND INFO

    info.append(
        title,
        description,
        meta
    );


    // APPEND MAIN

    main.append(
        checkbox,
        info
    );


    // =================================
    // ACTION BUTTONS
    // =================================

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "task-actions";


    // EDIT

    const editButton =
        document.createElement(
            "button"
        );


    editButton.className =
        "action-btn";


    editButton.type =
        "button";


    editButton.textContent =
        "✎";


    editButton.title =
        "Edit task";


    editButton.setAttribute(
        "aria-label",
        `Edit ${task.title}`
    );


    editButton.addEventListener(
        "click",
        function () {

            editTask(task.id);

        }
    );


    // DELETE

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "action-btn delete";


    deleteButton.type =
        "button";


    deleteButton.textContent =
        "✕";


    deleteButton.title =
        "Delete task";


    deleteButton.setAttribute(
        "aria-label",
        `Delete ${task.title}`
    );


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(task.id);

        }
    );


    // APPEND ACTIONS

    actions.append(
        editButton,
        deleteButton
    );


    // FINAL CARD

    card.append(
        main,
        actions
    );


    return card;

}


// =========================================
// FILTER TASKS
// =========================================

function getFilteredTasks() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const selectedPriority =
        priorityFilter.value;


    const now =
        new Date();


    const todayString = [

        now.getFullYear(),

        String(
            now.getMonth() + 1
        ).padStart(2, "0"),

        String(
            now.getDate()
        ).padStart(2, "0")

    ].join("-");


    return tasks.filter(
        function (task) {


            // SEARCH

            const matchesSearch =

                task.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                task.description
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                task.category
                    .toLowerCase()
                    .includes(searchTerm);


            // STATUS

            const matchesStatus =

                selectedStatus === "all"

                ||

                (
                    selectedStatus ===
                    "completed"

                    &&
                    task.completed
                )

                ||

                (
                    selectedStatus ===
                    "pending"

                    &&
                    !task.completed
                );


            // PRIORITY

            const matchesPriority =

                selectedPriority === "all"

                ||

                task.priority ===
                selectedPriority;


            // SIDEBAR VIEW

            let matchesView = true;


            if (
                currentView ===
                "today"
            ) {

                matchesView =
                    task.dueDate ===
                    todayString;

            }


            if (
                currentView ===
                "upcoming"
            ) {

                matchesView =
                    task.dueDate >
                    todayString

                    &&
                    !task.completed;

            }


            if (
                currentView ===
                "completed"
            ) {

                matchesView =
                    task.completed;

            }


            return (

                matchesSearch

                &&

                matchesStatus

                &&

                matchesPriority

                &&

                matchesView

            );

        }
    );

}


// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();


    taskList.replaceChildren();


    if (
        filteredTasks.length === 0
    ) {

        emptyState.style.display =
            "block";

    }

    else {

        emptyState.style.display =
            "none";


        filteredTasks.forEach(
            function (task) {

                const card =
                    createTaskCard(task);


                taskList.appendChild(
                    card
                );

            }
        );

    }

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    const progress =
        total === 0

            ? 0

            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    totalTasks.textContent =
        total;


    pendingTasks.textContent =
        pending;


    completedTasks.textContent =
        completed;


    progressPercent.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;

}


// =========================================
// SIDEBAR NAVIGATION
// =========================================

navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                // Remove active

                navLinks.forEach(
                    function (nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                // Add active

                link.classList.add(
                    "active"
                );


                // Current view

                currentView =
                    link.dataset.view;


                const viewTitles = {

                    all:
                        "Dashboard",

                    today:
                        "Today's Tasks",

                    upcoming:
                        "Upcoming Tasks",

                    completed:
                        "Completed Tasks"

                };


                const listTitles = {

                    all:
                        "My Tasks",

                    today:
                        "Today's Tasks",

                    upcoming:
                        "Upcoming Tasks",

                    completed:
                        "Completed Tasks"

                };


                pageTitle.textContent =
                    viewTitles[currentView];


                taskListTitle.textContent =
                    listTitles[currentView];


                // Reset filters

                statusFilter.value =
                    "all";


                priorityFilter.value =
                    "all";


                searchInput.value =
                    "";


                renderTasks();

            }
        );

    }
);


// =========================================
// SEARCH + FILTER EVENTS
// =========================================

searchInput.addEventListener(
    "input",
    renderTasks
);


statusFilter.addEventListener(
    "change",
    renderTasks
);


priorityFilter.addEventListener(
    "change",
    renderTasks
);


// =========================================
// DARK MODE
// =========================================

function updateThemeButton() {

    const isDarkMode =
        document.body.classList.contains(
            "dark-mode"
        );


    if (isDarkMode) {

        themeToggle.textContent =
            "☀️";


        themeToggle.title =
            "Switch to light mode";


        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    }

    else {

        themeToggle.textContent =
            "🌙";


        themeToggle.title =
            "Switch to dark mode";


        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }

}


// =========================================
// LOAD SAVED THEME
// =========================================

const savedTheme =
    localStorage.getItem(
        "taskflow-theme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeButton();


// =========================================
// TOGGLE THEME
// =========================================

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDarkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        if (isDarkMode) {

            localStorage.setItem(
                "taskflow-theme",
                "dark"
            );

        }

        else {

            localStorage.setItem(
                "taskflow-theme",
                "light"
            );

        }


        updateThemeButton();

    }
);


// =========================================
// RENDER COMPLETE APP
// =========================================

function renderApp() {

    updateStatistics();

    renderTasks();

}


// =========================================
// INITIALIZE APP
// =========================================

renderApp();