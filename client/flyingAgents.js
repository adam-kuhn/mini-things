export default class FlyingAgent {
  constructor (id, startingPosition, fillStyle) {
    this.id = id
    this.orientationInDegrees = 45
    this.dimensions = {
      width: 10,
      height: 10
    }
    this.currentPosition = {
      xPosition: startingPosition,
      yPosition: startingPosition
    }
    this.velocity = {
      xVelocity: 0.1,
      yVelocity: 0.5
    }
    this.fillStyle = fillStyle
  }
  setCurrentPosition (x, y) {
    this.currentPosition.xPosition = x
    this.currentPosition.yPosition = y
  }
  getOrientation () {
    return this.orientationInDegrees
  }
  setOrientation (orientation) {
    this.orientationInDegrees = orientation
  }
  getPosition () {
    return this.currentPosition
  }
}
