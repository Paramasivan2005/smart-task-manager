// ADD TASK MODAL
const addTaskbtn = document.getElementById("addtaskbtn");
const modal = document.getElementById("addtask-div");
const modalBox = document.getElementById("modal-box");
const cancelBtn = document.querySelector(".cancel-btn");

addTaskbtn.addEventListener("click", () => {
  modal.classList.remove("opacity-0", "pointer-events-none");
  inputName.value = "";
  inputDueDate.value = "";
  inputPriority.value = "";
});

// close on cancel button
cancelBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  modal.classList.add("opacity-0", "pointer-events-none");
});

// close only when clicking overlay
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("opacity-0", "pointer-events-none");
  }
});

// prevent clicks inside modal box from closing
modalBox.addEventListener("click", (e) => {
  e.stopPropagation();
});



// close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.add("opacity-0", "pointer-events-none");
  }
});

// SAVE BUTTON
const saveButton = document.querySelector(".save-btn");
const load = document.querySelector(".load");
const btnText = document.querySelector(".btn-text");
const inputName = document.getElementById("task-name-add")
const inputDueDate = document.getElementById("due-date-add")
const inputPriority = document.getElementById("priority-field-add");
const pendingTaksSection = document.getElementById("pendingTasks")
// const priorityColor = document.getElementById("priority-color")

