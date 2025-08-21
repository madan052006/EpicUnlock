// Tasks list
const tasksData = [
  { id: 1, text: "Join our Telegram Bot", link: "https://t.me/Epic_rewards_bot" },
  { id: 2, text: "Join our Telegram Channel", link: "https://t.me/epicunlock" },
  { id: 3, text: "Subscribe on YouTube", link: "https://www.youtube.com/@ALERTLORDYT" },
  { id: 4, text: "Follow on Instagram", link: "https://instagram.com/" }
];

// Elements
const tasksContainer = document.getElementById("tasks");
const bar = document.getElementById("bar");
const progressText = document.getElementById("progressText");
const checkTasksBtn = document.getElementById("checkTasks");
const hint = document.getElementById("hint");
const modal = document.getElementById("modal");
const continueBtn = document.getElementById("continueBtn");

// Render tasks
tasksData.forEach(task => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${task.id}"> ${task.text}`;
  label.addEventListener("click", () => {
    window.open(task.link, "_blank"); // open link
  });
  tasksContainer.appendChild(label);
});

// Progress update
function updateProgress() {
  const checkboxes = document.querySelectorAll("#tasks input:checked");
  const completed = checkboxes.length;
  const total = tasksData.length;

  const percent = Math.floor((completed / total) * 100);
  bar.style.width = percent + "%";
  progressText.textContent = `${percent}% complete`;

  if (completed === total) {
    checkTasksBtn.disabled = false;
    hint.textContent = "All tasks complete! Continue to Telegram.";
  }
}

document.addEventListener("change", updateProgress);

// On "Continue to Telegram" button
checkTasksBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  let seconds = 10;
  continueBtn.textContent = `Wait ${seconds}s`;
  continueBtn.disabled = true;

  const timer = setInterval(() => {
    seconds--;
    continueBtn.textContent = seconds > 0 ? `Wait ${seconds}s` : "Continue";
    if (seconds === 0) {
      clearInterval(timer);
      continueBtn.disabled = false;
    }
  }, 1000);
});

// After ad wait, redirect to Telegram bot
continueBtn.addEventListener("click", () => {
  window.location.href = "https://t.me/Epic_rewards_bot";
});
