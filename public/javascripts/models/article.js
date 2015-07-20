namespace('News.Models')

News.Models.Article = function(config) {
  this.headline = config.headline
  this.author   = config.author
  this.date     = config.date
  this.story    = config.story

  this.toJSON = function() {
    return {
      headline: this.headline,
      author:   this.author,
      date:     this.date,
      story:    this.story
    }
  }
}
