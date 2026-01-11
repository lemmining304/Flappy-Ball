const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = 360
canvas.height = 640

let ball, pipes, score, frame, running

const gravity = 0.45
const jump = -7.5
const gap = 150
const pipeWidth = 52
const speed = 2.2

function reset() {
ball = { x: 80, y: canvas.height / 2, r: 12, vy: 0 }
pipes = []
score = 0
frame = 0
running = true
}

function spawnPipe() {
const top = Math.random() * 220 + 60
pipes.push({ x: canvas.width, top, passed: false })
}

function update() {
if (!running) return

ball.vy += gravity
ball.y += ball.vy

if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
running = false
}

if (frame % 95 === 0) spawnPipe()

pipes.forEach(p => {
p.x -= speed

if (
ball.x + ball.r > p.x &&
ball.x - ball.r < p.x + pipeWidth &&
(ball.y - ball.r < p.top || ball.y + ball.r > p.top + gap)
) running = false

if (!p.passed && p.x + pipeWidth < ball.x) {
p.passed = true
score++
}
})

pipes = pipes.filter(p => p.x + pipeWidth > 0)

draw()
frame++
requestAnimationFrame(update)
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height)

ctx.fillStyle = "#ffcc00"
ctx.beginPath()
ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
ctx.fill()

ctx.fillStyle = "#2ecc71"
pipes.forEach(p => {
ctx.fillRect(p.x, 0, pipeWidth, p.top)
ctx.fillRect(p.x, p.top + gap, pipeWidth, canvas.height)
})

ctx.fillStyle = "#000"
ctx.font = "24px Arial"
ctx.fillText(score, 16, 32)

if (!running) {
ctx.font = "32px Arial"
ctx.fillText("Game Over", 90, 300)
ctx.font = "18px Arial"
ctx.fillText("Toque ou Espaço", 95, 335)
}
}

function flap() {
if (!running) reset()
ball.vy = jump
}

window.addEventListener("keydown", e => {
if (e.code === "Space") flap()
})

window.addEventListener("touchstart", e => {
e.preventDefault()
flap()
}, { passive: false })

reset()
update()
