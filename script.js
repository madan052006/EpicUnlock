// =========== CONFIG ===========
const TELEGRAM_BOT_LINK = "https://t.me/Epic_rewards_bot"; // tumhara bot
const AD_WAIT_SECONDS = 10;                                  // ad ke seconds
const TASKS_FILE = "tasks.json";                             // tasks data file
// ===============================

// Elements
const tasksContainer = document.getElementById("tasks");
const bar            = document.getElementById("bar");
const progressText   = document.getElementById("progressText");
const checkTasksBtn  = document.getElementById("checkTasks");
const hint           = document.getElementById("hint");
const modal          = document.getElementById("adModal");
const continueBtn    = document.getElementById("continueBtn");

// Keep a session id so the user gets a consistent one
let sessionId = localStorage.getItem("epicunlock_session");
if (!sessionId) {
  sessionId = "SESS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  localStorage.setItem("epicunlock_session", sessionId);
}

// Load tasks from tasks.json and render
async function loadTasks() {
  try {
    const res = await fetch(TASKS_FILE, { cache: "no-store" });
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (e) {
    tasksContainer.innerHTML = "<p>Could not load tasks. Please refresh.</p>";
    console.error("Tasks load error:", e);
  }
}

// Render tasks (checkbox list)
function renderTasks(tasks) {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${task.id}"> ${task.text}`;
    // Open link in new tab when user clicks label (or text)
    label.addEventListener("click", (ev) => {
      // Open the link only on first click (so it doesn't open repeatedly)
      if (!label.dataset.opened) {
        window.open(task.link, "_blank");
        label.dataset.opened = "1";
      }
    });
    tasksContainer.appendChild(label);
  });

  // Listen for checkbox changes to update progress
  document.addEventListener("change", updateProgress);
  updateProgress();
}

// Update progress bar and enable continue when all done
function updateProgress() {
  const total = document.querySelectorAll("#tasks input[type='checkbox']").length;
  const done  = document.querySelectorAll("#tasks input[type='checkbox']:checked").length;

  const percent = total ? Math.floor((done / total) * 100) : 0;
  bar.style.width = percent + "%";
  progressText.textContent = `${percent}% complete`;

  if (done === total && total > 0) {
    checkTasksBtn.disabled = false;
    hint.textContent = "All tasks complete! Continue to Telegram.";
  } else {
    checkTasksBtn.disabled = true;
    hint.textContent = "Complete all tasks to continue.";
  }
}

// Show ad modal with countdown, then allow continue
checkTasksBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  let sec = AD_WAIT_SECONDS;
  continueBtn.disabled = true;
  continueBtn.textContent = `Wait ${sec}s`;

  const timer = setInterval(() => {
    sec--;
    if (sec > 0) {
      continueBtn.textContent = `Wait ${sec}s`;
    } else {
      clearInterval(timer);
      continueBtn.disabled = false;
      continueBtn.textContent = "Continue";
    }
  }, 1000);
});

// Redirect to Telegram bot with deep-link parameter
continueBtn.addEventListener("click", () => {
  // optional: close modal
  modal.style.display = "none";
  // Send user to bot with start param (session id)
  window.location.href = `${TELEGRAM_BOT_LINK}?start=${encodeURIComponent(sessionId)}`;
});

// Kick off
loadTasks();
