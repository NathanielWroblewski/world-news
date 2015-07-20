namespace('News.Views')

News.Views.Articles = function(config) {
  this.el = config.el
  this.collection = config.collection
  this.children = []
  this.view = config.view

  this.initialize = function() {
    this.initializeChildrenViews(this.collection.toJSON())
    this.setListeners()
  }

  this.initializeChildrenViews = function(articles) {
    this.children = []

    for (var i = 0; i < articles.length; i++) {
      var view = new this.view({
        model: new this.collection.model(articles[i])
      })

      this.children.push(view)
    }
  }

  this.setListeners = function() {
    this.collection.on('change', this.render.bind(this))
    this.collection.on('loading', this.render.bind(this))
  }

  this.template = function(articles) {
    var html = ''

    for (var i = 0; i < articles.length; i++) {
      html += articles[i].render()
    }
    return html
  }

  this.loadingTemplate = function() {
    return '<img class="loading" src="/public/images/spinner.gif" />'
  }

  this.render = function() {
    if (this.collection.toJSON().length) {
      this.initializeChildrenViews(this.collection.toJSON())
      this.el.innerHTML = this.template(this.children)
    } else {
      this.el.innerHTML = this.loadingTemplate()
    }
  }

  this.initialize()
}
