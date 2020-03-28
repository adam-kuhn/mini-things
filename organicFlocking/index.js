const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#FF2304'
ctx.fillRect(0, 0, 150, 75)
const intervalId = setInterval(() => moveRectangel(), 0)
let x = 0
let y = 0
function moveRectangel () {
  ctx.clearRect(x, y, 150, 75)
  if (x < 150 && y === 0) {
    x += 10
  }
  if (x === 150 && y < 75) {
    y += 5
  }
  if (y === 75 && x <= 150) {
    x -= 10
  }
  if (x === 0 && y <= 75) {
    y -= 5
  }
  if (x === 0 && y === 0) {
    clearInterval(intervalId)
  }
  ctx.fillRect(x, y, 150, 75)
}
