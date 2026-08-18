// Update the #last-updated element with the current date/time every second
function updateTimestamp(){
  const el = document.getElementById('last-updated');
  if(!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString();
}

updateTimestamp();
setInterval(updateTimestamp, 1000);
