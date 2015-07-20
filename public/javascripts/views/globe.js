namespace('News.Views')

News.Views.Globe = function(config) {
  this.el        = config.el
  this.model     = config.model
  this.countries = config.countries

  this._on = {
    select: []
  }

  this.initialize = function() {
    this.setListeners()
  }

  this.setListeners = function() {
    this.model.on('change', this.render.bind(this))
    this.el.on('mousedown', this.handleMouseDown.bind(this))
  }

  this.handleMouseDown = function() {
    this.model.setMouse([d3.event.pageX, d3.event.pageY])
    this.model.setTempOrigin(this.model.getOrigin())
    d3.event.preventDefault()
  }

  this.handleMouseMove = function() {
    if (this.model.getTempOrigin()) {
      this.model.move([d3.event.pageX, d3.event.pageY])
      this.refresh()
    }
  }

  this.handleMouseUp = function() {
    if (this.model.getMouse()) {
      this.handleMouseMove()
      this.model.setMouse(null)
    }
  }

  this.handleDoubleClick = function(country, node) {
    if (country && country.properties && country.properties.name) {
      this.trigger('select', country.properties.name)
      this.setActiveCountry(country.id)
      this.render()
    }
  }

  this.setActiveCountry = function(country) {
    this.active = country
  }

  this.refresh = function(duration) {
    if (duration) {
      var feature = this.feature.transition().duration(duration)
    } else {
      var feature = this.feature
    }

    feature.attr('d', this.model.clip.bind(this.model))
  }

  this.render = function() {
    var model = this.model.toJSON()

    this.el.selectAll('path').remove()

    this.el
      .attr('width',  model.width)
      .attr('height', model.height)

    this.feature = this.el.selectAll('path')
      .data(this.countries.features)
      .enter().append('svg:path')
      .attr('d', this.model.clip.bind(this.model))
      .attr('data-id', function(d) {
        return d.id
      })

    this.feature.append('svg:title')
      .text(function(d) {
        return d.properties.name
      })

    d3.selectAll('path').classed('active', false)
    d3.select('path[data-id=' + this.active + ']').classed('active', true)

    var self = this

    d3.selectAll('path').on('dblclick', function(event) {
      self.handleDoubleClick(event, this)
    })
  }

  this.on = function(event, callback) {
    this._on[event].push(callback)
  }

  this.trigger = function(event, details) {
    for (var i = 0; i < this._on[event].length; i++) {
      this._on[event][i](details)
    }
  }

  this.initialize()
}
