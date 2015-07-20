namespace('News.Models')

News.Models.Globe = function(config) {

  this._on = {
    change: []
  }

  this.setDimensions = function(dimensions) {
    this.height = dimensions.height
    this.width  = dimensions.width

    this.recalculate()
  }

  this.recalculate = function() {
    this.projection = d3.geo.azimuthal()
      .scale(this.width / 2.5)
      .origin([-71.03, 42.37])
      .mode('orthographic')
      .translate([this.width / 2, this.height / 2])

    this.circle = d3.geo.greatCircle()
      .origin(this.projection.origin())

    this.path = d3.geo.path()
      .projection(this.projection)

    this.trigger('change')
  }

  this.getOrigin = function() {
    return this.projection.origin()
  }

  this.setOrigin = function(newOrigin) {
    this.projection.origin(newOrigin)
    this.circle.origin(newOrigin)
  }

  this.getTempOrigin = function() {
    return this.o0
  }

  this.setTempOrigin = function(newOrigin) {
    this.o0 = newOrigin
  }

  this.setMouse = function(coordinates) {
    this.m0 = coordinates
  }

  this.getMouse = function() {
    return this.m0
  }

  this.move = function(newMouse) {
    var m0 = this.getMouse(),
        m1 = newMouse,
        o0 = this.getTempOrigin()

    this.setOrigin([
      o0[0] + (m0[0] - m1[0]) / 8,
      o0[1] + (m1[1] - m0[1]) / 8
    ])
  }

  this.clip = function(datum) {
    return this.path(this.circle.clip(datum))
  }

  this.toJSON = function() {
    return {
      height: this.height,
      width:  this.width
    }
  }

  this.on = function(event, callback) {
    this._on[event].push(callback)
  }

  this.trigger = function(event, details) {
    for (var i = 0; i < this._on[event].length; i++) {
      this._on[event][i](details)
    }
  }
}
