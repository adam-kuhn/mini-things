import FlyingAgent from './flyingAgents'
const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')

// // test rotate
// ctx.fillStyle = '#FF0000'
// ctx.fillRect(10, 10, 10, 50)

// ctx.translate(5, 5)
// ctx.rotate(45 * Math.PI / 180)
// ctx.translate(-5, -5)
// ctx.fillRect(10, 10, 10, 50)
// ctx.fillStyle = 'blue'
// // ctx.rotate(-45 * Math.PI / 180)
// ctx.setTransform(1, 0, 0, 1, 0, 0) // so this sets the origin back to original. call this in my draw?

// ctx.fillRect(10, 10, 10, 50)

const numberOfFliers = 1
let flyingAgents = []
for (let i = 0; i < numberOfFliers; i++) {
  const startingPosition = i * 10
  const fillStyle = `#FF${i * 1000}`
  const newFlyer = new FlyingAgent(i, startingPosition, fillStyle)
  flyingAgents = [...flyingAgents, newFlyer]
}

flyingAgents.forEach(drawFlyer)

setInterval(() => moveRectangel(flyingAgents), 50)
function moveRectangel (flyingAgents) {
  flyingAgents.forEach((flyer, idx) => {
    let {xPosition, yPosition} = flyer.currentPosition
    const {width, height} = flyer.dimensions
    const yOriginForTranslate = yPosition + (height / 2)
    const flyerOrientation = flyer.getOrientation()

    // this rotates triangle to same position as when it is drawn
    ctx.translate(xPosition, yOriginForTranslate)
    ctx.rotate(flyerOrientation * Math.PI / 180)
    ctx.translate(-xPosition, -yOriginForTranslate)
    // clear rectangle
    ctx.clearRect(xPosition - (width / 2), yPosition, width, height)
    // reset canvas back to origin
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    // need to convert the positions to be something, that add 1 point of movement base on orientation
    // 0deg would mean 1 on x
    // x = positionConstanst * cos(deg)
    // y = positionConstant * sin(deg)
    const newXPosition = Math.floor(2 * Math.sin(flyerOrientation * Math.PI / 180) + xPosition) // floor to prevent extra dots being left from clear when drawing
    const newYPosition = Math.floor(2 * Math.cos(flyerOrientation * Math.PI / 180) + yPosition)
    // if (xPosition < 150 && yPosition === idx * 10) {
    //   xPosition += 10
    // }
    // if (xPosition === 150 && yPosition < 75) {
    //   yPosition += 5
    // }
    // if (yPosition === 75 && xPosition <= 150) {
    //   xPosition -= 10
    // }
    // if (xPosition === idx * 10 && yPosition <= 75) {
    //   yPosition -= 5
    // }
    flyer.setCurrentPosition(newXPosition, newYPosition)
    drawFlyer(flyer)
  })
}

// look into Path2D
function drawFlyer (flyer) {
  const {xPosition, yPosition} = flyer.currentPosition
  const {width, height} = flyer.dimensions
  const flyerOrientation = flyer.getOrientation()
  ctx.fillStyle = flyer.fillStyle
  const yOriginForTranslate = yPosition + (height / 2)
  ctx.translate(xPosition, yOriginForTranslate)
  ctx.rotate(flyerOrientation * Math.PI / 180)
  ctx.translate(-xPosition, -yOriginForTranslate)
  ctx.beginPath()
  ctx.moveTo(xPosition, yPosition)
  ctx.lineTo(xPosition + width / 2, yPosition + height)
  ctx.lineTo((xPosition - width / 2), yPosition + height)
  // ctx.closePath() // not needed if using fill
  ctx.fill()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
