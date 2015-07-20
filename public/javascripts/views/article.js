namespace('News.Views')

News.Views.Article = function(config) {
  this.model = config.model

  this.template = function(article) {
    var story = article.story.split('\n').join('</p><p>'),
        html = '' +
          '<h2 class="headline">'  + article.headline + '</h2>' +
          '<p class="date">'       + article.date     + '</p>'  +
          '<p class="author"> - '  + article.author   + '</p>'  +
          '<div class="story"><p>' + story            + '</p></div>'

    return html
  }

  this.render = function() {
    return this.template(this.model)
  }
}
