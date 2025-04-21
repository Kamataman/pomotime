<template>
  <div class="text-center p-4">
    <h1 class="text-2xl font-bold mb-4">ポモドーロタイマー</h1>
    <div class="text-5xl font-mono mb-4">
      {{ formattedTime }}
    </div>
    <div class="mb-2">
      <span>{{ isBreak ? "休憩中" : "集中中" }}</span>
    </div>
    <div class="space-x-2">
      <button @click="startTimer" :disabled="isRunning">スタート</button>
      <button @click="stopTimer" :disabled="!isRunning">ストップ</button>
      <button @click="resetTimer">リセット</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

const isRunning = ref(false);
const isBreak = ref(false);
const timeLeft = ref(FOCUS_MINUTES * 60);
let intervalId = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
});

function startTimer() {
  if (isRunning.value) return;
  isRunning.value = true;
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      switchMode();
    }
  }, 1000);
}

function stopTimer() {
  isRunning.value = false;
  clearInterval(intervalId);
}

function resetTimer() {
  stopTimer();
  isBreak.value = false;
  timeLeft.value = FOCUS_MINUTES * 60;
}

function switchMode() {
  isBreak.value = !isBreak.value;
  timeLeft.value = (isBreak.value ? BREAK_MINUTES : FOCUS_MINUTES) * 60;
  // ここに通知・音・バイブなど追加予定
}

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
  border: 1px solid #aaa;
  border-radius: 5px;
  background: #f0f0f0;
}
</style>
