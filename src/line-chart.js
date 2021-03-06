import * as d3 from 'd3'

var margin = { top: 40, left: 50, right: 50, bottom: 40 }

var height = 300 - margin.top - margin.bottom

var width = 600 - margin.left - margin.right

var svg = d3
  .select('#line-chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var parseTime = d3.timeParse('%Y-%m-%d')

var xPositionScale = d3.scaleLinear().range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([90, 125])
  .range([height, 0])

var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.Close)
  })
  .curve(d3.curveMonotoneX)

d3.csv(require('./AAPL.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.Date)
  })
  const dates = datapoints.map(function(d) {
    return d.datetime
  })

  const dateMax = d3.max(dates)
  const dateMin = d3.min(dates)

  xPositionScale.domain([dateMin, dateMax])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', '#4CC1FC')
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('cx', d => {
      return xPositionScale(d.datetime)
    })
    .attr('cy', d => {
      return yPositionScale(d.Close)
    })
    .attr('r', 3)
    .attr('fill', '#4CC1FC')
    .on('mouseover', (d, i, nodes) => {
      d3.select(nodes[i])
        .transition()
        .duration(100)
        .attr('r', 5)
      d3.select('#date').text(d.Date)
      d3.select('#open').text(parseFloat(d.Open).toFixed(2))
      d3.select('#close').text(parseFloat(d.Close).toFixed(2))
      d3.select('#high').text(parseFloat(d.High).toFixed(2))
      d3.select('#low').text(parseFloat(d.Low).toFixed(2))
      d3.select('#volume').text(parseInt(d.Volume).toLocaleString())
      d3.select('#adj-close').text(parseFloat(d['Adj Close']).toFixed(2))
      d3.select('#info').style('display', 'block')
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .attr('fill', '#4CC1FC')
        .attr('r', 3)
    })

  svg
    .append('text')
    .text('AAPL stock price')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', 22)
    .attr('font-weight', 'bold')

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %Y'))
    .ticks(5)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([100, 110, 120])
    .tickSize(-width)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path').remove()
  svg
    .selectAll('.y-axis line')
    .attr('stroke-dasharray', 2)
    .attr('stroke', 'grey')
}
