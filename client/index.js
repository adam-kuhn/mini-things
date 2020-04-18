import {CANVAS_MARGIN, NEIGHBOUR_RADIUS, DEGREES_TO_RADIANS} from './config/config'
import {calculateDistanceBetweenTwoFlyers, matchNeighbourhoodVector,
  getCohesionVector, getSeperationVector} from './utils/vectorHelpers'
import FlyingAgent from './flyingAgents'

const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')
ctx.font = '600 10px "Font Awesome 5 Free"'

const numberOfFliers = 10
let flyingAgents = []
for (let i = 0; i < numberOfFliers; i++) {
  const startingPosition = i * 10
  const fillStyle = `#FF${i * 1000}`
  const newFlyer = new FlyingAgent(i, startingPosition, fillStyle)
  flyingAgents = [...flyingAgents, newFlyer]
}

flyingAgents.forEach(drawFlyer)

window.requestAnimationFrame(animationFrame)
function animationFrame () {
  clearCanvas()
  drawCanvas(flyingAgents)
  window.requestAnimationFrame(animationFrame)
}

function clearCanvas () {
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'green'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCanvas (flyingAgents) {
  flyingAgents.forEach((flyer, idx, self) => {
    const currentFlyerPosition = flyer.getPosition()
    const flyersInNeighbourhood = self.filter((flyer2, idx2) => {
      if (idx !== idx2) {
        const neighbourFlyer = flyer2.getPosition()
        const distanceBetweenFlyers = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, neighbourFlyer)
        return distanceBetweenFlyers < NEIGHBOUR_RADIUS
      }
      return false
    })
    if (flyersInNeighbourhood.length) {
      // flyer tries to match velocity of other agents in neighbourhood
      const neighbourhoodVector = matchNeighbourhoodVector(flyer, flyersInNeighbourhood)
      // cohesion is the the center of all items in neighbourod, and the current agent should rotate to that point
      const coehsionVector = getCohesionVector(flyer, flyersInNeighbourhood)
      // sepration is to prevent flyers from overcrowding to one area
      const separationVector = getSeperationVector(flyer, flyersInNeighbourhood)
      const xVeloctiy = neighbourhoodVector.xVelocity + coehsionVector.xPosition + separationVector.xPosition
      const yVelocity = neighbourhoodVector.yVelocity + coehsionVector.yPosition + separationVector.yPosition
      flyer.setVelocity(xVeloctiy, yVelocity)
    }
    checkIfFlyerIsAtCanvasBoundary(flyer)
    flyer.updateCurrentPosition()
    drawFlyer(flyer)
  })
}

// look into Path2D
function drawFlyer (flyer) {
  const {xPosition, yPosition} = flyer.currentPosition
  ctx.fillStyle = flyer.fillStyle
  rotateContextBasedOnOrientation(flyer)
  // TODO: Either draw custom shape and remove space ship or fix alignment
  // text is drawn above a horizontal from the origin. Resulting in the space ship,
  // be slightly off the correct orietation in which it is moving
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
  ctx.rotate(flyerOrientation * DEGREES_TO_RADIANS)
  ctx.translate(-xOriginForTranslate, -yOriginForTranslate)
}

function checkIfFlyerIsAtCanvasBoundary (flyer) {
  const {xPosition, yPosition} = flyer.getPosition()
  if (xPosition > canvas.width - CANVAS_MARGIN) {
    flyer.reverseXVelocityDirection()
    flyer.setSpecificXPosition(canvas.width)
  } else if (xPosition < CANVAS_MARGIN) {
    flyer.reverseXVelocityDirection()
    flyer.setSpecificXPosition(0)
  }
  if (yPosition > canvas.height - CANVAS_MARGIN) {
    flyer.reverseYVelocityDirection()
    flyer.setSpecificYPosition(canvas.height)
  } else if (yPosition < CANVAS_MARGIN) {
    flyer.reverseYVelocityDirection()
    flyer.setSpecificYPosition(0)
  }
}
