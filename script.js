// --- config (tumhare links) ---
const TELEGRAM_BOT_LINK = "https://t.me/Epic_rewards_bot";
const REQUIRED_CHANNEL = "https://t.me/epicunlock";

// session id (sirf track ke liye)
function makeSess() {
  return "SESS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// DOM refs
const tasksEl = document.getElementById("tasks");
const bar = document.getElementById("bar");
const pct = document.getElementById("pct");
const goBtn = document.getElementById("goBtn");
const modal = document.getElementById("modal");
const secEl = document.getElementById("sec");
const skip = document.getElementById("skip");

// year
document.getElementById("y").textContent = new Date().getFullYear();

// load tasks.json
fetch("tasks.json")
  .then(r => r.json())
  .then(renderTasks)
  .catch(() => {
    tasksEl.innerHTML = `<div class="task"><label><div><div class="title">Could not load tasks</div><div class="desc">Ensure tasks.json is in the same folder.</div></div></label></div>`;
  });

let total = 0, done = 0;

function renderTasks(list) {
  total = list.length;
  tasksEl.innerHTML = list.map((t, i) => `
    <div class="task">
      <label>
        <input type="checkbox" data-i="${i}">
        <div>
          <div class="title">${t.title}</div>
          <div class="desc">${t.desc}</div>
        </div>
      </label>
    </div>
  `).join("");

  tasksEl.addEventListener("change", (e) => {
    if (e.target && e.target.matches('input[type="checkbox"]')) {
      done = [...document.querySelectorAll('input[type="checkbox"]')].filter(c => c.checked).length;
      const p = Math.round((done / total) * 100);
      bar.style.width = p + "%";
      pct.textContent = p + "%";
      goBtn.disabled = p !== 100;
    }
  });
}

// ad wait → then redirect to Telegram bot with session id
goBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  let s = 10;
  secEl.textContent = s;
  skip.disabled = true;
  const t = setInterval(() => {
    s--;
    secEl.textContent = s.toString().padStart(2, "0");
    if (s <= 0) {
      clearInterval(t);
      skip.disabled = false;
      // auto-continue
      doContinue();
    }
  }, 1000);

  skip.onclick = () => {
    doContinue();
  };
});

function doContinue() {
  const sess = makeSess();
  // IMPORTANT: website par koi redeem code Nahi — sab bot me hoga
  const url = `${TELEGRAM_BOT_LINK}?start=${encodeURIComponent(sess)}`;
  window.location.href = url;
}
