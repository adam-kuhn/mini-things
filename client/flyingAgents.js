import {RADIANS_TO_DEGREES} from './config/config'

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
    this._setOrientation()
  }
  getOrientation () {
    return this.orientationInDegrees
  }
  getPosition () {
    return this.currentPosition
  }
  _setOrientation () {
    const {xVelocity, yVelocity} = this.velocity
    let flyerOrientation = Math.atan(yVelocity / xVelocity) * RADIANS_TO_DEGREES
    // canvas origin (0, 0) is top left, so need to add 180 TODO: Math to confirm understanding
    if (xVelocity < 0) {
      flyerOrientation += 180
    }
    this.orientationInDegrees = flyerOrientation
  }
}
