/* globals angular */

var dgMovieApp = angular.module('dgMovieApp', [])

// -------------------------------------------------------------------------------------------------
// Movies list.
//

function MoviesListController ($scope, $element, $attrs, $http) {
  var ctrl = this

  // Set initial bindings.
  ctrl.filter = null
  ctrl.movies = []
  ctrl.filters = [
    {
      label: '2000\'s',
      min: 2000,
      max: 2009
    },
    {
      label: '1990\'s',
      min: 1990,
      max: 1999
    }
  ]

  // Fetch movies data.
  $http.get('//www.omdbapi.com/?s=Batman&apikey=2b48aeda').then(function success (response) {
    // @todo: Validate return data succeeded, or show error.
    if (!response || !response.data || !response.data.Search) {
      ctrl.movies = []
      ctrl.error = 'No movies returned'
      return
    }
    // Reset error.
    ctrl.error = null
    // Only take first 10, per requirements in readme.md.
    ctrl.movies = response.data.Search.slice(0, 10)
    // Fetch additional details for each movie.
    ctrl.movies.forEach(function (movie, i) {
      $http.get('//www.omdbapi.com/?i=' + movie.imdbID + '&apikey=2b48aeda').then(function success (response) {
        Object.keys(response.data).forEach(function (key) {
          movie[key] = response.data[key]
        })
        // Mark as initialized.
        movie.initialized = true
      }, function error (response) {
        movie.error = response.data
      })
    })
  }, function error (response) {
    ctrl.error = response.data
  })
}

dgMovieApp.component('moviesList', {
  templateUrl: 'content/templates/movies-list.html',
  controller: ['$scope', '$element', '$attrs', '$http', MoviesListController]
})

// -------------------------------------------------------------------------------------------------
// Movies filters.
//

function MoviesFilterController () {
  var ctrl = this

  ctrl.updateActiveFilter = function (filter) {
    // Toggle off if already active. Otherwise activate it.
    if (filter.active) {
      filter.active = false
      ctrl.activeFilter = null
    } else {
      if (ctrl.activeFilter) ctrl.activeFilter.active = false
      ctrl.activeFilter = filter
      filter.active = true
    }
  }
}

dgMovieApp.component('moviesFilter', {
  templateUrl: 'content/templates/movies-filter.html',
  controller: MoviesFilterController,
  bindings: {
    filters: '<',
    activeFilter: '='
  }
})

dgMovieApp.filter('byDecade', function () {
  return function (movies, years) {
    if (!years) return movies
    return movies.filter(function (movie) {
      return (typeof years.min !== 'number' || movie.Year >= years.min) && (typeof years.max !== 'number' || movie.Year <= years.max)
    })
  }
})

// -------------------------------------------------------------------------------------------------
// Movie details.
//

dgMovieApp.component('movieDetail', {
  templateUrl: 'content/templates/movie-detail.html',
  bindings: {
    movie: '<'
  }
})
