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

flyingAgents.forEach((flyer) => {
  ctx.fillStyle = flyer.fillStyle
  ctx.fillRect(flyer.currentPosition.xPosition, flyer.currentPosition.yPosition, flyer.dimensions.width, flyer.dimensions.height)
})

setInterval(() => moveRectangel(flyingAgents), 100)
function moveRectangel (flyingAgents) {
  flyingAgents.forEach((flyer, idx) => {
    ctx.clearRect(flyer.currentPosition.xPosition, flyer.currentPosition.yPosition, flyer.dimensions.width, flyer.dimensions.height)
    let {xPosition} = flyer.currentPosition
    let {yPosition} = flyer.currentPosition
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
    ctx.fillStyle = flyer.fillStyle
    ctx.fillRect(xPosition, yPosition, flyer.dimensions.width, flyer.dimensions.height)
  })
}
