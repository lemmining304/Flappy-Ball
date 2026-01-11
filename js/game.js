// Canvas
const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = 360
canvas.height = 640
canvas.style.display = "none" // inicialmente escondido

// Variáveis do jogo
let ball, pipes, score, highScore, frame, running, mode
const gravity = 0.45
const jump = -7.5
let gap = 150
let pipeWidth = 52
let speed = 2.2
let animationFrameId = null // para controlar requestAnimationFrame

// Sons
const soundJump = new Audio("assets/jump.wav")
const soundHit = new Audio("assets/hit.wav")
const soundScore = new Audio("assets/score.wav")

// Menu
const menu = document.getElementById("menu")
const modeSelect = document.getElementById("modeSelect")
const playBtn = document.getElementById("playBtn")
const classicBtn = document.getElementById("classicBtn")
const challengeBtn = document.getElementById("challengeBtn")

// Menu principal
playBtn.addEventListener("click", () => {
  menu.classList.add("hidden")
  modeSelect.classList.remove("hidden")
})

classicBtn.addEventListener("click", () => {
  mode = "classic"
  startGame()
})

challengeBtn.addEventListener("click", () => {
  mode = "challenge"
  startGame()
})

// Inicia o jogo
function startGame() {
  canvas.style.display = "block"
  modeSelect.classList.add("hidden")
  reset()
  // já cria um cano inicial para não aparecer só céu
  spawnPipe()
  if (animationFrameId) cancelAnimationFrame(animationFrameId) // evita múltiplos loops
  update()
}

// Reinicia o jogo
function reset() {
  ball = { x: 80, y: canvas.height / 2, r: 12, vy: 0 }
  pipes = []
  score = 0
  frame = 0
  running = true
  highScore = parseInt(localStorage.getItem("flappyHighScore")) || 0

  // Ajustes do modo desafio
  if (mode === "challenge") {
    gap = 120
    speed = 3
  } else {
    gap = 150
    speed = 2.2
  }
}

// Cria um cano
function spawnPipe() {
  const top = Math.random() * 220 + 60
  pipes.push({ x: canvas.width, top, passed: false })
}

// Loop principal
function update() {
  if (!running) return

  ball.vy += gravity
  ball.y += ball.vy

  // Colisão com chão/teto
  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    endGame()
  }

  // Spawn canos
  if (frame % 95 === 0) spawnPipe()

  // Atualiza canos
  pipes.forEach(p => {
    p.x -= speed

    // Colisão com canos
    if (
      ball.x + ball.r > p.x &&
      ball.x - ball.r < p.x + pipeWidth &&
      (ball.y - ball.r < p.top || ball.y + ball.r > p.top + gap)
    ) {
      endGame()
    }

    // Pontuação
    if (!p.passed && p.x + pipeWidth < ball.x) {
      p.passed = true
      score++
      soundScore.currentTime = 0
      soundScore.play()
    }
  })

  // Remove canos fora da tela
  pipes = pipes.filter(p => p.x + pipeWidth > 0)

  draw()
  frame++
  animationFrameId = requestAnimationFrame(update)
}

// Desenha tudo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Fundo (céu)
  ctx.fillStyle = "#87CEEB"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Bola
  ctx.fillStyle = "#ffcc00"
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
  ctx.fill()

  // Canos
  ctx.fillStyle = "#2ecc71"
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, pipeWidth, p.top)
    ctx.fillRect(p.x, p.top + gap, pipeWidth, canvas.height)
  })

  // Pontuação
  ctx.fillStyle = "#000"
  ctx.font = "24px Arial"
  ctx.fillText(`Score: ${score}`, 16, 32)
  ctx.fillText(`High Score: ${highScore}`, 16, 60)

  // Game over
  if (!running) {
    ctx.font = "32px Arial"
    ctx.fillText("Game Over", 90, 300)
    ctx.font = "18px Arial"
    ctx.fillText("Toque ou Espaço", 95, 335)
  }
}

// Fim do jogo
function endGame() {
  running = false
  soundHit.currentTime = 0
  soundHit.play()
  if (score > highScore) {
    highScore = score
    localStorage.setItem("flappyHighScore", highScore)
  }
}

// Pulo
function flap() {
  if (!running) {
    reset()
    canvas.style.display = "block"
    spawnPipe() // gera pelo menos 1 cano
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    update()
  }
  ball.vy = jump
  soundJump.currentTime = 0
  soundJump.play()
}

// Eventos
window.addEventListener("keydown", e => {
  if (e.code === "Space") flap()
})

window.addEventListener(
  "touchstart",
  e => {
    e.preventDefault()
    flap()
  },
  { passive: false }
)
