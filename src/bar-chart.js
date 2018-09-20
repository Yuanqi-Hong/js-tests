import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right

const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.25)

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, height])

const colorScale = d3
  .scaleOrdinal()
  .range(['#A379E5', '#DDA0DB', '#7FB1F6', '#F9E6DF', '#6876F0', '#E57979'])

const yAxisScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high

  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // Setting up the domain of the xPositionScale

  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  // adding bars

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('y', d => {
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', '#362C36')

  // adding axis

  const yAxis = d3
    .axisLeft(yAxisScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

  // adding events

  d3.select('#asia').on('click', function() {
    svg
      .selectAll('rect')
      .transition()
      .attr('fill', function(d) {
        if (d.continent === 'Asia') {
          return '#FFA500'
        } else {
          return '#362C36'
        }
      })
  })

  d3.select('#africa').on('click', function() {
    svg
      .selectAll('rect')
      .transition()
      .attr('fill', function(d) {
        if (d.continent === 'Africa') {
          return '#FFA500'
        } else {
          return '#362C36'
        }
      })
  })

  d3.select('#north-america').on('click', function() {
    svg
      .selectAll('rect')
      .transition()
      .attr('fill', function(d) {
        if (d.continent === 'N. America') {
          return '#FFA500'
        } else {
          return '#362C36'
        }
      })
  })

  d3.select('#low-gdp').on('click', function() {
    svg
      .selectAll('rect')
      .transition()
      .attr('fill', function(d) {
        if (d.gdp_per_capita <= 4000) {
          return '#FFA500'
        } else {
          return '#362C36'
        }
      })
  })

  d3.select('#by-continent').on('click', function() {
    svg
      .selectAll('rect')
      .transition()
      .attr('fill', function(d) {
        return colorScale(d.continent)
      })
  })

  d3.select('#reset').on('click', function() {
    svg
      .selectAll('rect')
      .transition()
      .attr('fill', '#362C36')
  })
}
