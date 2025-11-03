<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";

const defaultText = 'Hello, World!';
const message = ref(defaultText);
const messages = ['Hello, World!', '你好，世界！', 'こんにちは、世界！', 'Hola, Mundo!', 'Bonjour le monde!', 'Hallo Welt!', 'Olá, Mundo!', 'Ciao, Mondo!', 'नमस्ते दुनिया!', 'مرحبا بالعالم!'];
const circles = reactive<Circle[]>([]);
interface Circle {
  id: number;
  style: {
    width: string;
    height: string;
    left: string;
    top: string;
    backgroundColor: string;
    animationDuration: string;
    animationDelay: string;
  };
}

onMounted(() => {
  // 循環切換消息
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    message.value = messages[randomIndex] || defaultText;
  }, 3000);

  // 動態創建圓圈
  for (let i = 0; i < 20; i++) {
    createCircle();
  }
});

function createCircle() {
  const size = Math.random() * 40 + 10;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const color = getRandomColor();
  const duration = Math.random() * 3 + 2;
  const delay = Math.random() * 2;

  circles.push({
    id: Date.now() + Math.random(),
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}%`,
      top: `${y}%`,
      backgroundColor: color,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    },
  });
}

function getRandomColor() {
  const colors = ['#00bcd4', '#009688', '#673ab7', '#9c27b0', '#e91e63', '#f44336', '#795548', '#607d8b'];
  return colors[Math.floor(Math.random() * colors.length)] || '#00bcd4';
}
</script>

<template lang="pug">
  .hello-world
    .container
      h1.message {{ message }}
      .animation
        .circles
          .circle(v-for="circle in circles" :key="circle.id" :style="circle.style")
</template>

<style lang="sass" scoped>
.hello-world
  display: flex
  justify-content: center
  align-items: center
  height: 100%
  width: 100%
  overflow: hidden

.container
  text-align: center

.message
  text-align: center
  font-size: 3em
  font-weight: bold
  font-family: 'Courier New', Courier, monospace
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2)

.animation
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0

.circles
  position: relative
  width: 100%
  height: 100%

.circle
  position: absolute
  border-radius: 50%
  opacity: 0
  animation: float 5s infinite ease-out

@keyframes float
  0%
    transform: translateY(0) scale(0)
    opacity: 0
  25%
    opacity: 0.8
  50%
    transform: translateY(-100px) scale(1)
    opacity: 0.5
  100%
    transform: translateY(-200px) scale(1.5)
    opacity: 0
</style>
