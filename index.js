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

// get the data from JSON file
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
        .attr('r', 0)
        .attr('fill', d => d.fill)
        //transition starts
        .transition().duration(3500)
            .attr('r', d => d.radius)
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


// scales
const y = d3.scaleLinear()
    .range([graphHeight, 0]);

const x = d3.scaleBand()
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2)

// create the axes
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y)
     .ticks(3)
     .tickFormat(d => d + ' orders');

// update x axis text
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange')

const t = d3.transition().duration(3500)

// update function: D3 UPDATE PATTERN
const update = (data) => {
    
    // updating scale domains
    y.domain([0, d3.max(data, d => d.orders)])  
    x.domain(data.map(item => item.name))

    // join the data to rects
    const rects2 = graph.selectAll('rect')
        .data(data)
    
    // remove exit selection
    rects2.exit().remove()

    // update rects that are already in DOM 
    rects2.attr('width', x.bandwidth)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        // codes below is commented because I am merging it in enter section
        // .transition(t)
        //     .attr('height', d => graphHeight - y(d.orders))
        //     .attr('y', d => y(d.orders))

    // append enter selection to the DOM
    rects2.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        //starting condition for x 0
        .attr('height', 0)
        .attr('fill', 'orange')
        .attr('x', d => (x(d.name)))
        //starting condition for y 0
        .attr('y', graphHeight)
        .merge(rects2)
        //transition starts
        .transition(t)
            .attrTween('width', widthTween)
            //ending conditions
            .attr('y', d => y(d.orders))
            .attr('height', d => graphHeight - y(d.orders))


    // call axis
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
};

let data = [];

// get the data from firestore
db.collection('dishes').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id}
        
        switch (change.type) {
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id)
                data[index] = doc
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id)
                break;
            default:
                break;
        }

        console.log(change);

    });

    update(data)

})



// TWEENS

const widthTween = (d) => {

    // define interpolation
    // d3.interpolate returns a function which we call 'i'
    let i = d3.interpolate(0, x.bandwidth);

    // return a function which takes in a time ticker 't'
    return function(t) {
        
        // return the value from passing the ticker into the interpolation
        return i(t); 
    }
    
}