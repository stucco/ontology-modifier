/* global define, d3, _ */
/* jshint camelcase: false */
define(
  [
    'flight/lib/component',
    'jquery',
    'underscore',
    'd3',
    'd3chart'
  ],

  function(defineComponent) {
    'use strict';

    function vis() {
      var vis
        , color = d3.scale.category10()
        , force = d3.layout.force()
        , r     = 12
        , drag;

      this.after('initialize', function() {
        init(this.node, this.attr);
        this.on(document, 'nodeUpdate', update);
      });

      function init(el, attr) {
        vis = d3.select(el).append('svg')
          .attr('width', attr.width)
          .attr('height', attr.height);

        force.size([attr.width, attr.height])
          .linkDistance( d3.min([attr.width, attr.height]) / 2 )
          .charge( -(attr.width * 0.8) );

        // See Sticky Force Layout: http://bl.ocks.org/mbostock/3750558
        drag = force.drag()
          .on('dragstart', function dragstart(d) {
            d.fixed = true;
            d3.select(this).classed('fixed', true); // TODO style
          });

        force.on('tick', useTheForce);
      }

      function useTheForce() {
        vis.selectAll('line')
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

        vis.selectAll('.linktext')
          .attr('dx', function(d) { return (d.source.x + d.target.x)/2; })
          .attr('dy', function(d) { return (d.source.y + d.target.y)/2; });

        vis.selectAll('.nodetext')
          .attr('dx', function(d) { return d.x; })
          .attr('dy', function(d) { return d.y; });

        vis.selectAll('circle')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });
      }

      function parent(el) {
        return el.parentNode.__data__;
      }

      function update(evt, d) {
        force.nodes( d.nodes )
          .links( d.links );
        updateLinks();
        updateNodes();
        force.start();
      }

      function updateLinks() {
        var link = vis.selectAll('.link')
          .data(force.links(), function(d) {  return d._id; } );

        link.exit().remove();

        var linkG = link.enter().append('g')
          .attr('class', 'link');

        linkG.append('line');
        linkG.append('text').attr('class', 'linktext');

        link.selectAll('line')
          .style('stroke-width', 1)
          .style('stroke', 'black'); // TODO style

        link.selectAll('text')
          .text(function() { return parent(this)._label; });
      }

      function updateNodes() {
        var node = vis.selectAll('.node')
          .data(force.nodes(), function(d) { return d._id; } );

        node.exit().remove();

        var nodeG = node.enter().append('g')
          .attr('class', 'node');

        nodeG.append('circle');
        nodeG.append('title');
        nodeG.append('text').attr('class', 'nodetext');

        node.selectAll('circle')
          .attr('r', r)
          .style('fill', function() { return color(parent(this).group); })
          .call(drag);

        node.selectAll('title')
          .text(function() { return parent(this).group; });

        node.selectAll('.nodetext')
          .attr('x', r)
          .attr('dy', '.35em')
          .text(function() { return parent(this).name; });
      }
    }
    return defineComponent(vis);
  }
);
