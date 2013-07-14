require.config({
  paths: {
      jquery:     '../bower_components/jquery/jquery',
      es5shim:    '../bower_components/es5-shim/es5-shim',
      es5sham:    '../bower_components/es5-shim/es5-sham',
      flight:     '../bower_components/flight/',
      d3:         '../bower_components/d3/d3',
      d3chart:    '../bower_components/d3.chart/d3.chart',
      mousetrap:  '../bower_components/mousetrap/mousetrap',
      bootstrap:  'vendor/bootstrap'
    },
    shim: {
      jquery: {
        exports: '$'
      },
      bootstrap: {
        deps: ['jquery']
      },
      d3chart: {
        deps: ['d3']
      },
      flight: {
        deps: ['jquery', 'es5shim', 'es5sham']
      }
    }
  });

require(['app', 'jquery'], function (app, $) {
  'use strict';

  $().ready(function () {
    app.init();
  });

});
