!function() {
  var articles = new News.Collections.Articles({
    model:  News.Models.Article,
    url:    'https://content.guardianapis.com/search',
    apiKey: 'ce994b10-e106-46bb-a2d6-56a17c396c85'
  })

  var articlesView = new News.Views.Articles({
    el:         document.querySelector('.articles'),
    view:       News.Views.Article,
    collection: articles
  })

  var globe = new News.Models.Globe()

  var globeView = new News.Views.Globe({
    el:        d3.select('.globe svg'),
    model:     globe,
    countries: News.Datasets.Countries
  })

  // set window-level event handlers
  d3.select(window)
    .on('mousemove', globeView.handleMouseMove.bind(globeView))
    .on('mouseup',   globeView.handleMouseUp.bind(globeView))

  globeView.on('select', articles.setCountry.bind(articles))

  // resize globe with window
  window.onresize = function() {
    if (window.innerWidth < 401) {
      var height = 300,
          width  = window.innerWidth
    } else {
      var height = window.innerHeight,
          width  = window.innerWidth * 0.5
    }

    globe.setDimensions({
      height: height,
      width:  width
    })
  }
  window.onresize()

  // Select United States
  d3.select(d3.selectAll('path')[0][167]).each(function(d, i) {
    var onClickFunc = d3.select(this).on('dblclick')

    onClickFunc.apply(this, [d, i])
  });
}()
