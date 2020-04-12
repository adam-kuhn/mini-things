import FlyingAgent from './flyingAgents'
const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')
ctx.font = '600 10px "Font Awesome 5 Free"'
// flyers within neighbour radius try to align themselves in the same orientation
const NEIGHBOUR_RADIUS = 30
const RADIANS_TO_DEGREES = 180 / Math.PI
const DEGREES_TO_RADIANS = Math.PI / 180

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
  moveRectangel(flyingAgents)
  window.requestAnimationFrame(animationFrame)
}

function clearCanvas () {
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'green'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function moveRectangel (flyingAgents) {
  flyingAgents.forEach((flyer, idx, self) => {
    const currentFlyerPosition = flyer.getPosition()
    const {xPosition, yPosition} = currentFlyerPosition
    if (yPosition >= canvas.height - 20) {
      flyer.setOrientation(180)
    }
    if (yPosition >= canvas.height - 20 && xPosition <= 20) {
      flyer.setOrientation(315)
    }
    if (yPosition <= 20) {
      flyer.setOrientation(60)
    }
    const flyersInNeighbourhood = self.filter((flyer2, idx2) => {
      if (idx !== idx2) {
        const neighbourFlyer = flyer2.getPosition()
        const distanceBetweenFlyers = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, neighbourFlyer)
        return distanceBetweenFlyers < NEIGHBOUR_RADIUS
      }
      return false
    })
    if (flyersInNeighbourhood.length) {
      const averageAlignment = getAverageOrientation(flyersInNeighbourhood)
      console.log(averageAlignment)
      // cohesion is the the center of all items in neighbourod, and the current agent should rotate to that point
      // should point of cohesion include the current flyer?
      const pointOfCohesion = getPointOfCohesion(flyersInNeighbourhood)
      const distanceToPointOfCohesion = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, pointOfCohesion)
      const angleToPointOfCohesion = Math.acos((currentFlyerPosition.xPosition - pointOfCohesion.xPosition) / distanceToPointOfCohesion) * RADIANS_TO_DEGREES

      console.log(pointOfCohesion, angleToPointOfCohesion)
    }

    console.log('flyer ', flyer.id, 'has neightbours ', flyersInNeighbourhood)
    const flyerOrientation = flyer.getOrientation()

    const newXPosition = Math.floor(2 * Math.cos(flyerOrientation * DEGREES_TO_RADIANS) + xPosition) // floor to prevent extra dots being left from clear when drawing
    const newYPosition = Math.floor(2 * Math.sin(flyerOrientation * DEGREES_TO_RADIANS) + yPosition)

    flyer.setCurrentPosition(newXPosition, newYPosition)
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

function calculateDistanceBetweenTwoFlyers (currentFlyerPosition, neighbourFlyerPosition) {
  const yDifference = neighbourFlyerPosition.yPosition - currentFlyerPosition.yPosition
  const xDifference = neighbourFlyerPosition.xPosition - currentFlyerPosition.xPosition
  // a^2 + b^2 = c^2
  const distanceBetweenFlyers = Math.sqrt(Math.pow(yDifference, 2) + Math.pow(xDifference, 2))
  return distanceBetweenFlyers
}

function getAverageOrientation (neighborhoodFlyers) {
  const averageOrientation = neighborhoodFlyers.reduce((accumulated, current) => {
    return current.getOrientation() + accumulated
  }, 0) / neighborhoodFlyers.length
  return averageOrientation
}

function getPointOfCohesion (neighborhoodFlyers) {
  const aggregateOfPosition = neighborhoodFlyers.reduce((accumulated, current) => {
    const currentPosition = current.getPosition()
    return {
      xPosition: accumulated.xPosition + currentPosition.xPosition,
      yPosition: accumulated.yPosition + currentPosition.yPosition
    }
  }, {xPosition: 0, yPosition: 0})
  const pointOfCohesion = {
    xPosition: aggregateOfPosition.xPosition / neighborhoodFlyers.length,
    yPosition: aggregateOfPosition.yPosition / neighborhoodFlyers.length
  }
  return pointOfCohesion
}