// save button with localstorage
saveButton.addEventListener("click", (e) => {
  e.stopPropagation();

  // Validation
  if (!inputName.value.trim()) {
    alert("Please Enter Your Task Name");
    return;
  }

  if (!inputDueDate.value.trim()) {
    alert("Please Enter Your Due Date");
    return;
  }

  if (!inputPriority.value) {
    alert("Please select priority");
    return;
  }

  load.classList.remove("hidden");
  btnText.textContent = "Saving...";
  saveButton.classList.replace("bg-purple-600", "bg-purple-500");

  setTimeout(() => {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const editingId = modal.dataset.editingId ? Number(modal.dataset.editingId) : null;

    if (editingId) {

      //  UPDATE EXISTING TASK
      tasks = tasks.map(task =>
        task.id === editingId
          ? {
            ...task,
            title: inputName.value.trim(),
            dueDate: inputDueDate.value,
            priority: inputPriority.value
          }
          : task
      );

      delete modal.dataset.editingId; // exit edit mode

    } else {

      // ➕ CREATE NEW TASK
      const newTask = {
        id: Date.now(),
        title: inputName.value.trim(),
        dueDate: inputDueDate.value,
        priority: inputPriority.value,
        status: "Pending"
      };

      tasks.unshift(newTask);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    modal.classList.add("opacity-0", "pointer-events-none");

    inputName.value = "";
    inputDueDate.value = "";
    inputPriority.value = "";

    load.classList.add("hidden");
    btnText.textContent = "Save Task";
    saveButton.classList.replace("bg-purple-500", "bg-purple-600");

  }, 800);
});

let allTasks = [];
let currentFilter = { type: null, value: null };

// RENDER TASKS FUNCTION

function renderTasks() {
  const completedSection = document.getElementById("completedTasks");

  pendingTaksSection.innerHTML = "";
  completedSection.innerHTML = "";


  allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let tasks = [...allTasks];

  // apply active sort/filter if any
  if (currentFilter.type === "priority") {
    tasks = tasks.filter(t => t.priority === currentFilter.value);
  }
  if (currentFilter.type === "status") {
    tasks = tasks.filter(t => t.status === currentFilter.value);
  }

  // 🔥 CALCULATE STATS
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;

  // 🔥 UPDATE DOM
  const totalEl = document.getElementById("totalCount");
  const completedEl = document.getElementById("completedCount");
  const pendingEl = document.getElementById("pendingCount");

  if (totalEl) totalEl.textContent = total;
  if (completedEl) completedEl.textContent = completed;
  if (pendingEl) pendingEl.textContent = pending;

  document.getElementById("taskTodayText").innerHTML = `You've got <span class="text-pink-600">${pending}</span> task${pending !== 1 ? "s" : ""} today`;


  pendingTaksSection.innerHTML = "";
  if (currentFilter.type === "priority") {
    tasks = tasks.filter(t => t.priority === currentFilter.value);
  }
  if (currentFilter.type === "status") {
    tasks = tasks.filter(t => t.status === currentFilter.value);
  }
  if (currentFilter.type === "date") {
    tasks = tasks.filter(t => t.dueDate === currentFilter.value);
  }

  tasks.forEach(task => {
    // if (task.status !== "Pending") return;

    const section = document.createElement("section");
    section.className =
      "grid grid-cols-1 lg:flex lg:justify-between gap-1 items-center py-4 px-3 border-b border-gray-200 hover:bg-gray-100 transition";

    section.innerHTML = `
      <div class="group relative flex items-center gap-3 cursor-pointer">
        <i class="ri-checkbox-blank-circle-line text-pink-600"></i>
        <p class="font-jost">${task.title}</p>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              hidden group-hover:block
              bg-gray-800 text-white text-xs
              px-3 py-1 rounded-md shadow-md whitespace-nowrap tooltip">
                  Click to mark as complete
                </div>
      </div>

      <div class="lg:flex lg:gap-10">
        <div class="flex justify-around gap-5 items-center">
          <p class="status-badge bg-yellow-200 text-yellow-700 text-sm font-semibold text-center py-1 px-5 rounded-xl h-fit">
  ${task.status} </p>

          <p class="priority-color flex items-center justify-center gap-1 font-semibold">
            <i class="ri-circle-fill text-xs"></i> ${task.priority}
          </p>
        </div>

        <div class="flex justify-between items-center gap-5">
          <p class="text-center font-jost">${task.dueDate}</p>
          <i class="ri-pencil-fill text-center hover:bg-gray-200 rounded-full p-2 cursor-pointer edit-btn"></i>
          <i class="ri-delete-bin-line hover:bg-gray-200 rounded-full p-2 cursor-pointer delete-btn"></i>
        </div>
      </div>
    `;

    const priorityEl = section.querySelector(".priority-color");

    if (task.priority === "Low") {
      priorityEl.classList.add("text-green-500");
    } else if (task.priority === "High") {
      priorityEl.classList.add("text-red-500");
    } else {
      priorityEl.classList.add("text-amber-500");
    }

    section.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    const editBtn = section.querySelector(".edit-btn");

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const titleEl = document.getElementById("addtask-title");

      // Open modal
      modal.classList.remove("opacity-0", "pointer-events-none");

      // Change modal title
      titleEl.textContent = "Update Task";

      // Fill existing values
      inputName.value = task.title;
      inputDueDate.value = task.dueDate;
      inputPriority.value = task.priority;

      // Store editing ID
      modal.dataset.editingId = task.id;

      btnText.textContent = "Update Task";
    });

    // ✅ MARK AS COMPLETE
    const taskTitleArea = section.querySelector(".group");

    taskTitleArea.addEventListener("click", () => {

      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      tasks = tasks.map(t =>
        t.id === task.id
          ? { ...t, status: "Completed" }
          : t
      );

      localStorage.setItem("tasks", JSON.stringify(tasks));

      renderTasks();

    });



    if (task.status === "Pending") {
      pendingTaksSection.appendChild(section);
    } else {
      const tip = section.querySelector(".tooltip");
      if (tip) tip.remove();
      completedSection.appendChild(section);

      // optional style
      const statusBadge = section.querySelector(".status-badge");
      statusBadge.classList.remove("bg-yellow-200", "text-yellow-700");
      statusBadge.classList.add("bg-green-200", "text-green-700");
      statusBadge.textContent = "Completed";

      const icon = section.querySelector("i");
      icon.classList.remove("ri-checkbox-blank-circle-line", "text-pink-600");
      icon.classList.add("ri-checkbox-circle-fill", "text-pink-600");


      // section.classList.add("opacity-60");
      section.querySelector(".font-jost").classList.add("line-through");
      section.querySelector(".font-jost").classList.add("text-gray-400");
      editBtn.classList.remove("cursor-pointer");
      editBtn.classList.add("cursor-not-allowed");
      editBtn.classList.add("pointer-events-none")
      // section.querySelector(".ri-circle-fill").classList.add("ri-circle-fill")

    }
  });
  notifyTaskStats();
}

