import {RADIANS_TO_DEGREES, MAX_VELOCITY, CANVAS_MARGIN, VELOCITY_CHANGE_AMOUNT} from './config/config'

export default class FlyingAgent {
  constructor (id, startingPosition, fillStyle) {
    this.id = id
    this.orientationInDegrees = 45
    this.dimensions = {
      width: 15,
      height: 10
    }
    this.currentPosition = {
      xPosition: startingPosition,
      yPosition: startingPosition
    }
    this.velocity = {
      xVelocity: 1,
      yVelocity: 0
    }
    this.fillStyle = fillStyle
  }
  updateCurrentPosition (canvas) {
    this._checkIfFlyerIsAtCanvasBoundary(canvas)
    this.currentPosition.xPosition += this.velocity.xVelocity / 5
    this.currentPosition.yPosition += this.velocity.yVelocity / 5
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
  getDimensions () {
    return this.dimensions
  }
  getFillStyle () {
    return this.fillStyle
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
  _checkIfFlyerIsAtCanvasBoundary (canvas) {
    const {xPosition, yPosition} = this.currentPosition
    if (xPosition > canvas.width - CANVAS_MARGIN) this._reduceXVelocity()
    else if (xPosition < CANVAS_MARGIN) this._increaseXVelocity()

    if (yPosition > canvas.height - CANVAS_MARGIN) this._reduceYVelocity()
    else if (yPosition < CANVAS_MARGIN) this._increaseYVelocity()
  }
  _reduceXVelocity () {
    this.velocity.xVelocity -= VELOCITY_CHANGE_AMOUNT
  }
  _reduceYVelocity () {
    this.velocity.yVelocity -= VELOCITY_CHANGE_AMOUNT
  }
  _increaseXVelocity () {
    this.velocity.xVelocity += VELOCITY_CHANGE_AMOUNT
  }
  _increaseYVelocity () {
    this.velocity.yVelocity += VELOCITY_CHANGE_AMOUNT
  }
}
