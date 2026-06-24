const knob = document.getElementById("knob");
const track = document.querySelector(".track");
const gameArea = document.getElementById("gameArea");
const volumeText = document.getElementById("volumeText");
const forceText = document.getElementById("forceText");
const message = document.getElementById("message");
const prediction = document.getElementById("prediction");
const resetBtn = document.getElementById("resetBtn");
const playBtn = document.getElementById("playBtn");
const audio = document.getElementById("audio");

const ZERO_BOTTOM = 82;
const MAX_BOTTOM = 340;
const MIN_PULL_BOTTOM = 18;
const KNOB_SIZE = 68;

let isDragging = false;
let pointerId = null;
let pullStartY = 0;
let currentBottom = ZERO_BOTTOM;
let volume = 0;
let animationId = null;
let audioStarted = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setKnobBottom(bottom) {
  currentBottom = clamp(bottom, MIN_PULL_BOTTOM, MAX_BOTTOM);
  knob.style.bottom = `${currentBottom}px`;
}

function bottomToVolume(bottom) {
  const usable = MAX_BOTTOM - ZERO_BOTTOM;
  const percent = ((bottom - ZERO_BOTTOM) / usable) * 100;
  return Math.round(clamp(percent, 0, 100));
}

function setVolume(value) {
  volume = clamp(Math.round(value), 0, 100);
  volumeText.textContent = `${volume}%`;
  audio.volume = volume / 100;
}

function setMessage(text) {
  message.textContent = text;
}

function fakePredict(force) {
  const fake = clamp(Math.round(force * 1.9 + Math.random() * 35), 0, 100);
  prediction.textContent = `Fake prediction: ${fake}%`;
}

function stopAnimation() {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = null;
}

function launch(pullDistance) {
  stopAnimation();

  if (pullDistance < 18) {
    setMessage("Weak pull. The slider judged you and stayed at 0%.");
    forceText.textContent = "0";
    setKnobBottom(ZERO_BOTTOM);
    setVolume(0);
    return;
  }

  let y = currentBottom;
  let velocity = pullDistance * 0.24 + Math.random() * 4;
  let gravity = 0.72;
  let bounces = 0;
  let cursedWind = Math.random() * 1.4 - 0.7;

  gameArea.classList.add("shake");
  setMessage("Launching... may the browser gods show mercy.");

  function animate() {
    velocity -= gravity;
    y += velocity + cursedWind;

    if (y > MAX_BOTTOM) {
      y = MAX_BOTTOM;
      velocity *= -0.38;
      bounces++;
      setMessage("It hit 100%. Naturally, it bounced. Sensible design is banned here.");
    }

    if (y < ZERO_BOTTOM) {
      y = ZERO_BOTTOM;
      velocity *= -0.45;
      bounces++;
    }

    setKnobBottom(y);
    setVolume(bottomToVolume(y));

    const movingSlowly = Math.abs(velocity) < 1.1;
    const landedInRange = y >= ZERO_BOTTOM && y <= MAX_BOTTOM;
    const tiredOfBouncing = bounces > 4;

    if ((movingSlowly && landedInRange && bounces > 0) || tiredOfBouncing) {
      gameArea.classList.remove("shake");
      const finalVolume = bottomToVolume(y);
      setVolume(finalVolume);
      setKnobBottom(ZERO_BOTTOM + ((MAX_BOTTOM - ZERO_BOTTOM) * finalVolume) / 100);
      forceText.textContent = "0";
      setMessage(`Final volume: ${finalVolume}%. This is what happens when UX files a police report.`);
      animationId = null;
      return;
    }

    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);
}

function startDrag(event) {
  stopAnimation();
  isDragging = true;
  pointerId = event.pointerId;
  pullStartY = event.clientY;
  knob.setPointerCapture(pointerId);
  setMessage("Pull downward below zero. More pull = more chaos.");
}

function drag(event) {
  if (!isDragging || event.pointerId !== pointerId) return;

  const deltaY = event.clientY - pullStartY;
  const pullDistance = clamp(deltaY, 0, ZERO_BOTTOM - MIN_PULL_BOTTOM + 105);
  const nextBottom = ZERO_BOTTOM - pullDistance;

  setKnobBottom(nextBottom);
  forceText.textContent = Math.round(pullDistance);
  fakePredict(pullDistance);

  if (pullDistance > 110) {
    setMessage("Overcharged. At this point the slider is no longer a tool, it's a threat.");
  }
}

function endDrag(event) {
  if (!isDragging || event.pointerId !== pointerId) return;

  isDragging = false;
  pointerId = null;

  const pullDistance = ZERO_BOTTOM - currentBottom;
  launch(pullDistance);
}

function resetSlider() {
  stopAnimation();
  gameArea.classList.remove("shake");
  setKnobBottom(ZERO_BOTTOM);
  setVolume(0);
  forceText.textContent = "0";
  prediction.textContent = "Fake prediction: 0%";
  setMessage("Drag the knob downward below 0%, then release.");
}

async function toggleAudio() {
  try {
    if (!audioStarted) {
      await audio.play();
      audioStarted = true;
      playBtn.textContent = "Pause test sound";
      setMessage("Sound enabled. Now ruin your ears responsibly.");
    } else if (audio.paused) {
      await audio.play();
      playBtn.textContent = "Pause test sound";
    } else {
      audio.pause();
      playBtn.textContent = "Play test sound";
    }
  } catch (error) {
    setMessage("Your browser blocked autoplay. Tap again like the little ritual modern web demands.");
  }
}

knob.addEventListener("pointerdown", startDrag);
knob.addEventListener("pointermove", drag);
knob.addEventListener("pointerup", endDrag);
knob.addEventListener("pointercancel", endDrag);
resetBtn.addEventListener("click", resetSlider);
playBtn.addEventListener("click", toggleAudio);

resetSlider();