function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");

  if (!confirmDelete) return

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks = tasks.filter(task => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTasks();
}
document.addEventListener("DOMContentLoaded", renderTasks);



// greating username printing

document.addEventListener("DOMContentLoaded", () => {
  const currentUserStr = localStorage.getItem("currentUser");

  if (!currentUserStr) {
    window.location.href = "index.html";
    return;
  }

  const currentUser = JSON.parse(currentUserStr);

  const usernameText = document.getElementById("usernameText");
  if (usernameText) {
    usernameText.textContent = currentUser.fullname || "User";
  }
  // greeting text

  const greetingText = document.getElementById("greetingText");

  const now = new Date();
  const currentHour = now.getHours();

  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour < 20) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  greetingText.textContent = `${greeting}, ${currentUser.fullname}`

});

// DUE DATE PICKER
const dueBtn = document.getElementById("date-menu");
const dueInput = document.getElementById("dropdown-date");

dueBtn.addEventListener("click", () => dueInput.showPicker());



//  sort listing logic

const sortList = document.getElementById("sort-list");
const sortIcon = document.getElementById("sort-icon");

// open/close main sort list
sortIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  sortList.classList.toggle("hidden");
});

// close when clicking outside
document.addEventListener("click", (e) => {
  if (!sortList.contains(e.target) && !sortIcon.contains(e.target)) {
    sortList.classList.add("hidden");
    // close submenus too
    document.querySelectorAll("#sort-list .submenu").forEach(sm => sm.classList.add("hidden"));
    document.querySelectorAll("#sort-list .chevron").forEach(ch => ch.classList.remove("rotate-90"));
  }
});

// submenu toggle (mobile/tab)
document.querySelectorAll("#sort-list .submenu-item").forEach((item) => {
  const toggle = item.querySelector(".submenu-toggle");
  const submenu = item.querySelector(".submenu");
  const chevron = item.querySelector(".chevron");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();

    // close other submenus
    document.querySelectorAll("#sort-list .submenu").forEach((sm) => {
      if (sm !== submenu) sm.classList.add("hidden");
    });
    document.querySelectorAll("#sort-list .chevron").forEach((ch) => {
      if (ch !== chevron) ch.classList.remove("rotate-90");
    });

    submenu.classList.toggle("hidden");
    chevron.classList.toggle("rotate-90");
  });
});

// priority filter
document.querySelectorAll("#sort-list .sort-priority").forEach((li) => {
  li.addEventListener("click", (e) => {
    e.stopPropagation();
    currentFilter = { type: "priority", value: li.dataset.priority };
    renderTasks();
    sortList.classList.add("hidden");
  });
});

// status filter
document.querySelectorAll("#sort-list .sort-status").forEach((li) => {
  li.addEventListener("click", (e) => {
    e.stopPropagation();
    currentFilter = { type: "status", value: li.dataset.status };
    renderTasks();
    sortList.classList.add("hidden");
  });
});

// const dueInput = document.getElementById("dropdown-date");

dueInput.addEventListener("change", () => {
  const selectedDate = dueInput.value; // "YYYY-MM-DD"

  if (!selectedDate) {
    currentFilter = { type: null, value: null };
  } else {
    currentFilter = { type: "date", value: selectedDate };
  }

  renderTasks();

  // close dropdown
  sortList.classList.add("hidden");
  document.querySelectorAll("#sort-list .submenu").forEach(sm => sm.classList.add("hidden"));
});

// popup div logic

const popupDiv = document.getElementById("popup-div");
const leftArrow = document.getElementById("left-arrow");

leftArrow.addEventListener("click", () => {
  popupDiv.classList.toggle("right-0");
});

// search icon logic

const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");
const searchArrow = document.getElementById("search-submit-arrow");

