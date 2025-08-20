async function loadTasks() {
  const response = await fetch('tasks.json');
  const tasks = await response.json();
  const tasksDiv = document.getElementById('tasks');

  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = 'task';
    div.innerHTML = `<input type="checkbox" id="task${index}"> 
                     <label for="task${index}">${task}</label>`;
    tasksDiv.appendChild(div);
  });
}

document.getElementById('checkTasks').addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let allDone = true;

  checkboxes.forEach(cb => {
    if (!cb.checked) allDone = false;
  });

  const redeemText = document.getElementById('redeemCode');
  if (allDone) {
    redeemText.innerText = "🎉 Your Redeem Code: EPIC-123-UNLOCK";
    redeemText.style.color = "green";
  } else {
    redeemText.innerText = "❌ Please complete all tasks first!";
    redeemText.style.color = "red";
  }
});

loadTasks();
