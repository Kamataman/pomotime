<template>
  <div
    class="column justify-center items-center align-center"
    style="height: 100vh"
  >
    <p
      class="text-h4 q-mb-md"
      style="
        background: linear-gradient(to right, #ff4e50, #f9d423);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      "
    >
      ⏱️PomoTime　
    </p>
    <q-circular-progress
      show-value
      :value="progress"
      size="200px"
      :thickness="0.3"
      color="primary"
      center-color="grey-2"
      track-color="grey-4"
      class="q-mb-md"
    >
      <div class="text-h4 q-pb-sm">{{ formattedTime }}</div>
    </q-circular-progress>
    <div class="q-pa-sm">
      <div class="q-gutter-sm row justify-center q-mb-md">
        <q-chip
          :color="!isBreak ? 'red' : 'grey-3'"
          :text-color="!isBreak ? 'white' : 'black'"
          icon="schedule"
          outline
        >
          集中
        </q-chip>

        <q-chip
          :color="isBreak ? 'green' : 'grey-3'"
          :text-color="isBreak ? 'white' : 'black'"
          icon="self_improvement"
          outline
        >
          休憩
        </q-chip>
      </div>
    </div>
    <div class="q-gutter-sm">
      <q-btn
        color="positive"
        icon="play_arrow"
        @click="startTimer"
        :disabled="isRunning"
        label="Start"
      />
      <q-btn
        color="negative"
        icon="stop"
        @click="stopTimer"
        :disabled="!isRunning"
        label="Stop"
      />
      <q-btn
        color="secondary"
        icon="replay"
        @click="resetTimer"
        label="Reset"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

const startTime = ref(null);
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
const progress = computed(() => {
  const parent = (isBreak.value ? BREAK_MINUTES : FOCUS_MINUTES) * 60;
  return (timeLeft.value / parent) * 100;
});

function updateRemaining() {
  if (startTime.value !== null) {
    const elapsed = Math.floor((Date.now() - startTime.value) / 1000);
    timeLeft.value = Math.max((isBreak.value ? BREAK_MINUTES : FOCUS_MINUTES) * 60 - elapsed, 0);

    if (timeLeft.value === 0) {
      switchMode(); 
    }
  }
}

function startTimer() {
  if (isRunning.value) return;
  startTime.value = Date.now();
  isRunning.value = true;
  intervalId = setInterval(updateRemaining, 1000);
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
  startTime.value = Date.now();
  timeLeft.value = (isBreak.value ? BREAK_MINUTES : FOCUS_MINUTES) * 60;
  // ここに通知・音・バイブなど追加予定
  handleTimerEnd();
}

// 音を鳴らす関数
const playSound = () => {
  const audio = new Audio("/鳩時計2.mp3");
  audio.play().catch((e) => {
    console.warn("音の再生がブロックされたか失敗しました:", e);
  });
};

// バイブレーションを鳴らす関数
const vibrate = () => {
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]); // 200msバイブ → 100ms休み → 200msバイブ
  }
};

// 通知を出す関数
const showNotification = () => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("タイマー終了！", {
      body: "おつかれさま！リラックスタイム☕",
      icon: "/icon.png", // 必要ならアイコンも置いてね（任意）
    });
  }
};

// タイマー終了時に呼ぶ関数
const handleTimerEnd = () => {
  playSound();
  vibrate();
  showNotification();
};

// 通知の許可リクエスト（初回だけ実行）
onMounted(() => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
