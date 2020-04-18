import {NEIGHBOUR_RADIUS, DEGREES_TO_RADIANS} from './config/config'
import {calculateDistanceBetweenTwoFlyers, matchNeighbourhoodVector,
  getCohesionVector, getSeperationVector} from './utils/vectorHelpers'
import FlyingAgent from './flyingAgents'

const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')

const numberOfFliers = 30
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
    flyer.updateCurrentPosition(canvas)
    drawFlyer(flyer)
  })
}

// look into Path2D
function drawFlyer (flyer) {
  rotateContextBasedOnOrientation(flyer)
  drawFlyerShape(flyer)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function rotateContextBasedOnOrientation (flyer) {
  const {xPosition, yPosition} = flyer.getPosition()
  const {width} = flyer.getDimensions()
  const xOriginForTranslate = xPosition - (width / 2)
  const flyerOrientation = flyer.getOrientation()
  ctx.translate(xOriginForTranslate, yPosition)
  ctx.rotate(flyerOrientation * DEGREES_TO_RADIANS)
  ctx.translate(-xOriginForTranslate, -yPosition)
}
function drawFlyerShape (flyer) {
  const {xPosition, yPosition} = flyer.getPosition()
  const {width, height} = flyer.getDimensions()
  ctx.fillStyle = flyer.getFillStyle()
  ctx.beginPath()
  ctx.moveTo(xPosition + width / 3, yPosition)
  ctx.lineTo(xPosition - width * 2 / 3, yPosition - height / 2)
  ctx.lineTo(xPosition - width * 2 / 3, yPosition + height / 2)
  ctx.fill()
}
