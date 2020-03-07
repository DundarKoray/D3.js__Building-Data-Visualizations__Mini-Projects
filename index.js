// const someData = [
//     {width: 200, height: 100, fill: 'purple'},
//     {width: 100, height: 60, fill: 'pink'},
//     {width: 50, height: 30, fill: 'red'}
// ];

// const svg = d3.select('svg');

// // joining data to rects
// const rects = svg.selectAll('rect')
//     .data(someData)


// // add attrs to rects already in the DOM
// rects
//     .attr("width", (d, i, n) => d.width)
//     .attr("height", d => d.height)
//     .attr('fill', d => d.fill);

// // append the enter selection to DOM
// rects.enter()
//     .append('rect')
//     .attr("width", (d, i, n) => d.width)
//     .attr("height", d => d.height)
//     .attr('fill', d => d.fill);


// PLANETS
// External Data Practice with JSON
// select svg container first

// const svg1 = d3.select('.svg_json')
const svg1 = d3.select('.canvas1')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600)

d3.json('./planets.json').then(someData => {

    // join the data to circs
    const circs1 = svg1.selectAll('circle').data(someData)

    // add attrs to circs already in DOM (incase if there is hardcoded circle in HTML)
    circs1.attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill)

    // append the enter selection to the DOM
    circs1.enter()
        .append('circle')
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill)
})


















// RESTAURANT ORDERS
// Linear Scale & Band Scale Practices
// select the svg container first


const svg2 = d3.select('.canvas2')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600)

// create margins and dimensions
const margin = {top:20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg2.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

d3.json('./menu.json').then(someData => {

    //scaling half size
    const y = d3.scaleLinear()
        .domain([0, d3.max(someData, d => d.orders)])
        .range([0, graphHeight]);

        // console.log(y(400)) // output 200
        // console.log(y(0)) // output 0
        // console.log(y(900)) // output 450


    // const min = d3.min(someData, d => d.orders)
    // const max = d3.max(someData, d => d.orders)
    // const extent = d3.extent(someData, d => d.orders)
    
    //console.log(min) //finds the lowest point
    //console.log(max) //finds the highest point
    //console.log(extent) //an array with the lowest and highest point



    const x = d3.scaleBand()
        .domain(someData.map(item => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2)
    
    

    // join the data to rects
    const rects2 = graph.selectAll('rect')
        .data(someData)
    
    // update rects that are already in DOM / add attrs to rects that are already in DOM
    rects2.attr('width', x.bandwidth)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
    
    // append enter selection to the DOM
    rects2.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => (x(d.name)))

    // create and call the axes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

})