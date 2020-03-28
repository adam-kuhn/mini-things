import FlyingAgent from './flyingAgents'
const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')

const numberOfFliers = 10
let flyingAgents = []
for (let i = 0; i < numberOfFliers; i++) {
  const startingPosition = i * 10
  const fillStyle = `#FF${i * 1000}`
  const newFlyer = new FlyingAgent(i, startingPosition, fillStyle)
  flyingAgents = [...flyingAgents, newFlyer]
}

flyingAgents.forEach(drawFlyer)

setInterval(() => moveRectangel(flyingAgents), 100)
function moveRectangel (flyingAgents) {
  flyingAgents.forEach((flyer, idx) => {
    let {xPosition, yPosition} = flyer.currentPosition
    const {width, height} = flyer.dimensions
    ctx.clearRect(xPosition - (width / 2), yPosition, width, height)
    if (xPosition < 150 && yPosition === idx * 10) {
      xPosition += 10
    }
    if (xPosition === 150 && yPosition < 75) {
      yPosition += 5
    }
    if (yPosition === 75 && xPosition <= 150) {
      xPosition -= 10
    }
    if (xPosition === idx * 10 && yPosition <= 75) {
      yPosition -= 5
    }
    flyer.setCurrentPosition(xPosition, yPosition)
    drawFlyer(flyer)
  })
}

function drawFlyer (flyer) {
  const {xPosition, yPosition} = flyer.currentPosition
  const {width, height} = flyer.dimensions
  ctx.fillStyle = flyer.fillStyle
  ctx.beginPath()
  ctx.moveTo(xPosition, yPosition)
  ctx.lineTo(xPosition + width / 2, yPosition + height)
  ctx.lineTo((xPosition - width / 2), yPosition + height)
  ctx.closePath()
  ctx.fill()
}
