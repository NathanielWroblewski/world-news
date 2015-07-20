namespace('News.Collections')

News.Collections.Articles = function(config) {
  this.model      = config.model
  this.url        = config.url
  this.collection = config.collection || []
  this.apiKey     = config.apiKey
  this.country    = config.country

  this._on = {
    change:  [],
    loading: []
  }

  this.fetch = function() {
    this.collection = []
    this.trigger('loading')

    d3.json(this.getBaseUrl(), function(api) {
      var randomIndex = Math.floor(Math.random() * api.response.results.length),
          article = api.response.results[randomIndex];

      if (article) {
        d3.json(this.getArticleUrl(article), function (press) {
          var article = new this.model({
            headline: press.response.content.fields.headline,
            story:    press.response.content.fields.body,
            author:   press.response.content.fields.publication,
            date:     press.response.content.webPublicationDate.replace(/T.*/, '')
          })
          this.collection.push(article)
          this.trigger('change')
        }.bind(this))
      }
    }.bind(this))
  }

  this.setCountry = function(country) {
    this.country = country
    this.fetch()
  }

  this.getBaseUrl = function() {
    return this.url + '?api-key=' + this.apiKey + '&section=world&q=' +
      encodeURIComponent(this.country)
  }

  this.getArticleUrl = function(article) {
    return article.apiUrl + '?show-fields=body,headline,publication&api-key=' +
      this.apiKey
  }

  this.toJSON = function() {
    var json = []

    for (var i = 0; i < this.collection.length; i++) {
      json.push(this.collection[i].toJSON())
    }
    return json
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
