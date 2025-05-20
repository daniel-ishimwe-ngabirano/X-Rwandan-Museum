<template>
  <div id="app">
    <h1>🧩 10-Photo Puzzle Game</h1>
    <h3 v-if="currentImageIndex < maxGames">
      Puzzle {{ currentImageIndex + 1 }} of {{ maxGames }}
    </h3>

    <div class="grid" v-if="!gameOver">
      <div
        v-for="(tile, index) in tiles"
        :key="index"
        class="tile"
        :class="{ selected: selectedIndex === index }"
        :style="getTileStyle(tile)"
        @click="selectTile(index)"
      ></div>
    </div>

    <div v-if="!gameOver">
      <button @click="shuffleTiles">🔀 Shuffle</button>
      <button @click="declareWin">✅ I Solved It!</button>
      <button @click="skipPuzzle">⏭️ Skip</button>
      <div class="message">{{ message }}</div>
    </div>

    <div v-if="gameOver">
      <h2>🎉 Game Over!</h2>
      <p>You completed {{ wins }} out of {{ maxGames }} puzzles!</p>
      <button @click="restartGame">🔁 Play Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const rows = 4
const cols = 4
const maxGames = 10

const currentImageIndex = ref(0)
const wins = ref(0)
const tiles = ref([])
const selectedIndex = ref(null)
const message = ref('')
const gameOver = ref(false)

const images = [
  { name: '1', url: 'figure1.jpg' },
  { name: '2', url: 'figure2.jpg' },
  { name: '3', url: 'figure3.jpg' },
  { name: '4', url: 'figure4.jpg' },
  { name: '5', url: 'figure5.jpg' },
  { name: '6', url: 'figure6.jpg' },
  { name: '7', url: 'figure7.jpg' },
  { name: '8', url: 'figure8.jpg' },
  { name: '9', url: 'figure9.jpg' },
  { name: '10', url: 'figure10.jpg' }
]

const currentImage = computed(() => images[currentImageIndex.value])

function initTiles() {
  tiles.value = Array.from({ length: rows * cols }, (_, i) => ({
    correctIndex: i,
    currentIndex: i
  }))
  shuffleTiles()
  selectedIndex.value = null
  message.value = ''
}

function shuffleTiles() {
  const shuffled = [...tiles.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  tiles.value = shuffled.map((tile, index) => ({
    ...tile,
    currentIndex: index
  }))
  selectedIndex.value = null
  message.value = 'Tiles shuffled!'
}

function getTileStyle(tile) {
  const row = Math.floor(tile.correctIndex / cols)
  const col = tile.correctIndex % cols
  return {
    backgroundImage: `url(${currentImage.value.url})`,
    backgroundPosition: `-${col * 100}px -${row * 100}px`
  }
}

function selectTile(index) {
  if (selectedIndex.value === null) {
    selectedIndex.value = index
  } else {
    const temp = tiles.value[selectedIndex.value]
    tiles.value[selectedIndex.value] = tiles.value[index]
    tiles.value[index] = temp
    selectedIndex.value = null
    checkSolved()
  }
}

function checkSolved() {
  const solved = tiles.value.every((tile, i) => tile.correctIndex === i)
  if (solved) {
    message.value = '🎉 Solved! Moving to next...'
    wins.value++
    setTimeout(() => nextPuzzle(), 1500)
  }
}

function declareWin() {
  message.value = '✅ Declared solved. Moving on...'
  wins.value++
  setTimeout(() => nextPuzzle(), 1500)
}

function skipPuzzle() {
  message.value = '⏭️ Skipping to next...'
  setTimeout(() => nextPuzzle(), 1000)
}

function nextPuzzle() {
  currentImageIndex.value++
  if (currentImageIndex.value >= maxGames) {
    gameOver.value = true
  } else {
    initTiles()
  }
}

function restartGame() {
  currentImageIndex.value = 0
  wins.value = 0
  gameOver.value = false
  initTiles()
}

onMounted(() => {
  initTiles()
})
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background: #f0f0f0;
  text-align: center;
  padding: 20px;
}
#app {
  max-width: 600px;
  margin: auto;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: repeat(4, 100px);
  gap: 2px;
  margin: 20px auto;
}
.tile {
  width: 100px;
  height: 100px;
  background-size: 400px 400px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  cursor: pointer;
}
.selected {
  outline: 3px solid red;
}
button {
  margin: 10px;
  padding: 10px 18px;
  font-size: 16px;
  cursor: pointer;
}
.message {
  font-weight: bold;
  color: green;
  margin-top: 10px;
}
</style>
