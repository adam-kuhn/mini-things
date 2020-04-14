import FlyingAgent from './flyingAgents'
const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')
ctx.font = '600 10px "Font Awesome 5 Free"'
// flyers within neighbour radius try to align themselves in the same orientation
const CANVAS_MARGIN = 0
const FLYER_AT_TOP = 'top'
const FLYER_AT_BOTTOM = 'bottom'
const FLYER_AT_LEFT_EDGE = 'left'
const FLYER_AT_RIGHT_EDGE = 'right'
const NEIGHBOUR_RADIUS = 30
const RADIANS_TO_DEGREES = 180 / Math.PI
const DEGREES_TO_RADIANS = Math.PI / 180
const MAX_VELOCITY = 3

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

const numberOfFliers = 3
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
    let {xPosition, yPosition} = currentFlyerPosition
    const flyersInNeighbourhood = self.filter((flyer2, idx2) => {
      if (idx !== idx2) {
        const neighbourFlyer = flyer2.getPosition()
        const distanceBetweenFlyers = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, neighbourFlyer)
        return distanceBetweenFlyers < NEIGHBOUR_RADIUS
      }
      return false
    })
    if (flyersInNeighbourhood.length) {
      const neighbourhoodVector = matchNeighbourhoodVector(flyer, flyersInNeighbourhood)
      console.log(neighbourhoodVector)
      // cohesion is the the center of all items in neighbourod, and the current agent should rotate to that point
      // should point of cohesion include the current flyer? NO
      const coehsionVector = getCohesionVector(flyer, flyersInNeighbourhood)
      // sepration is to prevent flyers from overcrowding to one area
      // this will be an average of the distance bewteen the current flyers and neighbours, and set to a negative value?
      const separationVector = getSeperationVector(flyer, flyersInNeighbourhood)
      console.log('sep', separationVector)
      const xVeloctiy = neighbourhoodVector.xVelocity + coehsionVector.xPosition + separationVector.xPosition
      const yVelocity = neighbourhoodVector.yVelocity + coehsionVector.yPosition + separationVector.yPosition

      flyer.velocity.xVelocity += xVeloctiy / 100
      flyer.velocity.yVelocity += yVelocity / 100
    }
    if (flyer.velocity.xVelocity > MAX_VELOCITY) {
      flyer.velocity.xVelocity = MAX_VELOCITY
    } else if (flyer.velocity.xVelocity < -MAX_VELOCITY) {
      flyer.velocity.xVelocity = -MAX_VELOCITY
    }
    if (flyer.velocity.yVelocity > MAX_VELOCITY) {
      flyer.velocity.yVelocity = MAX_VELOCITY
    } else if (flyer.velocity.yVelocity < -MAX_VELOCITY) {
      flyer.velocity.yVelocity = -MAX_VELOCITY
    }

    if (xPosition > canvas.width - CANVAS_MARGIN) {
      flyer.velocity.xVelocity *= -1
      xPosition = canvas.width
    } else if (xPosition < CANVAS_MARGIN) {
      flyer.velocity.xVelocity *= -1
      xPosition = 0
    }
    if (yPosition > canvas.height - CANVAS_MARGIN) {
      flyer.velocity.yVelocity *= -1
      yPosition = canvas.height
    } else if (yPosition < CANVAS_MARGIN) {
      flyer.velocity.yVelocity *= -1
      yPosition = 0
    }
    let newXPosition = flyer.velocity.xVelocity + xPosition
    let newYPosition = flyer.velocity.yVelocity + yPosition
    // this does not change orientation correctly
    const flyerOrientation = Math.atan(newXPosition / newYPosition) * RADIANS_TO_DEGREES
    flyer.setOrientation(flyerOrientation)
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

function matchNeighbourhoodVector (currentFlyer, neighborhoodFlyers) {
  const sumOfVelocities = neighborhoodFlyers.reduce((accumulated, current) => {
    return {
      xVelocity: accumulated.xVelocity + current.velocity.xVelocity,
      yVelocity: accumulated.yVelocity + current.velocity.yVelocity
    }
  }, {xVelocity: 0, yVelocity: 0})
  const averagerVelocity = {
    xVelocity: sumOfVelocities.xVelocity / neighborhoodFlyers.length,
    yVelocity: sumOfVelocities.yVelocity / neighborhoodFlyers.length
  }
  const matchedVelocity = {
    xVelocity: averagerVelocity.xVelocity - currentFlyer.velocity.xVelocity,
    yVelocity: averagerVelocity.yVelocity - currentFlyer.velocity.yVelocity
  }
  return matchedVelocity
}

function getCohesionVector (currentFlyer, neighborhoodFlyers) {
  const aggregateOfPosition = neighborhoodFlyers.reduce((accumulated, current) => {
    const currentPosition = current.getPosition()
    return {
      xPosition: accumulated.xPosition + currentPosition.xPosition,
      yPosition: accumulated.yPosition + currentPosition.yPosition
    }
  }, {xPosition: 0, yPosition: 0})
  const cohesionPoint = {
    xPosition: aggregateOfPosition.xPosition / neighborhoodFlyers.length,
    yPosition: aggregateOfPosition.yPosition / neighborhoodFlyers.length
  }
  const currentFlyerPosition = currentFlyer.getPosition()

  const cohesionVector = {
    xPosition: cohesionPoint.xPosition - currentFlyerPosition.xPosition,
    yPosition: cohesionPoint.yPosition - currentFlyerPosition.yPosition
  }
  return cohesionVector
}

function getSeperationVector (currentFlyer, neighborhoodFlyers) {
  const currentFlyerPosition = currentFlyer.getPosition()
  const seperationVector = neighborhoodFlyers.reduce((accumulated, current) => {
    const neighbourPosition = current.getPosition()
    const distanceBetweenFlyers = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, neighbourPosition)
    if (distanceBetweenFlyers <= 10) {
      return {
        xPosition: accumulated.xPosition - neighbourPosition.xPosition + currentFlyerPosition.xPosition,
        yPosition: accumulated.yPosition - neighbourPosition.yPosition + currentFlyerPosition.yPosition
      }
    }
    return accumulated
  }, {xPosition: 0, yPosition: 0})
  return seperationVector
}
