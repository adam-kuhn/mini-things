import {RADIANS_TO_DEGREES, MAX_VELOCITY, CANVAS_MARGIN, VELOCITY_CHANGE_AMOUNT} from './config/config'

export default class FlyingAgent {
  constructor (id, startingPosition, fillStyle) {
    this.id = id
    this._orientationInDegrees = 45
    this._dimensions = {
      width: 15,
      height: 10
    }
    this._currentPosition = {
      xPosition: startingPosition,
      yPosition: startingPosition
    }
    this._velocity = {
      xVelocity: 1,
      yVelocity: 0
    }
    this.fillStyle = fillStyle
  }
  updateCurrentPosition (canvas) {
    this._checkIfFlyerIsAtCanvasBoundary(canvas)
    this._currentPosition.xPosition += this._velocity.xVelocity / 5
    this._currentPosition.yPosition += this._velocity.yVelocity / 5
    this._setOrientation()
  }
  setVelocity (x, y) {
    this._velocity.xVelocity += x / 100
    this._velocity.yVelocity += y / 100
    this._limitVelocity()
  }
  getOrientation () {
    return this.orientationInDegrees
  }
  getPosition () {
    return this._currentPosition
  }
  getVelocity () {
    return this._velocity
  }
  getDimensions () {
    return this._dimensions
  }
  getFillStyle () {
    return this.fillStyle
  }
  _setOrientation () {
    const {xVelocity, yVelocity} = this._velocity
    let flyerOrientation = Math.atan(yVelocity / xVelocity) * RADIANS_TO_DEGREES
    // canvas origin (0, 0) is top left, so need to add 180 TODO: Math to confirm understanding
    if (xVelocity < 0) {
      flyerOrientation += 180
    }
    this.orientationInDegrees = flyerOrientation
  }
  _limitVelocity () {
    const {xVelocity, yVelocity} = this._velocity
    if (xVelocity > MAX_VELOCITY) this._setXVelocity(MAX_VELOCITY)
    else if (xVelocity < -MAX_VELOCITY) this._setXVelocity(-MAX_VELOCITY)

    if (yVelocity > MAX_VELOCITY) this._setYVelocity(MAX_VELOCITY)
    else if (yVelocity < -MAX_VELOCITY) this._setYVelocity(-MAX_VELOCITY)
  }
  _checkIfFlyerIsAtCanvasBoundary (canvas) {
    const {xPosition, yPosition} = this._currentPosition
    if (xPosition > canvas.width - CANVAS_MARGIN) this._reduceXVelocity()
    else if (xPosition < CANVAS_MARGIN) this._increaseXVelocity()

    if (yPosition > canvas.height - CANVAS_MARGIN) this._reduceYVelocity()
    else if (yPosition < CANVAS_MARGIN) this._increaseYVelocity()
  }
  _setXVelocity (velocity) {
    this._velocity.xVelocity = velocity
  }
  _setYVelocity (velocity) {
    this._velocity.yVelocity = velocity
  }
  _reduceXVelocity () {
    this._velocity.xVelocity -= VELOCITY_CHANGE_AMOUNT
  }
  _reduceYVelocity () {
    this._velocity.yVelocity -= VELOCITY_CHANGE_AMOUNT
  }
  _increaseXVelocity () {
    this._velocity.xVelocity += VELOCITY_CHANGE_AMOUNT
  }
  _increaseYVelocity () {
    this._velocity.yVelocity += VELOCITY_CHANGE_AMOUNT
  }
}