const activeIconClasses = ["bg-purple-600", "text-white", "font-bold", "px-2", "py-1", "rounded-md"];

searchIcon.addEventListener("click", () => {

  const isHidden = searchInput.classList.contains("opacity-0");

  // Toggle input visibility
  searchInput.classList.toggle("opacity-0");
  searchInput.classList.toggle("pointer-events-none");

  // Toggle arrow
  searchArrow.classList.toggle("opacity-0");
  searchArrow.classList.toggle("pointer-events-none");

  if (isHidden) {
    searchIcon.classList.remove(...activeIconClasses);
    setTimeout(() => searchInput.focus(), 50);
  } else {
    searchIcon.classList.add(...activeIconClasses);
  }

  if (isHidden) {
    searchIcon.classList.remove("text-white");
    searchIcon.classList.add("text-gray-400");
    searchInput.focus();
  } else {
    searchIcon.classList.remove("text-gray-400");
    searchIcon.classList.add("text-white");
  }
});

searchInput.addEventListener("input", searchTasks);

function searchTasks() {
  const searchValue = searchInput.value.toLowerCase();

  const tasks = document.querySelectorAll("#pendingTasks section, #completedTasks section");

  tasks.forEach(task => {
    const title = task.querySelector("p").textContent.toLowerCase();

    if (searchValue === "") {
      // when input cleared → show all
      task.style.display = "";
    }
    else if (title.includes(searchValue)) {
      task.style.display = "";
    }
    else {
      task.style.display = "none";
    }
  });
}

searchArrow.addEventListener("click", () => {

  searchInput.classList.add("opacity-0", "pointer-events-none");
  searchArrow.classList.add("opacity-0", "pointer-events-none");
  searchIcon.classList.add(...activeIconClasses);

});

document.addEventListener("click", (e) => {
  const clickInside = searchArrow.contains(e.target) || searchIcon.contains(e.target) || searchInput.contains(e.target);

  if (!clickInside) {
    searchInput.classList.add("opacity-0", "pointer-events-none");
    searchArrow.classList.add("opacity-0", "pointer-events-none");
    searchIcon.classList.add(...activeIconClasses);
    searchIcon.classList.remove("text-gray-400");
    searchIcon.classList.add("text-white");
  }
})

const demoBtn = document.getElementById("demoBtn");

demoBtn.addEventListener("click", () => {

  const demoTasks = [
    {
      id: Date.now(),
      title: "Design Landing Page",
      dueDate: "2026-03-10",
      priority: "High",
      status: "Pending"
    },
    {
      id: Date.now() + 1,
      title: "Fix Dashboard Bug",
      dueDate: "2026-03-12",
      priority: "Normal",
      status: "Pending"
    },
    {
      id: Date.now() + 2,
      title: "Deploy Project",
      dueDate: "2026-03-15",
      priority: "Low",
      status: "Completed"
    }
  ];

  localStorage.setItem("tasks", JSON.stringify(demoTasks));

  renderTasks();
});


function notifyTaskStats() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = total - completed;

  // send to chart.js
  window.dispatchEvent(new CustomEvent("tasksUpdated", {
    detail: { total, pending, completed }
  }));
}

// user logout logic

const userIcon = document.getElementById("user");
const userDiv = document.getElementById("user-div");
const logout = document.getElementById("logout");

userIcon.addEventListener("click", () => {
  userDiv.classList.toggle("hidden")
});

document.addEventListener("click", (e) => {
  const UserActive = userDiv.contains(e.target) || userIcon.contains(e.target);

  if (!UserActive) {
    userDiv.classList.add("hidden")
  }
})

// logout logic 

logout.addEventListener("click", (e) => {
  e.stopPropagation();
  setTimeout(() => {
    // confirm("Are you sure ! if you want to logout Your Account ?");
    window.location.href = "index.html";
  }, 1000)

})

// logout section userName updating the current user

const currentUserStr = localStorage.getItem("currentUser");

const currentUser = JSON.parse(currentUserStr);

const usernameText = document.getElementById("logoutUser");
if (usernameText) {
  usernameText.textContent = currentUser.fullname || "User";
}


