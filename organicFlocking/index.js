const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')

class FlyingAgents {
  constructor (id, startingPosition, fillStyle) {
    this.id = id
    this.dimensions = {
      width: 10,
      height: 10
    }
    this.currentPosition = {
      xPosition: startingPosition,
      yPosition: startingPosition
    }
    this.fillStyle = fillStyle
  }
  setCurrentPosition (x, y) {
    this.currentPosition.xPosition = x
    this.currentPosition.yPosition = y
  }
  getOrientation () {
    // return direction
  }
  getPosition () {
    // return current position
  }
}

const numberOfFliers = 10
let flyingAgents = []
for (let i = 0; i < numberOfFliers; i++) {
  const startingPosition = i * 10
  const fillStyle = `#FF${i * 1000}`
  const newFlyer = new FlyingAgents(i, startingPosition, fillStyle)
  flyingAgents = [...flyingAgents, newFlyer]
}

// ctx.fillStyle = '#FF2304'

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
