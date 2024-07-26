const clock = document.getElementById("clock");

function getCurrentTime(): string {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  const formattedTime = formattedHours + " : " + formattedMinutes;

  return formattedTime;
}

function updateTime(): void {
  if (!clock) {
    return;
  }

  clock.innerHTML = getCurrentTime();
  requestAnimationFrame(updateTime);
}

updateTime();
