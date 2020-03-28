export default class FlyingAgent {
  constructor (id, startingPosition, fillStyle) {
    this.id = id
    this.dimensions = {
      width: 10,
      height: 10
    }
    this.currentPosition = {
      xPosition: startingPosition,
      yPosition: startingPosition
    }
    this.fillStyle = fillStyle
  }
  setCurrentPosition (x, y) {
    this.currentPosition.xPosition = x
    this.currentPosition.yPosition = y
  }
  getOrientation () {
    // return direction
  }
  getPosition () {
    // return current position
  }
}
