import FlyingAgent from './flyingAgents'
const canvas = document.getElementById('flocking-behaviour')
const ctx = canvas.getContext('2d')
ctx.font = '600 10px "Font Awesome 5 Free"'
// flyers within neighbour radius try to align themselves in the same orientation
const CANVAS_MARGIN = 20
const FLYER_AT_TOP = 'top'
const FLYER_AT_BOTTOM = 'bottom'
const FLYER_AT_LEFT_EDGE = 'left'
const FLYER_AT_RIGHT_EDGE = 'right'
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

const numberOfFliers = 50
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
    const flyerAtCanvasEdge = isCurrentyFlyerAtEdgeOfCanvas(flyer)
    let flyerOrientation = flyer.getOrientation()
    if (flyerAtCanvasEdge) {
      flyerOrientation = getOrientationFromEdge(flyerAtCanvasEdge, flyerOrientation)
    } else {
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
        // sepration is to prevent flyers from overcrowding to one area
        // this will be an average of the distance bewteen the current flyers and neighbours, and set to a negative value?
        const seperationAngle = getSeperationAngle(flyer, flyersInNeighbourhood)
        console.log('sep', seperationAngle)
        flyerOrientation = (averageAlignment + angleToPointOfCohesion + seperationAngle) / 3
        console.log(flyerOrientation)
      }
    }

    flyer.setOrientation(flyerOrientation)
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

function getSeperationAngle (currentFlyer, neighborhoodFlyers) {
  const currentFlyerPosition = currentFlyer.getPosition()
  const aggregatedSeperationPositon = neighborhoodFlyers.reduce((accumulated, current) => {
    const neighbourPosition = current.getPosition()
    return {
      xPosition: accumulated.xPosition + currentFlyerPosition.xPosition - neighbourPosition.xPosition,
      yPosition: accumulated.yPosition + currentFlyerPosition.yPosition - neighbourPosition.yPosition
    }
  }, {xPosition: 0, yPosition: 0})
  const pointOfSeperation = {
    xPosition: aggregatedSeperationPositon.xPosition / neighborhoodFlyers.length * -1,
    yPosition: aggregatedSeperationPositon.yPosition / neighborhoodFlyers.length * -1
  }
  const distanceToPointOfSeperation = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, pointOfSeperation)
  const angleToPointOfCohesion = Math.acos((currentFlyerPosition.xPosition - pointOfSeperation.xPosition) / distanceToPointOfSeperation) * RADIANS_TO_DEGREES
  return angleToPointOfCohesion
}

function isCurrentyFlyerAtEdgeOfCanvas (flyer) {
  const {xPosition, yPosition} = flyer.getPosition()
  if (xPosition <= CANVAS_MARGIN) {
    return FLYER_AT_LEFT_EDGE
  }
  if (xPosition >= canvas.width - CANVAS_MARGIN) {
    return FLYER_AT_RIGHT_EDGE
  }
  if (yPosition <= CANVAS_MARGIN) {
    return FLYER_AT_TOP
  }
  if (yPosition >= canvas.height - CANVAS_MARGIN) {
    return FLYER_AT_BOTTOM
  }
  return null
}

//TODO: flyers getting stuck at edge when multiple end up with in the margin
// need to over ride behaviour somehow. May just need to make the neighbourhood radius smaller
// then the margin

function getOrientationFromEdge (edge, flyerOrientation) {
  let minAngle
  let maxAngle
  switch (edge) {
    case FLYER_AT_LEFT_EDGE:
      if (flyerOrientation >= 180) {
        minAngle = 270
        maxAngle = 360
      } else {
        minAngle = 0
        maxAngle = 90
      }
      break
    case FLYER_AT_RIGHT_EDGE:
      if (flyerOrientation >= 270) {
        maxAngle = 270
        minAngle = 180
      } else {
        minAngle = 90
        maxAngle = 180
      }
      break
    case FLYER_AT_BOTTOM:
      if (flyerOrientation <= 90) {
        minAngle = 270
        maxAngle = 360
      } else {
        minAngle = 180
        maxAngle = 270
      }
      break
    case FLYER_AT_TOP:
      if (flyerOrientation >= 270) {
        minAngle = 0
        maxAngle = 90
      } else {
        minAngle = 90
        maxAngle = 180
      }
  }
  const newOrientation = getRandomAngle(minAngle, maxAngle)
  console.log(newOrientation)
  return newOrientation
}

function getRandomAngle (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
