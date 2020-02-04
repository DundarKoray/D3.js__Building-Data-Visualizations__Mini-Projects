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



// External Data Practice with JSON
// select svg container first

const svg1 = d3.select('.svg_json')

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




// Linear Scale Practices
// select the svg container first

const svg2 = d3.select('.svg_linear-scale')

d3.json('./menu.json').then(someData => {

    //scaling half size
    const y = d3.scaleLinear()
        .domain([0, 1000])
        .range([0, 500]);

    // console.log(y(400)) // output 200
    // console.log(y(0)) // output 0
    // console.log(y(900)) // output 450

    // join the data to rects
    const rects2 = svg2.selectAll('rect').data(someData)
    
    // update rects that are already in DOM / add attrs to rects that are already in DOM
    rects2.attr('width', 50)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', (d,i) => i * 70)
    
    // append enter selection to the DOM
    rects2.enter()
        .append('rect')
        .attr('width', 50)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', (d,i) => i * 70)

})