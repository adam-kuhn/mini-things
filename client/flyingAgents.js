import {RADIANS_TO_DEGREES, MAX_VELOCITY} from './config/config'

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
  updateCurrentPosition () {
    this.currentPosition.xPosition += this.velocity.xVelocity
    this.currentPosition.yPosition += this.velocity.yVelocity
    this._setOrientation()
  }
  setVelocity (x, y) {
    this.velocity.xVelocity += x / 100
    this.velocity.yVelocity += y / 100
    this._limitVelocity()
  }
  getOrientation () {
    return this.orientationInDegrees
  }
  getPosition () {
    return this.currentPosition
  }
  reverseXVelocityDirection () {
    this.velocity.xVelocity *= -1
  }
  reverseYVelocityDirection () {
    this.velocity.yVelocity *= -1
  }
  setSpecificXPosition (position) {
    this.currentPosition.xPosition = position
  }
  setSpecificYPosition (position) {
    this.currentPosition.yPosition = position
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
  _limitVelocity () {
    if (this.velocity.xVelocity > MAX_VELOCITY) this.velocity.xVelocity = MAX_VELOCITY
    else if (this.velocity.xVelocity < -MAX_VELOCITY) this.velocity.xVelocity = -MAX_VELOCITY
    if (this.velocity.yVelocity > MAX_VELOCITY) this.velocity.yVelocity = MAX_VELOCITY
    else if (this.velocity.yVelocity < -MAX_VELOCITY) this.velocity.yVelocity = -MAX_VELOCITY
  }
}
