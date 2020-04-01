import FlyingAgent from './flyingAgents'
const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')
ctx.font = '600 10px "Font Awesome 5 Free"'

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
    const flyerOrientation = flyer.getOrientation()

    // this rotates triangle to same position as when it is drawn
    rotateContextBasedOnOrientation(flyer)
    // clear rectangle
    ctx.clearRect(xPosition, yPosition - height + 1, width, height)
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
  ctx.fillStyle = flyer.fillStyle
  rotateContextBasedOnOrientation(flyer)
  ctx.fillText('\uf197', xPosition, yPosition)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function rotateContextBasedOnOrientation (flyer) {
  const {xPosition, yPosition} = flyer.currentPosition
  const {width, height} = flyer.dimensions
  const xOriginForTranslate = xPosition + (width / 2)
  const yOriginForTranslate = yPosition + (height / 2)
  const flyerOrientation = flyer.getOrientation()
  ctx.translate(xOriginForTranslate, yOriginForTranslate)
  ctx.rotate(flyerOrientation * Math.PI / 180)
  ctx.translate(-xOriginForTranslate, -yOriginForTranslate)
}
