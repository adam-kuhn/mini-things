const MIN_DISTANCE_BETWEEN_FLYERS = 17

export function calculateDistanceBetweenTwoFlyers (currentFlyerPosition, neighbourFlyerPosition) {
  const yDifference = neighbourFlyerPosition.yPosition - currentFlyerPosition.yPosition
  const xDifference = neighbourFlyerPosition.xPosition - currentFlyerPosition.xPosition
  // a^2 + b^2 = c^2
  const distanceBetweenFlyers = Math.sqrt(Math.pow(yDifference, 2) + Math.pow(xDifference, 2))
  return distanceBetweenFlyers
}

export function matchNeighbourhoodVector (currentFlyer, neighborhoodFlyers) {
  const {xVelocity, yVelocity} = currentFlyer.getVelocity()
  const sumOfVelocities = neighborhoodFlyers.reduce((accumulated, current) => {
    const {xVelocity, yVelocity} = current.getVelocity()
    return {
      xVelocity: accumulated.xVelocity + xVelocity,
      yVelocity: accumulated.yVelocity + yVelocity
    }
  }, {xVelocity: 0, yVelocity: 0})
  const averagerVelocity = {
    xVelocity: sumOfVelocities.xVelocity / neighborhoodFlyers.length,
    yVelocity: sumOfVelocities.yVelocity / neighborhoodFlyers.length
  }
  const matchedVelocity = {
    xVelocity: averagerVelocity.xVelocity - xVelocity,
    yVelocity: averagerVelocity.yVelocity - yVelocity
  }
  return matchedVelocity
}

export function getCohesionVector (currentFlyer, neighborhoodFlyers) {
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
    xPosition: (cohesionPoint.xPosition - currentFlyerPosition.xPosition) / 100,
    yPosition: (cohesionPoint.yPosition - currentFlyerPosition.yPosition) / 100
  }
  return cohesionVector
}

export function getSeperationVector (currentFlyer, neighborhoodFlyers) {
  const currentFlyerPosition = currentFlyer.getPosition()
  const seperationVector = neighborhoodFlyers.reduce((accumulated, current) => {
    const neighbourPosition = current.getPosition()
    const distanceBetweenFlyers = calculateDistanceBetweenTwoFlyers(currentFlyerPosition, neighbourPosition)
    if (distanceBetweenFlyers <= MIN_DISTANCE_BETWEEN_FLYERS) {
      return {
        xPosition: accumulated.xPosition - neighbourPosition.xPosition + currentFlyerPosition.xPosition,
        yPosition: accumulated.yPosition - neighbourPosition.yPosition + currentFlyerPosition.yPosition
      }
    }
    return accumulated
  }, {xPosition: 0, yPosition: 0})
  return seperationVector
}
